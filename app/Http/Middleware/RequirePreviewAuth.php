<?php

namespace App\Http\Middleware;

use App\Services\DemoAccount;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequirePreviewAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! config('demo-preview.auth_enabled')) {
            return $next($request);
        }

        if ($this->isPublicAccountRoute($request)) {
            return $next($request);
        }

        if ($this->hasSiteAccess($request)) {
            return $next($request);
        }

        if ($request->expectsJson() || $request->is('cart/*')) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('demo.login', [
            'redirect' => $request->fullUrl(),
        ]));
    }

    private function isPublicAccountRoute(Request $request): bool
    {
        return $request->routeIs(
            'demo.account.login',
            'demo.account.login.submit',
            'demo.account.demo-login',
            'demo.account.forgotten-password',
            'demo.account.forgotten-password.submit',
            'demo.account.register',
            'demo.account.register.submit',
        );
    }

    private function hasSiteAccess(Request $request): bool
    {
        return $request->session()->get('demo_preview_authenticated') === true
            || DemoAccount::isLoggedIn();
    }
}
