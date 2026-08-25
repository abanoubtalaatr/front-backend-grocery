<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Offer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OfferController extends AdminController
{
    private const SORTABLE = ['id', 'title', 'code', 'end_date', 'used_count', 'created_at'];

    private const TYPES = ['percentage', 'fixed', 'buy_one_get_one', 'free_shipping'];

    public function index(Request $request): JsonResponse
    {
        [$column, $direction] = $this->sort($request, self::SORTABLE);

        $offers = Offer::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = '%'.$request->string('search').'%';
                $query->where(fn ($inner) => $inner->where('title', 'like', $term)->orWhere('code', 'like', $term));
            })
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->string('type')))
            ->when($request->filled('is_active'), fn ($q) => $q->where('is_active', $request->boolean('is_active')))
            ->when($request->boolean('expired'), fn ($q) => $q->whereDate('end_date', '<', now()))
            ->orderBy($column, $direction)
            ->paginate($this->perPage($request));

        return $this->paginated($offers, fn (Offer $offer) => $this->transform($offer), 'Offers retrieved successfully');
    }

    public function show(Offer $offer): JsonResponse
    {
        return $this->ok($this->transform($offer), 'Offer retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules());
        $data['code'] = strtoupper($data['code']);

        $offer = Offer::create($data);

        return $this->ok($this->transform($offer), 'Offer created successfully', 201);
    }

    public function update(Request $request, Offer $offer): JsonResponse
    {
        $data = $request->validate($this->rules($offer));
        if (isset($data['code'])) {
            $data['code'] = strtoupper($data['code']);
        }

        $offer->update($data);

        return $this->ok($this->transform($offer->fresh()), 'Offer updated successfully');
    }

    public function destroy(Offer $offer): JsonResponse
    {
        $offer->delete();

        return $this->ok(null, 'Offer deleted successfully');
    }

    /** @return array<string, mixed> */
    private function rules(?Offer $offer = null): array
    {
        $required = $offer ? 'sometimes' : 'required';

        return [
            'title' => [$required, 'string', 'max:255'],
            'code' => [$required, 'string', 'max:50', Rule::unique('offers', 'code')->ignore($offer?->id)],
            'description' => ['nullable', 'string'],
            'type' => [$required, Rule::in(self::TYPES)],
            // `free_shipping` and BOGO carry no amount, so the value stays optional here
            // and is validated against the chosen type by the dashboard form.
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'minimum_purchase' => ['nullable', 'numeric', 'min:0'],
            'start_date' => [$required, 'date'],
            'end_date' => [$required, 'date', 'after_or_equal:start_date'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
        ];
    }

    /** @return array<string, mixed> */
    private function transform(Offer $offer): array
    {
        return [
            'id' => $offer->id,
            'title' => $offer->title,
            'code' => $offer->code,
            'description' => $offer->description,
            'type' => $offer->type,
            'discount_value' => $offer->discount_value !== null ? (float) $offer->discount_value : null,
            'minimum_purchase' => $offer->minimum_purchase !== null ? (float) $offer->minimum_purchase : null,
            'start_date' => $offer->start_date,
            'end_date' => $offer->end_date,
            'usage_limit' => $offer->usage_limit,
            'used_count' => $offer->used_count,
            'is_active' => $offer->is_active,
            'is_featured' => $offer->is_featured,
            'created_at' => $offer->created_at,
        ];
    }
}
