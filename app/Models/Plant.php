<?php

namespace App\Models;

/**
 * @property int $id
 * @property string $name
 * @property string $type
 * @property string|null $description
 * @property string|null $image
 * @property list<string>|null $locations
 * @property list<string>|null $sizes
 * @property string|null $fragrance
 * @property list<string>|null $colours
 * @property list<string>|null $light
 * @property list<string>|null $aspects
 * @property list<string>|null $soils
 * @property string|null $flowering
 * @property list<string>|null $features
 * @property float|null $price
 * @property string|null $shop_url
 */
class Plant
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function __construct(
        public array $attributes,
    ) {}

    public function __get(string $key): mixed
    {
        return $this->attributes[$key] ?? null;
    }
}
