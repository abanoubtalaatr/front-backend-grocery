<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends AdminController
{
    private const SORTABLE = ['id', 'rating', 'created_at'];

    public function index(Request $request): JsonResponse
    {
        [$column, $direction] = $this->sort($request, self::SORTABLE);

        $reviews = Review::query()
            ->with(['user:id,username,email', 'meal:id,title'])
            ->when($request->filled('search'), fn ($q) => $q->where('comment', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('is_approved'), fn ($q) => $q->where('is_approved', $request->boolean('is_approved')))
            ->when($request->filled('rating'), fn ($q) => $q->where('rating', $request->integer('rating')))
            ->when($request->filled('meal_id'), fn ($q) => $q->where('meal_id', $request->integer('meal_id')))
            ->orderBy($column, $direction)
            ->paginate($this->perPage($request));

        return $this->paginated($reviews, fn (Review $review) => $this->transform($review), 'Reviews retrieved successfully');
    }

    /**
     * Approve or un-approve a review. Approval is what makes it public, so it is
     * an explicit endpoint rather than a generic update.
     */
    public function setApproval(Request $request, Review $review): JsonResponse
    {
        $validated = $request->validate([
            'is_approved' => ['required', 'boolean'],
        ]);

        $review->update(['is_approved' => $validated['is_approved']]);

        return $this->ok($this->transform($review->fresh(['user', 'meal'])), 'Review updated successfully');
    }

    public function destroy(Review $review): JsonResponse
    {
        $review->delete();

        return $this->ok(null, 'Review deleted successfully');
    }

    /** @return array<string, mixed> */
    private function transform(Review $review): array
    {
        return [
            'id' => $review->id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'is_approved' => $review->is_approved,
            'images' => $review->images,
            'user' => $review->user ? ['id' => $review->user->id, 'name' => $review->user->username, 'email' => $review->user->email] : null,
            'meal' => $review->meal ? ['id' => $review->meal->id, 'title' => $review->meal->title] : null,
            'created_at' => $review->created_at,
        ];
    }
}
