<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Subcategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubcategoryController extends AdminController
{
    private const SORTABLE = ['id', 'name', 'order', 'created_at'];

    public function index(Request $request): JsonResponse
    {
        [$column, $direction] = $this->sort($request, self::SORTABLE, 'order');

        $query = Subcategory::query()
            ->with('category:id,name')
            ->withCount('meals')
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('category_id'), fn ($q) => $q->where('category_id', $request->integer('category_id')))
            ->when($request->filled('is_active'), fn ($q) => $q->where('is_active', $request->boolean('is_active')))
            ->orderBy($column, $direction);

        if ($request->boolean('all')) {
            return $this->ok(
                $query->get()->map(fn (Subcategory $s) => $this->transform($s)),
                'Subcategories retrieved successfully',
            );
        }

        return $this->paginated(
            $query->paginate($this->perPage($request)),
            fn (Subcategory $s) => $this->transform($s),
            'Subcategories retrieved successfully',
        );
    }

    public function show(Subcategory $subcategory): JsonResponse
    {
        $subcategory->load('category:id,name')->loadCount('meals');

        return $this->ok($this->transform($subcategory), 'Subcategory retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['slug'] = $this->uniqueSlug($data['name']);
        $data['image_url'] = $this->resolveImage($request, 'image_url', 'subcategories');

        $subcategory = Subcategory::create($data);

        return $this->ok($this->transform($subcategory->fresh('category')), 'Subcategory created successfully', 201);
    }

    public function update(Request $request, Subcategory $subcategory): JsonResponse
    {
        $data = $request->validate([
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        if (isset($data['name']) && $data['name'] !== $subcategory->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $subcategory->id);
        }

        $image = $this->resolveImage($request, 'image_url', 'subcategories');
        if ($image !== null) {
            $data['image_url'] = $image;
        }

        $subcategory->update($data);

        return $this->ok($this->transform($subcategory->fresh('category')), 'Subcategory updated successfully');
    }

    public function destroy(Subcategory $subcategory): JsonResponse
    {
        if ($subcategory->meals()->exists()) {
            return $this->fail('This subcategory still has products. Move or delete them first.', 409);
        }

        $subcategory->delete();

        return $this->ok(null, 'Subcategory deleted successfully');
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'subcategory';
        $slug = $base;
        $suffix = 2;

        while (Subcategory::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }

    /** @return array<string, mixed> */
    private function transform(Subcategory $subcategory): array
    {
        return [
            'id' => $subcategory->id,
            'category_id' => $subcategory->category_id,
            'category' => $subcategory->category
                ? ['id' => $subcategory->category->id, 'name' => $subcategory->category->name]
                : null,
            'name' => $subcategory->name,
            'slug' => $subcategory->slug,
            'description' => $subcategory->description,
            'image_url' => $subcategory->image_url,
            'is_active' => $subcategory->is_active,
            'order' => $subcategory->order,
            'meals_count' => $subcategory->meals_count ?? null,
            'created_at' => $subcategory->created_at,
        ];
    }
}
