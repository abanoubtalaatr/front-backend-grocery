<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

/**
 * Shared plumbing for the admin API.
 *
 * Every admin endpoint answers the same envelope the public API already uses
 * (`success` / `message` / `data`), plus a `meta` block for paginated lists so
 * the React dashboard can drive its tables from one generic hook.
 */
abstract class AdminController extends Controller
{
    /** Hard ceiling so a crafted `per_page` cannot ask for the whole table. */
    protected const MAX_PER_PAGE = 100;

    protected function ok(mixed $data = null, string $message = 'OK', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    protected function fail(string $message, int $status = 400, mixed $errors = null): JsonResponse
    {
        return response()->json(array_filter([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], static fn ($value) => $value !== null), $status);
    }

    /**
     * Serialise a paginator into `data` + `meta` with an optional row mapper.
     */
    protected function paginated(LengthAwarePaginator $paginator, ?callable $mapper = null, string $message = 'OK'): JsonResponse
    {
        $items = collect($paginator->items());

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $mapper ? $items->map($mapper)->values() : $items->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ]);
    }

    protected function perPage(Request $request, int $default = 15): int
    {
        $perPage = (int) $request->query('per_page', $default);

        return max(1, min($perPage ?: $default, self::MAX_PER_PAGE));
    }

    /**
     * Resolve a sort column the caller asked for, restricted to an allow-list so
     * `?sort=` can never reach an arbitrary column.
     *
     * @param  array<int, string>  $allowed
     * @return array{0: string, 1: string}
     */
    protected function sort(Request $request, array $allowed, string $default = 'created_at'): array
    {
        $column = (string) $request->query('sort', $default);
        if (! in_array($column, $allowed, true)) {
            $column = $default;
        }

        $direction = strtolower((string) $request->query('direction', 'desc')) === 'asc' ? 'asc' : 'desc';

        return [$column, $direction];
    }

    /**
     * Store an uploaded image and return its relative path, or pass through a
     * full URL string. Mirrors how the existing accessors read `image`.
     */
    protected function resolveImage(Request $request, string $field, string $folder): ?string
    {
        $file = $request->file($field);

        if ($file instanceof UploadedFile) {
            return $file->store($folder, 'public');
        }

        $value = $request->input($field);

        return is_string($value) && $value !== '' ? $value : null;
    }
}
