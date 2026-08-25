<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Faq;
use App\Models\Setting;
use App\Models\StaticPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Editorial surfaces: FAQs, static pages (SRS-16) and store settings.
 */
class ContentController extends AdminController
{
    // ---------------------------------------------------------------- FAQs

    public function faqs(Request $request): JsonResponse
    {
        $faqs = Faq::query()
            ->when($request->filled('search'), fn ($q) => $q->where('question', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('category'), fn ($q) => $q->where('category', $request->string('category')))
            ->when($request->filled('is_active'), fn ($q) => $q->where('is_active', $request->boolean('is_active')))
            ->orderBy('order')
            ->paginate($this->perPage($request));

        return $this->paginated($faqs, null, 'FAQs retrieved successfully');
    }

    public function storeFaq(Request $request): JsonResponse
    {
        $faq = Faq::create($request->validate($this->faqRules()));

        return $this->ok($faq, 'FAQ created successfully', 201);
    }

    public function updateFaq(Request $request, Faq $faq): JsonResponse
    {
        $faq->update($request->validate($this->faqRules(true)));

        return $this->ok($faq->fresh(), 'FAQ updated successfully');
    }

    public function destroyFaq(Faq $faq): JsonResponse
    {
        $faq->delete();

        return $this->ok(null, 'FAQ deleted successfully');
    }

    /** @return array<string, mixed> */
    private function faqRules(bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return [
            'question' => [$required, 'string', 'max:255'],
            'answer' => [$required, 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    // --------------------------------------------------------- Static pages

    public function pages(Request $request): JsonResponse
    {
        $pages = StaticPage::query()
            ->when($request->filled('search'), fn ($q) => $q->where('title', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('is_published'), fn ($q) => $q->where('is_published', $request->boolean('is_published')))
            ->orderBy('order')
            ->paginate($this->perPage($request));

        return $this->paginated($pages, null, 'Pages retrieved successfully');
    }

    public function showPage(StaticPage $page): JsonResponse
    {
        return $this->ok($page, 'Page retrieved successfully');
    }

    public function storePage(Request $request): JsonResponse
    {
        $data = $request->validate($this->pageRules());
        $data['slug'] = $this->uniquePageSlug($data['slug'] ?? $data['title']);

        $page = StaticPage::create($data);

        return $this->ok($page, 'Page created successfully', 201);
    }

    public function updatePage(Request $request, StaticPage $page): JsonResponse
    {
        $data = $request->validate($this->pageRules($page));

        if (isset($data['slug']) && $data['slug'] !== $page->slug) {
            $data['slug'] = $this->uniquePageSlug($data['slug'], $page->id);
        }

        $page->update($data);

        return $this->ok($page->fresh(), 'Page updated successfully');
    }

    public function destroyPage(StaticPage $page): JsonResponse
    {
        $page->delete();

        return $this->ok(null, 'Page deleted successfully');
    }

    /** @return array<string, mixed> */
    private function pageRules(?StaticPage $page = null): array
    {
        $required = $page ? 'sometimes' : 'required';

        return [
            'title' => [$required, 'string', 'max:255'],
            'content' => [$required, 'string'],
            'slug' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'meta_keywords' => ['nullable', 'array'],
            'meta_keywords.*' => ['string', 'max:100'],
            'is_published' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    private function uniquePageSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value) ?: 'page';
        $slug = $base;
        $suffix = 2;

        while (StaticPage::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }

    // ------------------------------------------------------------- Settings

    public function settings(): JsonResponse
    {
        return $this->ok($this->currentSettings(), 'Settings retrieved successfully');
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $data = $request->validate([
            'site_name' => ['nullable', 'string', 'max:255'],
            'site_description' => ['nullable', 'string'],
            'copyright_text' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'support_email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'support_phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'store_address' => ['nullable', 'string', 'max:500'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
            'twitter' => ['nullable', 'string', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:100'],
            'tiktok' => ['nullable', 'string', 'max:255'],
            'snapchat' => ['nullable', 'string', 'max:255'],
            'youtube' => ['nullable', 'string', 'max:255'],
            'store_status' => ['nullable', Rule::in(['open', 'closed', 'maintenance'])],
            'maintenance_mode' => ['nullable', 'boolean'],
            'store_hours' => ['nullable', 'string'],
            'currency_code' => ['nullable', 'string', 'max:10'],
            'currency_symbol' => ['nullable', 'string', 'max:10'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'payment_methods' => ['nullable', 'string'],
            'shipping_note' => ['nullable', 'string'],
            'locale' => ['nullable', Rule::in(['en', 'ar'])],
            'timezone' => ['nullable', 'string', 'max:50'],
        ]);

        $settings = $this->currentSettings();
        $settings->update($data);

        return $this->ok($settings->fresh(), 'Settings updated successfully');
    }

    /** The settings table holds a single row; create it on first access. */
    private function currentSettings(): Setting
    {
        return Setting::query()->firstOrCreate([]);
    }
}
