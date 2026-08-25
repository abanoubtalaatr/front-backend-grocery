<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // There is no `login` route in this app - it is API-only plus the
        // Filament panel, which handles its own redirect. Returning the route
        // name here turned every unauthenticated browser hit on /api/* into a
        // 500 (RouteNotFoundException) instead of a clean 401.
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        return \Illuminate\Support\Facades\Route::has('login') ? route('login') : null;
    }
}
