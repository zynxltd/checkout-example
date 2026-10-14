<?php

namespace App\Support;

use App\Models\Plant;
use Illuminate\Support\Collection;

class PlantCatalogue
{
    /** @var Collection<int, Plant>|null */
    private static ?Collection $products = null;

    /** @return Collection<int, Plant> */
    public static function all(): Collection
    {
        if (self::$products !== null) {
            return self::$products;
        }

        $path = base_path('data/products.json');

        if (! is_file($path)) {
            self::$products = collect();

            return self::$products;
        }

        /** @var list<array<string, mixed>> $raw */
        $raw = json_decode((string) file_get_contents($path), true) ?? [];

        self::$products = collect($raw)->map(
            fn (array $item): Plant => new Plant($item)
        );

        return self::$products;
    }
}
