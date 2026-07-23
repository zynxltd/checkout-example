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

    public function standardDelivery(): View
    {
        DemoCart::seed();

        return view('demo.standard-delivery', [
            'cart' => DemoCart::state(),
            'feefo' => self::siteFeefo(),
        ]);
    }

    public function lifetimeGuarantee(): View
    {
        DemoCart::seed();

        return view('demo.lifetime-guarantee', [
            'cart' => DemoCart::state(),
            'feefo' => self::siteFeefo(),
        ]);
    }

    /** @return array<string, mixed> */
    private static function siteFeefo(): array
    {
        $product = DemoCart::pdpProduct();

        return [
            'rating' => 4.3,
            'max_rating' => 5,
            'review_count' => 12465,
            'reviews' => $product['feefo']['reviews'],
        ];
    }

    public function homeArgos(): View
    {
        DemoCart::seed();

        $yg = 'https://www.yougarden.com';

        return view('demo.home-argos', [
            'cart' => DemoCart::state(),
            'shop_menu' => $this->argosShopMenu($yg),
            'trending_links' => [
                ['label' => 'Popular Garden Plants', 'url' => $yg.'/garden-plants/popular-garden-plants'],
                ['label' => 'Oleander Plants', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/oleander-plants'],
                ['label' => 'Autumn Bedding', 'url' => $yg.'/garden-plants/bedding-plants/autumn-bedding-plants'],
                ['label' => 'Citrus Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/citrus-trees-and-plants'],
                ['label' => 'Drought Tolerant Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/drought-tolerant-plants'],
            ],
            'categories' => [
                [
                    'label' => 'New arrivals',
                    'url' => 'https://www.yougarden.com/new',
                    'image' => 'images/home-preview/cats/new.jpg',
                ],
                [
                    'label' => 'Top deals',
                    'url' => 'https://www.yougarden.com/sale',
                    'sale' => true,
                ],
                [
                    'label' => 'Garden plants',
                    'url' => 'https://www.yougarden.com/garden-plants',
                    'image' => 'images/home-preview/cats/garden-plants.jpg',
                ],
                [
                    'label' => 'Roses',
                    'url' => 'https://www.yougarden.com/garden-plants/roses',
                    'image' => 'images/home-preview/cats/roses.jpg',
                ],
                [
                    'label' => 'Trees & shrubs',
                    'url' => 'https://www.yougarden.com/trees-and-shrubs',
                    'image' => 'images/home-preview/cats/trees.jpg',
                ],
                [
                    'label' => 'Mediterranean',
                    'url' => 'https://www.yougarden.com/trees-and-shrubs/mediterranean-plants-for-uk-gardens',
                    'image' => 'images/home-preview/cats/mediterranean.jpg',
                ],
                [
                    'label' => 'Fruits & veg',
                    'url' => 'https://www.yougarden.com/grow-your-own-fruit-and-veg',
                    'image' => 'images/home-preview/cats/fruit-veg.jpg',
                ],
                [
                    'label' => 'Houseplants',
                    'url' => 'https://www.yougarden.com/houseplants',
                    'image' => 'images/home-preview/cats/houseplants.jpg',
                ],
                [
                    'label' => 'Outdoor living',
                    'url' => 'https://www.yougarden.com/outdoor-living',
                    'image' => 'images/home-preview/cats/outdoor.jpg',
                ],
                [
                    'label' => 'Fruit trees',
                    'url' => 'https://www.yougarden.com/grow-your-own-fruit-and-veg/fruit-trees',
                    'image' => 'images/home-preview/cats/fruit-trees.jpg',
                ],
                [
                    'label' => 'Perennials',
                    'url' => 'https://www.yougarden.com/garden-plants/perennial-plants-and-flowers',
                    'image' => 'images/home-preview/cats/perennials.jpg',
                ],
                [
                    'label' => 'Climbing plants',
                    'url' => 'https://www.yougarden.com/garden-plants/climbing-plants',
                    'image' => 'images/home-preview/cats/climbing.jpg',
                ],
                [
                    'label' => 'Autumn bedding',
                    'url' => 'https://www.yougarden.com/garden-plants/bedding-plants/autumn-bedding-plants',
                    'image' => 'images/home-preview/cats/autumn-bedding.jpg',
                ],
                [
                    'label' => 'Bulbs',
                    'url' => 'https://www.yougarden.com/garden-plants/garden-bulbs',
                    'image' => 'images/home-preview/cats/bulbs.jpg',
                ],
                [
                    'label' => 'Drought tolerant',
                    'url' => 'https://www.yougarden.com/garden-plants/popular-garden-plants/drought-tolerant-plants',
                    'image' => 'images/home-preview/cats/drought.jpg',
                ],
                [
                    'label' => 'Feeds',
                    'url' => 'https://www.yougarden.com/outdoor-living/feeds-and-fertilisers',
                    'image' => 'images/home-preview/cats/feeds.jpg',
                ],
            ],
            'hero_slides' => [
                [
                    'image' => 'images/home-preview/live/hero-1.jpg',
                    'alt' => "Wallflower 'Sugar Rush' Mix",
                    'url' => 'https://www.yougarden.com/item-s-pa372/wallflower-sugar-rush-mix?Option=PA372',
                    'cta_theme' => 'rose',
                    'ctas' => [
                        ['label' => 'Shop wallflowers', 'url' => 'https://www.yougarden.com/item-s-pa372/wallflower-sugar-rush-mix?Option=PA372'],
                        ['label' => 'Shop autumn bedding', 'url' => 'https://www.yougarden.com/garden-plants/bedding-plants/autumn-bedding-plants'],
                        ['label' => 'Shop garden plants', 'url' => 'https://www.yougarden.com/garden-plants'],
                        ['label' => 'Shop the sale', 'url' => 'https://www.yougarden.com/sale'],
                    ],
                ],
                [
                    'image' => 'images/home-preview/live/hero-2.jpg',
                    'alt' => 'Orange and Lemon Collection',
                    'url' => 'https://www.yougarden.com/item-p-300326/citrus-orange-and-lemon-tree-collection-with-feed',
                    'cta_theme' => 'forest',
                    'ctas' => [
                        ['label' => 'Shop citrus trees', 'url' => 'https://www.yougarden.com/item-p-300326/citrus-orange-and-lemon-tree-collection-with-feed'],
                        ['label' => 'Shop Mediterranean', 'url' => 'https://www.yougarden.com/trees-and-shrubs/mediterranean-plants-for-uk-gardens'],
                        ['label' => 'Shop fruit trees', 'url' => 'https://www.yougarden.com/grow-your-own-fruit-and-veg/fruit-trees'],
                        ['label' => 'Shop feeds', 'url' => 'https://www.yougarden.com/outdoor-living/feeds-and-fertilisers'],
                    ],
                ],
                [
                    'image' => 'images/home-preview/live/hero-3.jpg',
                    'alt' => 'Oleander Plants',
                    'url' => 'https://www.yougarden.com/trees-and-shrubs/mediterranean-plants-for-uk-gardens/oleander-plants',
                    'cta_theme' => 'stone',
                    'ctas' => [
                        ['label' => 'Shop oleander', 'url' => 'https://www.yougarden.com/trees-and-shrubs/mediterranean-plants-for-uk-gardens/oleander-plants'],
                        ['label' => 'Shop Mediterranean', 'url' => 'https://www.yougarden.com/trees-and-shrubs/mediterranean-plants-for-uk-gardens'],
                        ['label' => 'Shop trees & shrubs', 'url' => 'https://www.yougarden.com/trees-and-shrubs'],
                        ['label' => 'Shop drought tolerant', 'url' => 'https://www.yougarden.com/garden-plants/popular-garden-plants/drought-tolerant-plants'],
                    ],
                ],
                [
                    'type' => 'video',
                    'video' => 'videos/home-preview/hero-garden-plants.mp4',
                    'image' => 'images/home-preview/live/hero-4-poster.jpg',
                    'alt' => 'Gardening with plants — greenhouse watering',
                    'url' => 'https://www.yougarden.com/garden-plants',
                    'cta_theme' => 'forest',
                    'ctas' => [
                        ['label' => 'Shop garden plants', 'url' => 'https://www.yougarden.com/garden-plants'],
                        ['label' => 'Shop bedding plants', 'url' => 'https://www.yougarden.com/garden-plants/bedding-plants'],
                        ['label' => 'Shop perennials', 'url' => 'https://www.yougarden.com/garden-plants/perennial-plants-and-flowers'],
                        ['label' => 'Shop the sale', 'url' => 'https://www.yougarden.com/sale'],
                    ],
                ],
            ],
            // Previous lifestyle hero kept at images/home-preview/hero-garden-original-backup.jpg
            // Below-the-fold modules mirrored from live yougarden.com homepage
            'row4' => [
                [
                    'label' => 'Mediterranean Plants',
                    'url' => 'https://www.yougarden.com/trees-and-shrubs/mediterranean-plants-for-uk-gardens',
                    'image' => 'images/home-preview/live/79-1.jpg',
                ],
                [
                    'label' => 'Garden Shrubs',
                    'url' => 'https://www.yougarden.com/trees-and-shrubs/garden-shrubs',
                    'image' => 'images/home-preview/live/79-2.jpg',
                ],
                [
                    'label' => 'Perennials',
                    'url' => 'https://www.yougarden.com/garden-plants/perennial-plants-and-flowers',
                    'image' => 'images/home-preview/live/79-3.jpg',
                ],
                [
                    'label' => 'Drought Tolerant Plants',
                    'url' => 'https://www.yougarden.com/garden-plants/popular-garden-plants/drought-tolerant-plants',
                    'image' => 'images/home-preview/live/79-4.jpg',
                ],
            ],
            'philosophy_banner' => 'images/home-preview/live/74.jpg',
            'philosophy_copy' => "That's right; you do not even need a garden to get growing. Many of our plants can be grown on balconies, small patios and decking, so you can catch the growing bug, and even grow your own freshest fruit and vegetables too.\n\nWe have only chosen plants that are easy to grow and will give successful results with a minimum of experience. From the thousands of plants available, we have picked those that really work and perform. We have done the sifting and choosing for you, to bring you the best.",
            'catalogue_banner' => [
                'url' => 'https://content.yudu.com/web/433ma/0A44t64/2026-Summer-Sale/html/index.html',
                'image' => 'images/home-preview/live/66.jpg',
                'label' => 'New Catalogue',
            ],
            'featured_grid' => [
                'featured' => [
                    'label' => 'Roses',
                    'url' => 'https://www.yougarden.com/garden-plants/roses',
                    'image' => 'images/home-preview/live/80-1.jpg',
                ],
                'tiles' => [
                    [
                        'label' => 'Acers',
                        'url' => 'https://www.yougarden.com/trees-and-shrubs/garden-trees/japanese-acer-trees',
                        'image' => 'images/home-preview/live/80-2.jpg',
                    ],
                    [
                        'label' => 'Autumn Bedding',
                        'url' => 'https://www.yougarden.com/garden-plants/bedding-plants/autumn-bedding-plants',
                        'image' => 'images/home-preview/live/80-3.jpg',
                    ],
                    [
                        'label' => 'Pots & Planters',
                        'url' => 'https://www.yougarden.com/outdoor-living/pots-and-planters',
                        'image' => 'images/home-preview/live/80-4.jpg',
                    ],
                    [
                        'label' => 'Houseplants',
                        'url' => 'https://www.yougarden.com/houseplants',
                        'image' => 'images/home-preview/live/80-5.jpg',
                    ],
                ],
            ],
            'row4_secondary' => [
                [
                    'label' => 'Climbing Plants',
                    'url' => 'https://www.yougarden.com/garden-plants/climbing-plants',
                    'image' => 'images/home-preview/live/81-1.jpg',
                ],
                [
                    'label' => 'Fruit & Veg',
                    'url' => 'https://www.yougarden.com/grow-your-own-fruit-and-veg',
                    'image' => 'images/home-preview/live/81-2.jpg',
                ],
                [
                    'label' => 'Autumn Planting Bulbs',
                    'url' => 'https://www.yougarden.com/garden-plants/garden-bulbs/spring-flowering-bulbs',
                    'image' => 'images/home-preview/live/81-3.jpg',
                ],
                [
                    'label' => 'Feeds & Fertilisers',
                    'url' => 'https://www.yougarden.com/outdoor-living/feeds-and-fertilisers',
                    'image' => 'images/home-preview/live/81-4.jpg',
                ],
            ],
            'sale_banner' => [
                'url' => 'https://www.yougarden.com/sale',
                'image' => 'images/home-preview/live/70.jpg',
                'label' => 'Sale',
            ],
            'blog_promos' => [
                [
                    'url' => 'https://www.yougarden.com/blog/plant-of-the-month-july-2026/',
                    'image' => 'images/home-preview/live/64-1.jpg',
                    'label' => 'Plant of the Month — July 2026',
                ],
                [
                    'url' => 'https://www.yougarden.com/blog/gardening-jobs-for-july/',
                    'image' => 'images/home-preview/live/64-2.jpg',
                    'label' => 'Gardening jobs for July',
                ],
            ],
            'club_banner' => [
                'url' => 'https://www.yougarden.com/item-p-820001/yg-discount-club-annual-membership',
                'image' => 'images/home-preview/live/77.jpg',
                'label' => 'Join the YouGarden Club',
            ],
            'media_promos' => [
                [
                    'url' => route('demo.tv-live'),
                    'image' => 'images/home-preview/live/78-1.jpg',
                    'label' => 'YouGarden TV Live',
                ],
                [
                    'url' => 'https://www.yougarden.com/blog/',
                    'image' => 'images/home-preview/live/78-2.jpg',
                    'label' => 'YouGarden Blog',
                ],
            ],
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

    /**
     * YouGarden-style shop mega menu (department → category → subcategories).
     *
     * @return list<array{title: string, url: string, children: list<array{label: string, url: string, children?: list<array{label: string, url: string}>}>}>
     */
    private function argosShopMenu(string $yg): array
    {
        return [
            [
                'title' => 'Garden Plants',
                'url' => $yg.'/garden-plants',
                'children' => [
                    [
                        'label' => 'Garden Bulbs',
                        'url' => $yg.'/garden-plants/garden-bulbs',
                        'children' => [
                            ['label' => 'Summer Flowering Bulbs', 'url' => $yg.'/garden-plants/garden-bulbs/summer-flowering-bulbs'],
                            ['label' => 'Spring Flowering Bulbs', 'url' => $yg.'/garden-plants/garden-bulbs/spring-flowering-bulbs'],
                            ['label' => '3 for 2 Bulb Packs', 'url' => $yg.'/garden-plants/garden-bulbs/3-for-2-bulb-packs-offer'],
                            ['label' => 'Drop In Bulb Pods', 'url' => $yg.'/garden-plants/garden-bulbs/drop-in-bulb-pods'],
                            ['label' => 'View All Garden Bulbs', 'url' => $yg.'/garden-plants/garden-bulbs'],
                        ],
                    ],
                    [
                        'label' => 'Bedding Plants',
                        'url' => $yg.'/garden-plants/bedding-plants',
                        'children' => [
                            ['label' => 'Spring Bedding Plants', 'url' => $yg.'/garden-plants/bedding-plants/spring-bedding-plants'],
                            ['label' => 'Garden Ready Bedding', 'url' => $yg.'/garden-plants/bedding-plants/garden-ready-bedding-plants'],
                            ['label' => 'Pre-Planted Hanging Baskets', 'url' => $yg.'/garden-plants/bedding-plants/pre-planted-hanging-baskets'],
                            ['label' => 'Autumn Bedding Plants', 'url' => $yg.'/garden-plants/bedding-plants/autumn-bedding-plants'],
                            ['label' => 'View All Bedding Plants', 'url' => $yg.'/garden-plants/bedding-plants'],
                        ],
                    ],
                    [
                        'label' => 'Perennial Plants & Flowers',
                        'url' => $yg.'/garden-plants/perennial-plants-and-flowers',
                        'children' => [
                            ['label' => 'Agapanthus Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/agapanthus-plants'],
                            ['label' => 'Chrysanthemum Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/chrysanthemum-plants'],
                            ['label' => 'Echinacea Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/echinacea-plants'],
                            ['label' => 'Fern Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/fern-plants'],
                            ['label' => 'Perennial Geranium Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/perennial-geranium-plants'],
                            ['label' => 'Gerbera Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/gerbera-plants'],
                            ['label' => 'Hellebore Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/hellebore-plants'],
                            ['label' => 'Peony Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/peony-plants'],
                            ['label' => 'Perennial Plants', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers/perennial-plants'],
                            ['label' => 'View All Perennial Plants & Flowers', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers'],
                        ],
                    ],
                    [
                        'label' => 'Popular Garden Plants',
                        'url' => $yg.'/garden-plants/popular-garden-plants',
                        'children' => [
                            ['label' => 'Drought Tolerant Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/drought-tolerant-plants'],
                            ['label' => 'Plants For Containers', 'url' => $yg.'/garden-plants/popular-garden-plants/plants-for-containers'],
                            ['label' => 'Ground Cover Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/ground-cover-plants'],
                            ['label' => 'Plants for Hanging Baskets', 'url' => $yg.'/garden-plants/popular-garden-plants/plants-for-hanging-baskets'],
                            ['label' => 'Low Maintenance Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/low-maintenance-plants'],
                            ['label' => 'Patio Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/patio-plants'],
                            ['label' => 'Shade Loving Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/shade-loving-plants'],
                            ['label' => 'Border Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/border-plants'],
                            ['label' => 'View All Popular Garden Plants', 'url' => $yg.'/garden-plants/popular-garden-plants'],
                        ],
                    ],
                    [
                        'label' => 'Roses',
                        'url' => $yg.'/garden-plants/roses',
                        'children' => [
                            ['label' => 'Bare Root Roses', 'url' => $yg.'/garden-plants/roses/bare-root-roses'],
                            ['label' => 'Potted Roses', 'url' => $yg.'/garden-plants/roses/potted-roses'],
                            ['label' => 'Bush & Shrub Roses', 'url' => $yg.'/garden-plants/roses/bush-and-shrub-roses'],
                            ['label' => 'Climbing Roses', 'url' => $yg.'/garden-plants/roses/climbing-roses'],
                            ['label' => 'Standard Roses', 'url' => $yg.'/garden-plants/roses/standard-roses'],
                            ['label' => 'Celebration Roses', 'url' => $yg.'/garden-plants/roses/celebration-roses'],
                            ['label' => 'View All Roses', 'url' => $yg.'/garden-plants/roses'],
                        ],
                    ],
                    [
                        'label' => 'Climbing Plants',
                        'url' => $yg.'/garden-plants/climbing-plants',
                        'children' => [
                            ['label' => 'Clematis Plants', 'url' => $yg.'/garden-plants/climbing-plants/clematis-plants'],
                            ['label' => 'Honeysuckle Plants', 'url' => $yg.'/garden-plants/climbing-plants/honeysuckle-plants'],
                            ['label' => 'Jasmine', 'url' => $yg.'/garden-plants/climbing-plants/jasmine'],
                            ['label' => 'Passion Flowers', 'url' => $yg.'/garden-plants/climbing-plants/passion-flowers'],
                            ['label' => 'Wisteria Plants', 'url' => $yg.'/garden-plants/climbing-plants/wisteria-plants'],
                            ['label' => 'View All Climbing Plants', 'url' => $yg.'/garden-plants/climbing-plants'],
                        ],
                    ],
                    [
                        'label' => 'Pond Plants',
                        'url' => $yg.'/garden-plants/pond-plants',
                    ],
                ],
            ],
            [
                'title' => 'Trees & Shrubs',
                'url' => $yg.'/trees-and-shrubs',
                'children' => [
                    [
                        'label' => 'Garden Trees',
                        'url' => $yg.'/trees-and-shrubs/garden-trees',
                        'children' => [
                            ['label' => 'Standard Trees and Plants', 'url' => $yg.'/trees-and-shrubs/garden-trees/standard-trees-and-plants'],
                            ['label' => 'Evergreen Trees', 'url' => $yg.'/trees-and-shrubs/garden-trees/evergreen-trees'],
                            ['label' => 'Flowering Cherry', 'url' => $yg.'/trees-and-shrubs/garden-trees/flowering-cherry'],
                            ['label' => 'Japanese Acer Trees', 'url' => $yg.'/trees-and-shrubs/garden-trees/japanese-acer-trees'],
                            ['label' => 'Ornamental Trees', 'url' => $yg.'/trees-and-shrubs/garden-trees/ornamental-trees'],
                            ['label' => 'View All Garden Trees', 'url' => $yg.'/trees-and-shrubs/garden-trees'],
                        ],
                    ],
                    [
                        'label' => 'Garden Shrubs',
                        'url' => $yg.'/trees-and-shrubs/garden-shrubs',
                        'children' => [
                            ['label' => 'Buddleia Plants & Bushes', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/buddleia-plants-and-bushes'],
                            ['label' => 'Evergreen Shrubs', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/evergreen-shrubs'],
                            ['label' => 'Flowering Shrubs', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/flowering-shrubs'],
                            ['label' => 'Hydrangea Plants', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/hydrangea-plants'],
                            ['label' => 'Lavender Plants', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/lavender-plants'],
                            ['label' => 'Rhododendron Plants', 'url' => $yg.'/trees-and-shrubs/garden-shrubs/rhododendron-plants'],
                            ['label' => 'View All Garden Shrubs', 'url' => $yg.'/trees-and-shrubs/garden-shrubs'],
                        ],
                    ],
                    [
                        'label' => 'Mediterranean Plants',
                        'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens',
                        'children' => [
                            ['label' => 'Palm Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/palm-trees'],
                            ['label' => 'Oleander Plants', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/oleander-plants'],
                            ['label' => 'Italian Cypress Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/italian-cypress-trees'],
                            ['label' => 'Citrus Trees and Plants', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/citrus-trees-and-plants'],
                            ['label' => 'Olive Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/olive-trees'],
                            ['label' => 'Bay Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/bay-trees'],
                            ['label' => 'View All Mediterranean Plants', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens'],
                        ],
                    ],
                    [
                        'label' => 'Hedging',
                        'url' => $yg.'/trees-and-shrubs/hedging-plants',
                        'children' => [
                            ['label' => 'Bare Root Hedging Plants', 'url' => $yg.'/trees-and-shrubs/hedging-plants/bare-root-hedging-plants'],
                            ['label' => 'Potted Hedging', 'url' => $yg.'/trees-and-shrubs/hedging-plants/potted-hedging'],
                            ['label' => 'Instant Hedging', 'url' => $yg.'/trees-and-shrubs/hedging-plants/instant-hedging'],
                            ['label' => 'View All Hedging', 'url' => $yg.'/trees-and-shrubs/hedging-plants'],
                        ],
                    ],
                    [
                        'label' => 'Statement Plants',
                        'url' => $yg.'/trees-and-shrubs/statement-plants',
                    ],
                ],
            ],
            [
                'title' => 'Houseplants',
                'url' => $yg.'/houseplants',
                'children' => [
                    ['label' => 'Indoor Flowering Plants', 'url' => $yg.'/houseplants/indoor-flowering-plants'],
                    ['label' => 'Indoor Foliage Plants', 'url' => $yg.'/houseplants/indoor-foliage-plants'],
                    ['label' => 'Large Houseplants', 'url' => $yg.'/houseplants/large-houseplants'],
                    ['label' => 'Carnivorous Houseplants', 'url' => $yg.'/houseplants/carnivorous-houseplants'],
                    ['label' => 'Indoor Houseplant Pots', 'url' => $yg.'/houseplants/indoor-houseplant-pots'],
                ],
            ],
            [
                'title' => 'Fruits & Veg',
                'url' => $yg.'/grow-your-own-fruit-and-veg',
                'children' => [
                    [
                        'label' => 'Fruit Trees',
                        'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees',
                        'children' => [
                            ['label' => 'Bare Root Fruit Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/bare-root-fruit-trees'],
                            ['label' => 'Potted Fruit Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/potted-fruit-trees'],
                            ['label' => 'Apple Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/apple-trees'],
                            ['label' => 'Cherry Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/cherry-trees'],
                            ['label' => 'Pear Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/pear-trees'],
                            ['label' => 'Plum Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees/plum-trees'],
                            ['label' => 'View All Fruit Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees'],
                        ],
                    ],
                    [
                        'label' => 'Fruit Bushes',
                        'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes',
                        'children' => [
                            ['label' => 'Strawberry Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes/strawberry-plants'],
                            ['label' => 'Raspberry Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes/raspberry-plants'],
                            ['label' => 'Currant Bushes', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes/currant-bushes'],
                            ['label' => 'Blackberry Plants & Other Berries', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes/blackberry-plants-and-other-berries'],
                            ['label' => 'View All Fruit Bushes', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes'],
                        ],
                    ],
                    ['label' => 'Seed Potatoes', 'url' => $yg.'/grow-your-own-fruit-and-veg/seed-potatoes'],
                    ['label' => 'Tomato Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/tomato-plants'],
                    ['label' => 'Vegetable Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/vegetable-plants'],
                    ['label' => 'Herb Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/herb-plants'],
                    ['label' => 'Superfruit Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg/superfruit-plants'],
                ],
            ],
            [
                'title' => 'Outdoor Living',
                'url' => $yg.'/outdoor-living',
                'children' => [
                    [
                        'label' => 'Garden Tools',
                        'url' => $yg.'/outdoor-living/garden-tools',
                        'children' => [
                            ['label' => 'Lawnmowers', 'url' => $yg.'/outdoor-living/garden-tools/lawnmowers'],
                            ['label' => 'Strimmers & Trimmers', 'url' => $yg.'/outdoor-living/garden-tools/garden-strimmers-and-trimmers'],
                            ['label' => 'Other Tools', 'url' => $yg.'/outdoor-living/garden-tools/other-tools'],
                            ['label' => 'View All Garden Tools', 'url' => $yg.'/outdoor-living/garden-tools'],
                        ],
                    ],
                    ['label' => 'Pots and Planters', 'url' => $yg.'/outdoor-living/pots-and-planters'],
                    ['label' => 'Hanging Baskets', 'url' => $yg.'/outdoor-living/hanging-baskets'],
                    ['label' => 'Feeds & Fertilisers', 'url' => $yg.'/outdoor-living/feeds-and-fertilisers'],
                    [
                        'label' => 'Plant Protection / Pest Control',
                        'url' => $yg.'/outdoor-living/plant-protection-and-pest-control',
                        'children' => [
                            ['label' => 'Organic Gardening', 'url' => $yg.'/outdoor-living/plant-protection-and-pest-control/organic-gardening'],
                            ['label' => 'Garden Pest Control', 'url' => $yg.'/outdoor-living/plant-protection-and-pest-control/garden-pest-control'],
                            ['label' => 'Cold Frames & Frost Protection', 'url' => $yg.'/outdoor-living/plant-protection-and-pest-control/cold-frames-and-frost-protection'],
                            ['label' => 'View All Plant Protection', 'url' => $yg.'/outdoor-living/plant-protection-and-pest-control'],
                        ],
                    ],
                    ['label' => 'Compost', 'url' => $yg.'/outdoor-living/compost'],
                    ['label' => 'Garden Furniture', 'url' => $yg.'/outdoor-living/garden-furniture'],
                    ['label' => 'Gifts', 'url' => $yg.'/outdoor-living/gifts'],
                    ['label' => 'Bird Feeders & Feed', 'url' => $yg.'/outdoor-living/bird-feeders-and-feed'],
                ],
            ],
        ];
    }
}
