<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends AdminController
{
    private const SORTABLE = ['id', 'name', 'sort_order', 'created_at'];

    public function index(Request $request): JsonResponse
    {
        [$column, $direction] = $this->sort($request, self::SORTABLE, 'sort_order');

        // `?all=1` powers the select boxes on the product form — no pagination there.
        if ($request->boolean('all')) {
            $categories = Category::query()
                ->withCount(['meals', 'subcategories'])
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get();

            return $this->ok($categories->map(fn (Category $c) => $this->transform($c)), 'Categories retrieved successfully');
        }

        $categories = Category::query()
            ->withCount(['meals', 'subcategories'])
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('is_active'), fn ($q) => $q->where('is_active', $request->boolean('is_active')))
            ->orderBy($column, $direction)
            ->paginate($this->perPage($request));

        return $this->paginated($categories, fn (Category $c) => $this->transform($c), 'Categories retrieved successfully');
    }

    public function show(Category $category): JsonResponse
    {
        $category->loadCount(['meals', 'subcategories']);

        return $this->ok($this->transform($category), 'Category retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['slug'] = $this->uniqueSlug($data['name']);
        $data['image'] = $this->resolveImage($request, 'image', 'categories');

        $category = Category::create($data);

        return $this->ok($this->transform($category), 'Category created successfully', 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if (isset($data['name']) && $data['name'] !== $category->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $category->id);
        }

        $image = $this->resolveImage($request, 'image', 'categories');
        if ($image !== null) {
            $data['image'] = $image;
        }

        $category->update($data);

        return $this->ok($this->transform($category->fresh()), 'Category updated successfully');
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->meals()->exists()) {
            return $this->fail('This category still has products. Move or delete them first.', 409);
        }

        $category->delete();

        return $this->ok(null, 'Category deleted successfully');
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'category';
        $slug = $base;
        $suffix = 2;

        while (Category::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }

    /** @return array<string, mixed> */
    private function transform(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'image_url' => $category->image_url,
            'is_active' => $category->is_active,
            'sort_order' => $category->sort_order,
            'meals_count' => $category->meals_count ?? null,
            'subcategories_count' => $category->subcategories_count ?? null,
            'created_at' => $category->created_at,
        ];
    }
}
