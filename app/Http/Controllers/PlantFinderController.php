<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterPlantsRequest;
use App\Services\DemoCart;
use App\Services\PlantFinder;
use App\Support\PlantFinderCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class PlantFinderController extends Controller
{
    public function index(FilterPlantsRequest $request, PlantFinder $plantFinder): View|JsonResponse
    {
        DemoCart::seed();

        $filters = $request->filters();
        $plants = $plantFinder->search($filters);

        $data = [
            'cart' => DemoCart::state(),
            'groups' => PlantFinderCatalog::characteristicGroups(),
            'planting_times' => PlantFinderCatalog::plantingTimes(),
            'flowering_times' => PlantFinderCatalog::floweringTimes(),
            'fruiting_times' => PlantFinderCatalog::fruitingTimes(),
            'categories' => PlantFinderCatalog::categories(),
            'filters' => $filters,
            'hasFilters' => $request->hasActiveFilters(),
            'chips' => $request->activeChips(),
            'plants' => $plants,
        ];

        $wantsPartial = $request->header('X-Finder-Partial')
            || (
                $request->boolean('partial')
                && str_contains((string) $request->header('Accept'), 'application/json')
            );

        if ($wantsPartial) {
            return response()->json([
                'total' => $plants->total(),
                'chips' => view('demo.plant-finder.partials.chips', $data)->render(),
                'results' => view('demo.plant-finder.partials.results', $data)->render(),
                'heroMeta' => view('demo.plant-finder.partials.hero-meta', $data)->render(),
                'drawerFooter' => view('demo.plant-finder.partials.drawer-footer', $data)->render(),
            ]);
        }

        return view('demo.plant-finder.index', $data);
    }
}
