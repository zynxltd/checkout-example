<?php

namespace App\Services;

use App\Models\Plant;
use App\Support\PlantCatalogue;
use App\Support\PlantFinderCatalog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Support\Collection;

class PlantFinder
{
    /**
     * @param  array{
     *     features: list<string>,
     *     planting_time: ?string,
     *     flowering_time: ?string,
     *     fruiting_time: ?string,
     *     category: ?string,
     *     sort: string
     * }  $filters
     * @return LengthAwarePaginator<int, Plant>
     */
    public function search(array $filters): LengthAwarePaginator
    {
        $matches = PlantCatalogue::all()
            ->filter(fn (Plant $plant): bool => $this->matches($plant, $filters))
            ->values();

        $matches = $this->sort($matches, $filters['sort'] ?? PlantFinderCatalog::defaultSort());

        return $this->paginate($matches);
    }

    /**
     * @param  array{
     *     features: list<string>,
     *     planting_time: ?string,
     *     flowering_time: ?string,
     *     fruiting_time: ?string,
     *     category: ?string,
     *     sort: string
     * }  $filters
     */
    private function matches(Plant $plant, array $filters): bool
    {
        if (blank($plant->shop_url)) {
            return false;
        }

        if (filled($filters['planting_time']) && ! in_array($filters['planting_time'], $plant->planting_times ?? [], true)) {
            return false;
        }

        if (filled($filters['flowering_time']) && ! in_array($filters['flowering_time'], $plant->flowering_times ?? [], true)) {
            return false;
        }

        if (filled($filters['fruiting_time']) && ! in_array($filters['fruiting_time'], $plant->fruiting_times ?? [], true)) {
            return false;
        }

        if (filled($filters['category']) && ($plant->category ?? '') !== $filters['category']) {
            return false;
        }

        foreach ($filters['features'] as $feature) {
            if (! in_array($feature, $plant->features ?? [], true)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  Collection<int, Plant>  $plants
     * @return Collection<int, Plant>
     */
    private function sort(Collection $plants, string $sort): Collection
    {
        return $plants
            ->sort(function (Plant $left, Plant $right) use ($sort): int {
                $comparison = match ($sort) {
                    'name_desc' => strnatcasecmp((string) $right->name, (string) $left->name),
                    'price_asc' => (float) ($left->price ?? 0) <=> (float) ($right->price ?? 0),
                    'price_desc' => (float) ($right->price ?? 0) <=> (float) ($left->price ?? 0),
                    default => strnatcasecmp((string) $left->name, (string) $right->name),
                };

                if ($comparison !== 0) {
                    return $comparison;
                }

                return strnatcasecmp((string) $left->name, (string) $right->name);
            })
            ->values();
    }

    /**
     * @param  Collection<int, Plant>  $plants
     * @return LengthAwarePaginator<int, Plant>
     */
    private function paginate(Collection $plants): LengthAwarePaginator
    {
        $perPage = 12;
        $page = Paginator::resolveCurrentPage();
        $items = $plants->forPage($page, $perPage)->values();

        return new Paginator(
            $items,
            $plants->count(),
            $perPage,
            $page,
            [
                'path' => Paginator::resolveCurrentPath(),
                'query' => collect(request()->query())->except('partial')->all(),
            ]
        );
    }
}
