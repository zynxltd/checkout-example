<?php

namespace App\Services;

class DemoArgosNav
{
    /** @return list<array{label: string, url: string}> */
    public static function trendingLinks(?string $yg = null): array
    {
        $yg = $yg ?? 'https://www.yougarden.com';

        return [
            ['label' => 'Popular Garden Plants', 'url' => $yg.'/garden-plants/popular-garden-plants'],
            ['label' => 'Oleander Plants', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/oleander-plants'],
            ['label' => 'Autumn Bedding', 'url' => $yg.'/garden-plants/bedding-plants/autumn-bedding-plants'],
            ['label' => 'Citrus Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/citrus-trees-and-plants'],
            ['label' => 'Drought Tolerant Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/drought-tolerant-plants'],
        ];
    }

    /**
     * YouGarden-style shop mega menu (department → category → subcategories).
     *
     * @return list<array{title: string, url: string, children: list<array{label: string, url: string, children?: list<array{label: string, url: string}>}>}>
     */
    public static function shopMenu(?string $yg = null): array
    {
        $yg = $yg ?? 'https://www.yougarden.com';

        $img = fn (string $file) => '/images/home-preview/cats/'.$file;
        $prod = fn (string $file) => '/images/products/'.$file;

        $withChildImages = function (string $parentImage, array $children) use ($prod, $img): array {
            $pool = [
                $parentImage,
                $prod('404220.jpg'),
                $prod('401842.jpg'),
                $prod('402156.jpg'),
                $prod('403891.jpg'),
                $prod('510317.png'),
                $img('perennials.jpg'),
                $img('roses.jpg'),
            ];
            $i = 0;
            foreach ($children as &$child) {
                if (empty($child['image'])) {
                    $child['image'] = $pool[$i % count($pool)];
                    $i++;
                }
            }
            unset($child);

            return $children;
        };

        $plantsUrl = route('demo.listing.perennials');

        $menu = [
            [
                'title' => 'Garden Plants',
                'url' => $plantsUrl,
                'image' => $img('garden-plants.jpg'),
                'children' => [
                    [
                        'label' => 'Garden Bulbs',
                        'url' => $yg.'/garden-plants/garden-bulbs',
                        'image' => $img('bulbs.jpg'),
                        'children' => $withChildImages($img('bulbs.jpg'), [
                            ['label' => 'Summer Flowering Bulbs', 'url' => $yg.'/garden-plants/garden-bulbs/summer-flowering-bulbs'],
                            ['label' => 'Spring Flowering Bulbs', 'url' => $yg.'/garden-plants/garden-bulbs/spring-flowering-bulbs'],
                            ['label' => '3 for 2 Bulb Packs', 'url' => $yg.'/garden-plants/garden-bulbs/3-for-2-bulb-packs-offer'],
                            ['label' => 'Drop In Bulb Pods', 'url' => $yg.'/garden-plants/garden-bulbs/drop-in-bulb-pods'],
                            ['label' => 'View All Garden Bulbs', 'url' => $yg.'/garden-plants/garden-bulbs'],
                        ]),
                    ],
                    [
                        'label' => 'Bedding Plants',
                        'url' => $yg.'/garden-plants/bedding-plants',
                        'image' => $img('autumn-bedding.jpg'),
                        'children' => $withChildImages($img('autumn-bedding.jpg'), [
                            ['label' => 'Spring Bedding Plants', 'url' => $yg.'/garden-plants/bedding-plants/spring-bedding-plants'],
                            ['label' => 'Garden Ready Bedding', 'url' => $yg.'/garden-plants/bedding-plants/garden-ready-bedding-plants'],
                            ['label' => 'Pre-Planted Hanging Baskets', 'url' => $yg.'/garden-plants/bedding-plants/pre-planted-hanging-baskets', 'image' => $prod('404220.jpg')],
                            ['label' => 'Autumn Bedding Plants', 'url' => $yg.'/garden-plants/bedding-plants/autumn-bedding-plants'],
                            ['label' => 'View All Bedding Plants', 'url' => $yg.'/garden-plants/bedding-plants'],
                        ]),
                    ],
                    [
                        'label' => 'Perennial Plants & Flowers',
                        'url' => $plantsUrl,
                        'image' => $img('perennials.jpg'),
                        'children' => $withChildImages($img('perennials.jpg'), [
                            ['label' => 'Agapanthus Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/agapanthus-plants'],
                            ['label' => 'Chrysanthemum Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/chrysanthemum-plants'],
                            ['label' => 'Echinacea Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/echinacea-plants'],
                            ['label' => 'Fern Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/fern-plants'],
                            ['label' => 'Perennial Geranium Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/perennial-geranium-plants', 'image' => $prod('510317.png')],
                            ['label' => 'Gerbera Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/gerbera-plants'],
                            ['label' => 'Hellebore Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/hellebore-plants'],
                            ['label' => 'Peony Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/peony-plants'],
                            ['label' => 'Perennial Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/perennial-plants'],
                            ['label' => 'View All Perennial Plants & Flowers', 'url' => $plantsUrl],
                        ]),
                    ],
                    [
                        'label' => 'Popular Garden Plants',
                        'url' => $yg.'/garden-plants/popular-garden-plants',
                        'image' => $img('drought.jpg'),
                        'children' => $withChildImages($img('drought.jpg'), [
                            ['label' => 'Drought Tolerant Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/drought-tolerant-plants'],
                            ['label' => 'Plants For Containers', 'url' => $yg.'/garden-plants/popular-garden-plants/plants-for-containers'],
                            ['label' => 'Ground Cover Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/ground-cover-plants'],
                            ['label' => 'Plants for Hanging Baskets', 'url' => $yg.'/garden-plants/popular-garden-plants/plants-for-hanging-baskets', 'image' => $prod('401842.jpg')],
                            ['label' => 'Low Maintenance Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/low-maintenance-plants'],
                            ['label' => 'Patio Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/patio-plants'],
                            ['label' => 'Shade Loving Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/shade-loving-plants'],
                            ['label' => 'Border Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/border-plants'],
                            ['label' => 'View All Popular Garden Plants', 'url' => $yg.'/garden-plants/popular-garden-plants'],
                        ]),
                    ],
                    [
                        'label' => 'Roses',
                        'url' => $yg.'/garden-plants/roses',
                        'image' => $img('roses.jpg'),
                        'children' => $withChildImages($img('roses.jpg'), [
                            ['label' => 'Bare Root Roses', 'url' => $yg.'/garden-plants/roses/bare-root-roses'],
                            ['label' => 'Potted Roses', 'url' => $yg.'/garden-plants/roses/potted-roses'],
                            ['label' => 'Bush & Shrub Roses', 'url' => $yg.'/garden-plants/roses/bush-and-shrub-roses'],
                            ['label' => 'Climbing Roses', 'url' => $yg.'/garden-plants/roses/climbing-roses', 'image' => $img('climbing.jpg')],
                            ['label' => 'Standard Roses', 'url' => $yg.'/garden-plants/roses/standard-roses'],
                            ['label' => 'Celebration Roses', 'url' => $yg.'/garden-plants/roses/celebration-roses'],
                            ['label' => 'View All Roses', 'url' => $yg.'/garden-plants/roses'],
                        ]),
                    ],
                    [
                        'label' => 'Climbing Plants',
                        'url' => $yg.'/garden-plants/climbing-plants',
                        'image' => $img('climbing.jpg'),
                        'children' => $withChildImages($img('climbing.jpg'), [
                            ['label' => 'Clematis Plants', 'url' => $yg.'/garden-plants/climbing-plants/clematis-plants'],
                            ['label' => 'Honeysuckle Plants', 'url' => $yg.'/garden-plants/climbing-plants/honeysuckle-plants'],
                            ['label' => 'Jasmine', 'url' => $yg.'/garden-plants/climbing-plants/jasmine'],
                            ['label' => 'Passion Flowers', 'url' => $yg.'/garden-plants/climbing-plants/passion-flowers'],
                            ['label' => 'Wisteria Plants', 'url' => $yg.'/garden-plants/climbing-plants/wisteria-plants'],
                            ['label' => 'View All Climbing Plants', 'url' => $yg.'/garden-plants/climbing-plants'],
                        ]),
                    ],
                    [
                        'label' => 'Pond Plants',
                        'url' => $yg.'/garden-plants/pond-plants',
                        'image' => $img('garden-plants.jpg'),
                    ],
                ],
            ],
            [
                'title' => 'Trees & Shrubs',
                'url' => $yg.'/trees-and-shrubs',
                'image' => $img('trees.jpg'),
                'children' => [
                    [
                        'label' => 'Garden Trees',
                        'url' => $yg.'/trees-and-shrubs/garden-trees',
                        'image' => $img('trees.jpg'),
                        'children' => $withChildImages($img('trees.jpg'), [
                            ['label' => 'Standard Trees and Plants', 'url' => $yg.'/trees-and-shrubs/garden-trees/standard-trees-and-plants'],
                            ['label' => 'Evergreen Trees', 'url' => $yg.'/trees-and-shrubs/garden-trees/evergreen-trees'],
                            ['label' => 'Flowering Cherry', 'url' => $yg.'/trees-and-shrubs/garden-trees/flowering-cherry'],
                            ['label' => 'Japanese Acer Trees', 'url' => $yg.'/trees-and-shrubs/garden-trees/japanese-acer-trees', 'image' => $img('acers.jpg')],
                            ['label' => 'Ornamental Trees', 'url' => $yg.'/trees-and-shrubs/garden-trees/ornamental-trees'],
                            ['label' => 'View All Garden Trees', 'url' => $yg.'/trees-and-shrubs/garden-trees'],
                        ]),
                    ],
                    [
                        'label' => 'Garden Shrubs',
                        'url' => $yg.'/trees-and-shrubs/garden-shrubs',
                        'image' => $img('shrubs.jpg'),
                        'children' => $withChildImages($img('shrubs.jpg'), [
                            ['label' => 'Buddleia Plants & Bushes', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/buddleia-plants-and-bushes'],
                            ['label' => 'Evergreen Shrubs', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/evergreen-shrubs'],
                            ['label' => 'Flowering Shrubs', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/flowering-shrubs'],
                            ['label' => 'Hydrangea Plants', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/hydrangea-plants'],
                            ['label' => 'Lavender Plants', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/lavender-plants'],
                            ['label' => 'Rhododendron Plants', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/rhododendron-plants'],
                            ['label' => 'View All Garden Shrubs', 'url' => $yg.'/trees-and-shrubs/garden-shrubs'],
                        ]),
                    ],
                    [
                        'label' => 'Mediterranean Plants',
                        'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens',
                        'image' => $img('mediterranean.jpg'),
                        'children' => $withChildImages($img('mediterranean.jpg'), [
                            ['label' => 'Palm Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/palm-trees'],
                            ['label' => 'Oleander Plants', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/oleander-plants'],
                            ['label' => 'Italian Cypress Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/italian-cypress-trees'],
                            ['label' => 'Citrus Trees and Plants', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/citrus-trees-and-plants'],
                            ['label' => 'Olive Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/olive-trees'],
                            ['label' => 'Bay Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/bay-trees'],
                            ['label' => 'View All Mediterranean Plants', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens'],
                        ]),
                    ],
                    [
                        'label' => 'Hedging',
                        'url' => $yg.'/trees-and-shrubs/hedging-plants',
                        'image' => $img('shrubs.jpg'),
                        'children' => $withChildImages($img('shrubs.jpg'), [
                            ['label' => 'Bare Root Hedging Plants', 'url' => $yg.'/trees-and-shrubs/hedging-plants/bare-root-hedging-plants'],
                            ['label' => 'Potted Hedging', 'url' => $yg.'/trees-and-shrubs/hedging-plants/potted-hedging'],
                            ['label' => 'Instant Hedging', 'url' => $yg.'/trees-and-shrubs/hedging-plants/instant-hedging'],
                            ['label' => 'View All Hedging', 'url' => $yg.'/trees-and-shrubs/hedging-plants'],
                        ]),
                    ],
                    [
                        'label' => 'Statement Plants',
                        'url' => $yg.'/trees-and-shrubs/statement-plants',
                        'image' => $img('acers.jpg'),
                    ],
                ],
            ],
            [
                'title' => 'Houseplants',
                'url' => $yg.'/houseplants',
                'image' => $img('houseplants.jpg'),
                'children' => [
                    ['label' => 'Indoor Flowering Plants', 'url' => $yg.'/houseplants/indoor-flowering-plants', 'image' => $img('flowering-houseplants.jpg')],
                    ['label' => 'Indoor Foliage Plants', 'url' => $yg.'/houseplants/indoor-foliage-plants', 'image' => $img('foliage-houseplants.jpg')],
                    ['label' => 'Large Houseplants', 'url' => $yg.'/houseplants/large-houseplants', 'image' => $img('large-houseplants.jpg')],
                    ['label' => 'Carnivorous Houseplants', 'url' => $yg.'/houseplants/carnivorous-houseplants', 'image' => $img('carnivorous.jpg')],
                    ['label' => 'Indoor Houseplant Pots', 'url' => $yg.'/houseplants/indoor-houseplant-pots', 'image' => $img('houseplant-pots.jpg')],
                ],
            ],
            [
                'title' => 'Fruits & Veg',
                'url' => $yg.'/grow-your-own-fruit-and-veg',
                'image' => $img('fruit-veg.jpg'),
                'children' => [
                    [
                        'label' => 'Fruit Trees',
                        'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees',
                        'image' => $img('fruit-trees.jpg'),
                        'children' => [
                            ['label' => 'Bare Root Fruit Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/bare-root-fruit-trees', 'image' => $img('fruit-trees.jpg')],
                            ['label' => 'Potted Fruit Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/potted-fruit-trees', 'image' => $img('fruit-trees.jpg')],
                            ['label' => 'Apple Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/apple-trees', 'image' => $img('apple-trees.jpg')],
                            ['label' => 'Cherry Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/cherry-trees', 'image' => $img('cherry-trees.jpg')],
                            ['label' => 'Pear Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/pear-trees', 'image' => $img('pear-trees.jpg')],
                            ['label' => 'Plum Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/plum-trees', 'image' => $img('plum-trees.jpg')],
                            ['label' => 'View All Fruit Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees', 'image' => $img('fruit-trees.jpg')],
                        ],
                    ],
                    [
                        'label' => 'Fruit Bushes',
                        'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes',
                        'image' => $img('fruit-bushes.jpg'),
                        'children' => [
                            ['label' => 'Strawberry Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes/strawberry-plants', 'image' => $img('strawberries.jpg')],
                            ['label' => 'Raspberry Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes/raspberry-plants', 'image' => $img('raspberries.jpg')],
                            ['label' => 'Currant Bushes', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes/currant-bushes', 'image' => $img('currants.jpg')],
                            ['label' => 'Blackberry Plants & Other Berries', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes/blackberry-plants-and-other-berries', 'image' => $img('blackberries.jpg')],
                            ['label' => 'View All Fruit Bushes', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes', 'image' => $img('fruit-bushes.jpg')],
                        ],
                    ],
                    ['label' => 'Seed Potatoes', 'url' => $yg.'/grow-your-own-fruit-and-veg/seed-potatoes', 'image' => $img('seed-potatoes.jpg')],
                    ['label' => 'Tomato Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/tomato-plants', 'image' => $img('tomatoes.jpg')],
                    ['label' => 'Vegetable Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/vegetable-plants', 'image' => $img('vegetables.jpg')],
                    ['label' => 'Herb Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/herb-plants', 'image' => $img('herbs.jpg')],
                    ['label' => 'Superfruit Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/superfruit-plants', 'image' => $img('superfruit.jpg')],
                ],
            ],
            [
                'title' => 'Outdoor Living',
                'url' => $yg.'/outdoor-living',
                'image' => $img('outdoor.jpg'),
                'children' => [
                    [
                        'label' => 'Garden Tools',
                        'url' => $yg.'/outdoor-living/garden-tools',
                        'image' => $img('garden-tools.jpg'),
                        'children' => $withChildImages($img('garden-tools.jpg'), [
                            ['label' => 'Lawnmowers', 'url' => $yg.'/outdoor-living/garden-tools/lawnmowers'],
                            ['label' => 'Strimmers & Trimmers', 'url' => $yg.'/outdoor-living/garden-tools/garden-strimmers-and-trimmers'],
                            ['label' => 'Other Tools', 'url' => $yg.'/outdoor-living/garden-tools/other-tools'],
                            ['label' => 'View All Garden Tools', 'url' => $yg.'/outdoor-living/garden-tools'],
                        ]),
                    ],
                    ['label' => 'Pots and Planters', 'url' => $yg.'/outdoor-living/pots-and-planters', 'image' => $img('pots-planters.jpg')],
                    ['label' => 'Hanging Baskets', 'url' => $yg.'/outdoor-living/hanging-baskets', 'image' => $img('hanging-baskets.jpg')],
                    ['label' => 'Feeds & Fertilisers', 'url' => $yg.'/outdoor-living/feeds-and-fertilisers', 'image' => $img('feeds-fertilisers.jpg')],
                    [
                        'label' => 'Plant Protection / Pest Control',
                        'url' => $yg.'/outdoor-living/plant-protection-and-pest-control',
                        'image' => $img('plant-protection.jpg'),
                        'children' => $withChildImages($img('plant-protection.jpg'), [
                            ['label' => 'Organic Gardening', 'url' => $yg.'/outdoor-living/plant-protection-and-pest-control/organic-gardening'],
                            ['label' => 'Garden Pest Control', 'url' => $yg.'/outdoor-living/plant-protection-and-pest-control/garden-pest-control'],
                            ['label' => 'Cold Frames & Frost Protection', 'url' => $yg.'/outdoor-living/plant-protection-and-pest-control/cold-frames-and-frost-protection'],
                            ['label' => 'View All Plant Protection', 'url' => $yg.'/outdoor-living/plant-protection-and-pest-control'],
                        ]),
                    ],
                    ['label' => 'Compost', 'url' => $yg.'/outdoor-living/compost', 'image' => $img('compost.jpg')],
                    ['label' => 'Garden Furniture', 'url' => $yg.'/outdoor-living/garden-furniture', 'image' => $img('garden-furniture.jpg')],
                    ['label' => 'Gifts', 'url' => $yg.'/outdoor-living/gifts', 'image' => $img('gifts.jpg')],
                    ['label' => 'Bird Feeders & Feed', 'url' => $yg.'/outdoor-living/bird-feeders-and-feed', 'image' => $img('bird-feeders.jpg')],
                ],
            ],
        ];

        // Temporary: every Shop mega-menu link goes to the Garden Plants PLP
        $rewriteUrls = function (array $nodes) use (&$rewriteUrls, $plantsUrl): array {
            foreach ($nodes as &$node) {
                $node['url'] = $plantsUrl;
                if (! empty($node['children']) && is_array($node['children'])) {
                    $node['children'] = $rewriteUrls($node['children']);
                }
            }
            unset($node);

            return $nodes;
        };

        return $rewriteUrls($menu);
    }
}
