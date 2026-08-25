<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends AdminController
{
    private const SORTABLE = ['id', 'username', 'email', 'loyalty_points', 'created_at'];

    public function index(Request $request): JsonResponse
    {
        [$column, $direction] = $this->sort($request, self::SORTABLE);

        $users = User::query()
            ->withCount('orders')
            ->withSum(['orders as orders_total' => fn ($q) => $q->where('status', '!=', 'cancelled')], 'total')
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = '%'.$request->string('search').'%';
                $query->where(function ($inner) use ($term) {
                    $inner->where('username', 'like', $term)
                        ->orWhere('email', 'like', $term)
                        ->orWhere('phone', 'like', $term)
                        ->orWhere('firstname', 'like', $term)
                        ->orWhere('lastname', 'like', $term);
                });
            })
            ->when($request->filled('is_active'), fn ($q) => $q->where('is_active', $request->boolean('is_active')))
            ->when($request->filled('is_admin'), fn ($q) => $q->where('is_admin', $request->boolean('is_admin')))
            ->orderBy($column, $direction)
            ->paginate($this->perPage($request));

        return $this->paginated($users, fn (User $user) => $this->transform($user), 'Users retrieved successfully');
    }

    public function show(User $user): JsonResponse
    {
        $user->loadCount('orders');
        $user->load(['orders' => fn ($q) => $q->latest()->limit(10)]);

        return $this->ok($this->transform($user) + [
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'gender' => $user->gender,
            'birthday' => $user->birthday,
            'store_credits' => $user->store_credits,
            'app_language' => $user->app_language,
            'recent_orders' => $user->orders->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total' => (float) $order->total,
                'created_at' => $order->created_at,
            ]),
        ], 'User retrieved successfully');
    }

    /**
     * Admins may flip account flags and adjust loyalty balances — nothing else.
     * Profile fields stay the user's own to edit.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'is_active' => ['nullable', 'boolean'],
            'is_admin' => ['nullable', 'boolean'],
            'loyalty_points' => ['nullable', 'integer', 'min:0'],
            'store_credits' => ['nullable', 'numeric', 'min:0'],
        ]);

        // Guard against an admin locking themselves out of the dashboard.
        if ($user->id === $request->user()->id) {
            if (array_key_exists('is_admin', $data) && $data['is_admin'] === false) {
                return $this->fail('You cannot remove your own admin access.', 409);
            }
            if (array_key_exists('is_active', $data) && $data['is_active'] === false) {
                return $this->fail('You cannot deactivate your own account.', 409);
            }
        }

        $user->update($data);

        return $this->ok($this->transform($user->fresh()), 'User updated successfully');
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return $this->fail('You cannot delete your own account.', 409);
        }

        $user->delete();

        return $this->ok(null, 'User deleted successfully');
    }

    /** @return array<string, mixed> */
    private function transform(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'phone' => $user->phone,
            'country_code' => $user->country_code,
            'avatar' => $user->avatar,
            'is_active' => $user->is_active,
            'is_admin' => $user->is_admin,
            'email_verified' => $user->email_verified,
            'phone_verified' => $user->phone_verified,
            'loyalty_points' => $user->loyalty_points,
            'orders_count' => $user->orders_count ?? null,
            'orders_total' => isset($user->orders_total) ? round((float) $user->orders_total, 2) : null,
            'created_at' => $user->created_at,
        ];
    }
}
