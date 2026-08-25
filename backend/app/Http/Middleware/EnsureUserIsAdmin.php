<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allow access to login page and authentication routes without admin check
        if ($request->routeIs('filament.admin.auth.login') || 
            $request->routeIs('filament.admin.auth.*') ||
            $request->is('admin/login') || 
            $request->is('admin/login/*')) {
            return $next($request);
        }

        // A signed-in non-admin used to get a bare 403 with no way out but
        // clearing cookies. Sign them out and send them back to the login screen
        // instead, so the panel is recoverable from the browser.
        if (auth()->check() && ! auth()->user()->isAdmin()) {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->to('/admin/login')
                ->with('error', 'That account does not have admin access.');
        }

        // If user is not authenticated, let Filament's Authenticate middleware handle the redirect
        // This middleware only blocks authenticated non-admin users
        return $next($request);
    }
}
