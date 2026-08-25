<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Meal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Product (meal) management for the dashboard.
 */
class MealController extends AdminController
{
    private const SORTABLE = ['id', 'title', 'price', 'stock_quantity', 'sold_count', 'rating', 'created_at'];

    public function index(Request $request): JsonResponse
    {
        [$column, $direction] = $this->sort($request, self::SORTABLE);

        $meals = Meal::query()
            ->with(['category:id,name', 'subcategory:id,name'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = '%'.$request->string('search').'%';
                $query->where(function ($inner) use ($term) {
                    $inner->where('title', 'like', $term)
                        ->orWhere('brand', 'like', $term)
                        ->orWhere('slug', 'like', $term);
                });
            })
            ->when($request->filled('category_id'), fn ($q) => $q->where('category_id', $request->integer('category_id')))
            ->when($request->filled('subcategory_id'), fn ($q) => $q->where('subcategory_id', $request->integer('subcategory_id')))
            ->when($request->filled('is_available'), fn ($q) => $q->where('is_available', $request->boolean('is_available')))
            ->when($request->filled('is_featured'), fn ($q) => $q->where('is_featured', $request->boolean('is_featured')))
            ->when($request->boolean('low_stock'), fn ($q) => $q->where('stock_quantity', '<=', 5))
            ->orderBy($column, $direction)
            ->paginate($this->perPage($request));

        return $this->paginated($meals, fn (Meal $meal) => $this->transform($meal), 'Products retrieved successfully');
    }

    public function show(Meal $meal): JsonResponse
    {
        $meal->load(['category:id,name', 'subcategory:id,name']);

        return $this->ok($this->transform($meal, true), 'Product retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['title']);

        $image = $this->resolveImage($request, 'image', 'meals');
        if ($image === null) {
            return $this->fail('An image is required.', 422, ['image' => ['An image is required.']]);
        }
        $data['image'] = $image;

        $meal = Meal::create($data);

        return $this->ok($this->transform($meal->fresh(['category', 'subcategory']), true), 'Product created successfully', 201);
    }

    public function update(Request $request, Meal $meal): JsonResponse
    {
        $data = $this->validated($request, $meal);

        if (isset($data['title']) && $data['title'] !== $meal->title) {
            $data['slug'] = $this->uniqueSlug($data['title'], $meal->id);
        }

        $image = $this->resolveImage($request, 'image', 'meals');
        if ($image !== null) {
            $data['image'] = $image;
        } else {
            unset($data['image']);
        }

        $meal->update($data);

        return $this->ok($this->transform($meal->fresh(['category', 'subcategory']), true), 'Product updated successfully');
    }

    public function destroy(Meal $meal): JsonResponse
    {
        $meal->delete();

        return $this->ok(null, 'Product deleted successfully');
    }

    /**
     * Flip one boolean flag without sending the whole product back.
     */
    public function toggle(Request $request, Meal $meal): JsonResponse
    {
        $validated = $request->validate([
            'field' => ['required', Rule::in(['is_available', 'is_featured', 'is_hot'])],
        ]);

        $field = $validated['field'];
        $meal->update([$field => ! $meal->{$field}]);

        return $this->ok([
            'id' => $meal->id,
            $field => $meal->{$field},
        ], 'Product updated successfully');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Meal $meal = null): array
    {
        $required = $meal ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'description' => [$required, 'string'],
            'category_id' => [$required, 'integer', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'integer', 'exists:subcategories,id'],
            'price' => [$required, 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'offer_title' => ['nullable', 'string', 'max:255'],
            'size' => ['nullable', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:255'],
            'includes' => ['nullable', 'string'],
            'how_to_use' => ['nullable', 'string'],
            'features' => ['nullable', 'string'],
            'expiry_date' => ['nullable', 'date'],
            'available_date' => ['nullable', 'date'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['nullable', 'boolean'],
            'is_available' => ['nullable', 'boolean'],
            'is_hot' => ['nullable', 'boolean'],
        ]);
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'product';
        $slug = $base;
        $suffix = 2;

        while (Meal::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(Meal $meal, bool $full = false): array
    {
        $row = [
            'id' => $meal->id,
            'title' => $meal->title,
            'slug' => $meal->slug,
            'image_url' => $meal->image_url,
            'price' => (float) $meal->price,
            'discount_price' => $meal->getRawDiscountPrice(),
            'stock_quantity' => $meal->stock_quantity,
            'sold_count' => $meal->sold_count,
            'rating' => (float) $meal->rating,
            'rating_count' => $meal->rating_count,
            'is_available' => $meal->is_available,
            'is_featured' => $meal->is_featured,
            'is_hot' => $meal->is_hot,
            'category' => $meal->category ? ['id' => $meal->category->id, 'name' => $meal->category->name] : null,
            'subcategory' => $meal->subcategory ? ['id' => $meal->subcategory->id, 'name' => $meal->subcategory->name] : null,
            'created_at' => $meal->created_at,
        ];

        if (! $full) {
            return $row;
        }

        return $row + [
            'description' => $meal->description,
            'offer_title' => $meal->offer_title,
            'size' => $meal->size,
            'brand' => $meal->brand,
            'includes' => $meal->includes,
            'how_to_use' => $meal->how_to_use,
            'features' => $meal->features,
            'expiry_date' => $meal->expiry_date,
            'available_date' => $meal->available_date,
            'category_id' => $meal->category_id,
            'subcategory_id' => $meal->subcategory_id,
            'updated_at' => $meal->updated_at,
        ];
    }
}
