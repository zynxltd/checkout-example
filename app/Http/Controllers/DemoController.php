<?php

namespace App\Http\Controllers;

use App\Services\DemoCart;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DemoController extends Controller
{
    public function plantFinder(): View
    {
        DemoCart::seed();

        return view('demo.plant-finder', [
            'cart' => DemoCart::state(),
            'finder' => DemoCart::plantFinderPage(),
        ]);
    }

    public function aboutUs(): View
    {
        DemoCart::seed();

        return view('demo.about-us', [
            'cart' => DemoCart::state(),
            'collections' => [
                [
                    'title' => 'Garden Plants',
                    'url' => route('demo.listing.perennials'),
                    'image' => 'images/products/401842.jpg',
                ],
                [
                    'title' => 'Perennial Plants & Flowers',
                    'url' => route('demo.listing.perennials'),
                    'image' => 'images/products/402156.jpg',
                ],
                [
                    'title' => 'Roses',
                    'url' => route('demo.pdp'),
                    'image' => 'images/products/403891.jpg',
                ],
                [
                    'title' => 'Climbing Plants',
                    'url' => route('demo.pdp'),
                    'image' => 'images/products/404220.jpg',
                ],
                [
                    'title' => 'Garden Trees',
                    'url' => route('demo.pdp'),
                    'image' => 'images/products/510317.png',
                ],
                [
                    'title' => 'Houseplants',
                    'url' => route('demo.pdp'),
                    'image' => 'images/products/402156.jpg',
                ],
                [
                    'title' => 'Garden Bulbs',
                    'url' => route('demo.pdp'),
                    'image' => 'images/products/403891.jpg',
                ],
                [
                    'title' => 'Fruits and Veg',
                    'url' => route('demo.pdp'),
                    'image' => 'images/products/401842.jpg',
                ],
            ],
        ]);
    }

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
