<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Everything under `api/*` answers JSON, whatever the client asked for.
     *
     * Without this the base handler falls back to `redirect()->guest(route('login'))`
     * for unauthenticated requests. This app has no `login` route, so a browser
     * hitting a protected API URL got a 500 (RouteNotFoundException) instead of
     * a 401 — and the same fallback would turn other API errors into HTML.
     */
    protected function shouldReturnJson($request, Throwable $e): bool
    {
        return $request->is('api/*') || parent::shouldReturnJson($request, $e);
    }
}
