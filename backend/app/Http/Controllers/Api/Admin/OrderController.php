<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends AdminController
{
    private const SORTABLE = ['id', 'order_number', 'total', 'status', 'created_at'];

    /**
     * Statuses the schema allows, in lifecycle order.
     *
     * Kept in sync with the `orders.status` enum — see the
     * `update_orders_table_status_and_delivery_time` migration.
     */
    public const STATUSES = ['placed', 'processing', 'shipping', 'out_for_delivery', 'delivered', 'cancelled'];

    /** Column stamped when an order enters a given status. */
    private const STATUS_TIMESTAMPS = [
        'placed' => 'placed_at',
        'processing' => 'processing_at',
        'shipping' => 'shipping_at',
        'out_for_delivery' => 'out_for_delivery_at',
        'delivered' => 'delivered_at',
        'cancelled' => 'cancelled_at',
    ];

    public function index(Request $request): JsonResponse
    {
        [$column, $direction] = $this->sort($request, self::SORTABLE);

        $orders = Order::query()
            ->with('user:id,username,email,phone')
            ->withCount('items')
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = '%'.$request->string('search').'%';
                $query->where(function ($inner) use ($term) {
                    $inner->where('order_number', 'like', $term)
                        ->orWhereHas('user', fn ($u) => $u->where('username', 'like', $term)
                            ->orWhere('email', 'like', $term)
                            ->orWhere('phone', 'like', $term));
                });
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('payment_method'), fn ($q) => $q->where('payment_method', $request->string('payment_method')))
            ->when($request->filled('delivery_type'), fn ($q) => $q->where('delivery_type', $request->string('delivery_type')))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('created_at', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('created_at', '<=', $request->date('to')))
            ->orderBy($column, $direction)
            ->paginate($this->perPage($request));

        return $this->paginated($orders, fn (Order $order) => $this->transform($order), 'Orders retrieved successfully');
    }

    public function show(Order $order): JsonResponse
    {
        $order->load([
            'user:id,username,firstname,lastname,email,phone',
            'items.meal:id,title,image',
            'address',
        ]);

        return $this->ok($this->transform($order, true), 'Order retrieved successfully');
    }

    /**
     * Move an order along its lifecycle and stamp the matching timestamp.
     */
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(self::STATUSES)],
        ]);

        $status = $validated['status'];

        if ($order->status === 'delivered' && $status !== 'delivered') {
            return $this->fail('A delivered order cannot change status.', 409);
        }

        $payload = ['status' => $status];
        $timestamp = self::STATUS_TIMESTAMPS[$status] ?? null;
        if ($timestamp !== null && $order->{$timestamp} === null) {
            $payload[$timestamp] = now();
        }

        $order->update($payload);

        return $this->ok($this->transform($order->fresh(['user'])), 'Order status updated successfully');
    }

    /** @return array<string, mixed> */
    private function transform(Order $order, bool $full = false): array
    {
        $row = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'payment_method' => $order->payment_method,
            'delivery_type' => $order->delivery_type,
            'subtotal' => (float) $order->subtotal,
            'tax' => (float) $order->tax,
            'discount' => (float) $order->discount,
            'total' => (float) $order->total,
            'items_count' => $order->items_count ?? $order->items->count(),
            'customer' => $order->user ? [
                'id' => $order->user->id,
                'name' => $order->user->username,
                'email' => $order->user->email,
                'phone' => $order->user->phone,
            ] : null,
            'created_at' => $order->created_at,
        ];

        if (! $full) {
            return $row;
        }

        return $row + [
            // `orders.notes` is a text column; the OrderNote relation is a separate
            // admin-facing log and is intentionally not exposed here.
            'notes' => $order->getAttribute('notes'),
            'schedule_delivery' => $order->schedule_delivery,
            'delivery_speed' => $order->delivery_speed,
            'address' => $order->address,
            'timeline' => [
                'placed_at' => $order->placed_at,
                'processing_at' => $order->processing_at,
                'shipping_at' => $order->shipping_at,
                'out_for_delivery_at' => $order->out_for_delivery_at,
                'delivered_at' => $order->delivered_at,
                'cancelled_at' => $order->cancelled_at,
                'estimated_delivery_time' => $order->estimated_delivery_time,
            ],
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'meal_id' => $item->meal_id,
                'title' => $item->meal?->title,
                'image_url' => $item->meal?->image_url,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'discount_amount' => (float) $item->discount_amount,
                'subtotal' => (float) $item->subtotal,
            ]),
        ];
    }
}
