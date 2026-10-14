<?php

namespace App\Support;

class PlantFinderCatalog
{
    /**
     * @return array<string, string>
     */
    public static function months(): array
    {
        return [
            'jan' => 'January',
            'feb' => 'February',
            'mar' => 'March',
            'apr' => 'April',
            'may' => 'May',
            'jun' => 'June',
            'jul' => 'July',
            'aug' => 'August',
            'sep' => 'September',
            'oct' => 'October',
            'nov' => 'November',
            'dec' => 'December',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function plantingTimes(): array
    {
        return self::months();
    }

    /**
     * @return array<string, string>
     */
    public static function floweringTimes(): array
    {
        return self::months();
    }

    /**
     * @return array<string, string>
     */
    public static function fruitingTimes(): array
    {
        return self::months();
    }

    /**
     * @return array<string, string>
     */
    public static function categories(): array
    {
        return [
            'perennial' => 'Perennials',
            'shrub' => 'Trees & Shrubs',
            'tree' => 'Trees',
            'climbing' => 'Climbing Plants',
            'fruit_tree' => 'Fruit Trees',
            'fruit_bush' => 'Fruits & Veg',
            'citrus' => 'Mediterranean & Citrus',
            'bedding' => 'Bedding Plants',
            'bulb' => 'Bulbs',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function features(): array
    {
        return [
            'fragrant' => 'Scented / Fragrant',
            'pots' => 'Perfect In Pots',
            'plant_in_shade' => 'Plant In Shade',
            'plant_in_sunshine' => 'Plant In Sunshine',
            'hardy' => 'Winter Hardy',
            'frost' => 'Protect From Frost',
            'edible' => 'Edible',
            'cut_flowers' => 'Cut Flower',
            'easy_grow' => 'Easy To Grow',
            'wildlife' => 'Wildlife Friendly',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function featureIcons(): array
    {
        return [
            'fragrant' => 'yg/fragrant.png',
            'pots' => 'yg/pots.png',
            'plant_in_shade' => 'yg/shade.png',
            'plant_in_sunshine' => 'yg/sun.png',
            'hardy' => 'yg/hardy.png',
            'frost' => 'yg/frost.png',
            'edible' => 'yg/edible.png',
            'cut_flowers' => 'yg/cutFlowers.png',
            'easy_grow' => 'yg/easyGrow.png',
            'wildlife' => 'yg/wildlife.png',
        ];
    }

    /**
     * @return list<array{key: string, title: string, options: list<array{value: string, label: string, icon: string}>}>
     */
    public static function characteristicGroups(): array
    {
        return [
            [
                'key' => 'features',
                'title' => 'Select Plant Characteristics',
                'options' => self::options(self::features(), self::featureIcons()),
            ],
        ];
    }

    public static function optionLabel(string $group, string $value): string
    {
        $labels = match ($group) {
            'features' => self::features(),
            'planting_time' => self::plantingTimes(),
            'flowering_time' => self::floweringTimes(),
            'fruiting_time' => self::fruitingTimes(),
            'category' => self::categories(),
            default => [],
        };

        return $labels[$value] ?? $value;
    }

    /**
     * @return array<string, string>
     */
    public static function sorts(): array
    {
        return [
            'name_asc' => 'Name A–Z',
            'name_desc' => 'Name Z–A',
            'price_asc' => 'Price: low to high',
            'price_desc' => 'Price: high to low',
        ];
    }

    public static function defaultSort(): string
    {
        return 'name_asc';
    }

    /**
     * @param  array<string, string>  $labels
     * @param  array<string, string>  $icons
     * @return list<array{value: string, label: string, icon: string}>
     */
    private static function options(array $labels, array $icons): array
    {
        $options = [];

        foreach ($labels as $value => $label) {
            $options[] = [
                'value' => $value,
                'label' => $label,
                'icon' => $icons[$value],
            ];
        }

        return $options;
    }
}
