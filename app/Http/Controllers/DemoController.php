<?php

namespace App\Http\Controllers;

use App\Services\DemoCart;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DemoController extends Controller
{
    public function pdp(Request $request): View
    {
        DemoCart::seed();

        if ($request->has('drawer')) {
            session(['demo_drawer_enabled' => $request->boolean('drawer')]);
        }
        if ($request->has('delivery_bar')) {
            session(['demo_free_delivery_bar' => $request->boolean('delivery_bar')]);
        }
        if ($request->has('upsells')) {
            session(['demo_show_upsells' => $request->boolean('upsells')]);
        }
        if ($request->has('wide')) {
            session(['demo_wide_drawer' => $request->boolean('wide')]);
        }

        return view('demo.pdp', [
            'cart' => DemoCart::state(),
            'product' => DemoCart::pdpProduct(),
        ]);
    }
}
