<?php

namespace App\Http\Middleware;

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

        if ($request->session()->get('demo_preview_authenticated') === true) {
            return $next($request);
        }

        if ($request->expectsJson() || $request->is('cart/*')) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('demo.login', [
            'redirect' => $request->fullUrl(),
        ]));
    }
}
