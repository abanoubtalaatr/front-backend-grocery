<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\ContactMessage;
use App\Models\Meal;
use App\Models\Order;
use App\Models\Review;
use App\Models\SupportReport;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Overview numbers for the dashboard landing screen.
 */
class StatsController extends AdminController
{
    /** Orders that never became revenue. */
    private const NON_REVENUE_STATUSES = ['cancelled'];

    public function index(Request $request): JsonResponse
    {
        $days = max(7, min((int) $request->query('days', 14), 90));
        $since = CarbonImmutable::today()->subDays($days - 1);
        $previousSince = $since->subDays($days);

        $revenue = fn ($query) => $query->whereNotIn('status', self::NON_REVENUE_STATUSES);

        $currentRevenue = (float) $revenue(Order::query())->where('created_at', '>=', $since)->sum('total');
        $previousRevenue = (float) $revenue(Order::query())
            ->whereBetween('created_at', [$previousSince, $since])
            ->sum('total');

        $currentOrders = Order::query()->where('created_at', '>=', $since)->count();
        $previousOrders = Order::query()->whereBetween('created_at', [$previousSince, $since])->count();

        $currentCustomers = User::query()->where('created_at', '>=', $since)->count();
        $previousCustomers = User::query()->whereBetween('created_at', [$previousSince, $since])->count();

        return $this->ok([
            'range' => [
                'days' => $days,
                'from' => $since->toDateString(),
                'to' => CarbonImmutable::today()->toDateString(),
            ],
            'totals' => [
                'revenue' => round($currentRevenue, 2),
                'revenue_change' => $this->percentChange($currentRevenue, $previousRevenue),
                'orders' => $currentOrders,
                'orders_change' => $this->percentChange($currentOrders, $previousOrders),
                'customers' => $currentCustomers,
                'customers_change' => $this->percentChange($currentCustomers, $previousCustomers),
                'average_order_value' => $currentOrders > 0 ? round($currentRevenue / $currentOrders, 2) : 0.0,
                'all_time_orders' => Order::query()->count(),
                'all_time_customers' => User::query()->count(),
                'products' => Meal::query()->count(),
                'pending_reviews' => Review::query()->where('is_approved', false)->count(),
                'open_messages' => ContactMessage::query()->where('status', 'new')->count(),
                'open_reports' => SupportReport::query()->where('status', 'new')->count(),
            ],
            'revenue_series' => $this->revenueSeries($since, $days),
            'orders_by_status' => $this->ordersByStatus(),
            'top_products' => $this->topProducts($since),
            'low_stock' => $this->lowStock(),
            'recent_orders' => $this->recentOrders(),
        ], 'Dashboard statistics retrieved successfully');
    }

    private function percentChange(float $current, float $previous): ?float
    {
        if ($previous <= 0.0) {
            // No baseline to compare against — the UI renders "—" rather than a fake +100%.
            return null;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    /**
     * Daily revenue + order count, zero-filled so the chart has no gaps.
     *
     * @return array<int, array{date: string, revenue: float, orders: int}>
     */
    private function revenueSeries(CarbonImmutable $since, int $days): array
    {
        $rows = Order::query()
            ->whereNotIn('status', self::NON_REVENUE_STATUSES)
            ->where('created_at', '>=', $since)
            ->selectRaw('DATE(created_at) as day, SUM(total) as revenue, COUNT(*) as orders')
            ->groupBy('day')
            ->get()
            ->keyBy(fn ($row) => (string) $row->day);

        $series = [];
        for ($i = 0; $i < $days; $i++) {
            $date = $since->addDays($i)->toDateString();
            $row = $rows->get($date);
            $series[] = [
                'date' => $date,
                'revenue' => round((float) ($row->revenue ?? 0), 2),
                'orders' => (int) ($row->orders ?? 0),
            ];
        }

        return $series;
    }

    /** @return array<int, array{status: string, count: int}> */
    private function ordersByStatus(): array
    {
        return Order::query()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($row) => ['status' => (string) $row->status, 'count' => (int) $row->count])
            ->all();
    }

    /** @return array<int, array<string, mixed>> */
    private function topProducts(CarbonImmutable $since): array
    {
        return DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('meals', 'meals.id', '=', 'order_items.meal_id')
            ->whereNotIn('orders.status', self::NON_REVENUE_STATUSES)
            ->where('orders.created_at', '>=', $since)
            ->selectRaw('meals.id, meals.title, SUM(order_items.quantity) as quantity, SUM(order_items.subtotal) as revenue')
            ->groupBy('meals.id', 'meals.title')
            ->orderByDesc('quantity')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'id' => (int) $row->id,
                'title' => (string) $row->title,
                'quantity' => (int) $row->quantity,
                'revenue' => round((float) $row->revenue, 2),
            ])
            ->all();
    }

    /** @return array<int, array<string, mixed>> */
    private function lowStock(): array
    {
        return Meal::query()
            ->where('stock_quantity', '<=', 5)
            ->orderBy('stock_quantity')
            ->limit(5)
            ->get(['id', 'title', 'stock_quantity', 'is_available'])
            ->map(fn (Meal $meal) => [
                'id' => $meal->id,
                'title' => $meal->title,
                'stock_quantity' => $meal->stock_quantity,
                'is_available' => $meal->is_available,
            ])
            ->all();
    }

    /** @return array<int, array<string, mixed>> */
    private function recentOrders(): array
    {
        return Order::query()
            ->with('user:id,username,email')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total' => (float) $order->total,
                'customer' => $order->user?->username ?: $order->user?->email,
                'created_at' => $order->created_at,
            ])
            ->all();
    }
}
