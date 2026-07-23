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
            'shop_menu' => [
                [
                    'title' => 'Garden Plants',
                    'url' => $yg.'/garden-plants',
                    'links' => [
                        ['label' => 'Perennials', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers'],
                        ['label' => 'Roses', 'url' => $yg.'/garden-plants/roses'],
                        ['label' => 'Bedding Plants', 'url' => $yg.'/garden-plants/bedding-plants'],
                        ['label' => 'Garden Bulbs', 'url' => $yg.'/garden-plants/garden-bulbs'],
                        ['label' => 'Climbing Plants', 'url' => $yg.'/garden-plants/climbing-plants'],
                        ['label' => 'Popular Plants', 'url' => $yg.'/garden-plants/popular-garden-plants'],
                    ],
                ],
                [
                    'title' => 'Trees & Shrubs',
                    'url' => $yg.'/trees-and-shrubs',
                    'links' => [
                        ['label' => 'Garden Trees', 'url' => $yg.'/trees-and-shrubs/garden-trees'],
                        ['label' => 'Garden Shrubs', 'url' => $yg.'/trees-and-shrubs/garden-shrubs'],
                        ['label' => 'Mediterranean Plants', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens'],
                        ['label' => 'Japanese Acers', 'url' => $yg.'/trees-and-shrubs/garden-trees/japanese-acer-trees'],
                        ['label' => 'Hedging', 'url' => $yg.'/trees-and-shrubs/hedging'],
                    ],
                ],
                [
                    'title' => 'Houseplants',
                    'url' => $yg.'/houseplants',
                    'links' => [
                        ['label' => 'Large Houseplants', 'url' => $yg.'/houseplants/large-houseplants'],
                        ['label' => 'Carnivorous Plants', 'url' => $yg.'/houseplants/carnivorous-houseplants'],
                    ],
                ],
                [
                    'title' => 'Fruits & Veg',
                    'url' => $yg.'/grow-your-own-fruit-and-veg',
                    'links' => [
                        ['label' => 'Fruit Trees', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-trees'],
                        ['label' => 'Fruit Bushes', 'url' => $yg.'/grow-your-own-fruit-and-veg/fruit-bushes'],
                        ['label' => 'Vegetable Plants', 'url' => $yg.'/grow-your-own-fruit-and-veg'],
                    ],
                ],
                [
                    'title' => 'Outdoor Living',
                    'url' => $yg.'/outdoor-living',
                    'links' => [
                        ['label' => 'Pots & Planters', 'url' => $yg.'/outdoor-living/pots-and-planters'],
                        ['label' => 'Feeds & Fertilisers', 'url' => $yg.'/outdoor-living/feeds-and-fertilisers'],
                        ['label' => 'Garden Tools', 'url' => $yg.'/outdoor-living/garden-tools'],
                    ],
                ],
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
}
