<?php

namespace App\Http\Controllers;

use App\Services\DemoCart;
use Illuminate\View\View;

class ListingController extends Controller
{
    public function perennials(): View
    {
        DemoCart::seed();

        return view('demo.listing', [
            'cart' => DemoCart::state(),
            'listing' => DemoCart::listingPage(),
        ]);
    }

    public function gardenPlants(): View
    {
        DemoCart::seed();

        return view('demo.garden-plants', [
            'cart' => DemoCart::state(),
            'hub' => DemoCart::gardenPlantsHub(),
        ]);
    }
}
