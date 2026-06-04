<?php

namespace App\Http\Middleware;

use App\Support\DemoDrawerVariant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApplyDemoDrawerVariant
{
    public function handle(Request $request, Closure $next): Response
    {
        DemoDrawerVariant::applyFromRequest($request);

        return $next($request);
    }
}
