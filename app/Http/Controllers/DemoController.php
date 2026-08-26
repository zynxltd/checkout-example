<?php

namespace App\Http\Controllers;

use App\Services\DemoArgosNav;
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
            'shop_menu' => DemoArgosNav::shopMenu($yg),
            'trending_links' => DemoArgosNav::trendingLinks($yg),
            'categories' => [
                [
                    'label' => 'New arrivals',
                    'url' => 'https://www.yougarden.com/new',
                    'image' => 'images/home-preview/cats/new.jpg',
                ],
                [
                    'label' => 'Top deals',
                    'url' => route('demo.sale'),
                    'sale' => true,
                ],
                [
                    'label' => 'Garden plants',
                    'url' => route('demo.listing.garden-plants'),
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
                    'url' => route('demo.listing.perennials'),
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
                    'alt' => "Pansy 'Top Wave'",
                    'url' => 'https://www.yougarden.com/item-s-pa460027/pre-planted-pansy-top-wave-hanging-baskets',
                    'cta_theme' => 'rose',
                    'ctas' => [
                        ['label' => 'Shop hanging baskets', 'url' => 'https://www.yougarden.com/garden-plants/bedding-plants/pre-planted-hanging-baskets'],
                        ['label' => 'Shop pansies', 'url' => 'https://www.yougarden.com/item-s-pa460027/pre-planted-pansy-top-wave-hanging-baskets'],
                        ['label' => 'Shop autumn bedding', 'url' => 'https://www.yougarden.com/garden-plants/bedding-plants/autumn-bedding-plants'],
                        ['label' => 'Shop the sale', 'url' => route('demo.sale')],
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
                    'alt' => "Wallflower 'Sugar Rush' Mix",
                    'url' => 'https://www.yougarden.com/item-s-pa372/wallflower-sugar-rush-mix?Option=PA372',
                    'cta_theme' => 'stone',
                    'ctas' => [
                        ['label' => 'Shop wallflowers', 'url' => 'https://www.yougarden.com/item-s-pa372/wallflower-sugar-rush-mix?Option=PA372'],
                        ['label' => 'Shop autumn bedding', 'url' => 'https://www.yougarden.com/garden-plants/bedding-plants/autumn-bedding-plants'],
                        ['label' => 'Shop garden plants', 'url' => route('demo.listing.perennials')],
                        ['label' => 'Shop the sale', 'url' => route('demo.sale')],
                    ],
                ],
            ],
            // Previous lifestyle hero kept at images/home-preview/hero-garden-original-backup.jpg
            // Below-the-fold modules mirrored from live yougarden.com homepage
            // First 5 = static layouts; extras power category carousels
            // 21 tiles → Variant 5 circle strip gets 3 slides at 7-up; Variant 1 uses first 12 at 4-up
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
                [
                    'label' => 'Roses',
                    'url' => 'https://www.yougarden.com/garden-plants/roses',
                    'image' => 'images/home-preview/live/80-1.jpg',
                ],
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
                [
                    'label' => 'Houseplants',
                    'url' => 'https://www.yougarden.com/houseplants',
                    'image' => 'images/home-preview/live/80-5.jpg',
                ],
                [
                    'label' => 'Trees & Shrubs',
                    'url' => 'https://www.yougarden.com/trees-and-shrubs',
                    'image' => 'images/home-preview/live/80-2.jpg',
                ],
                [
                    'label' => 'Bedding Plants',
                    'url' => 'https://www.yougarden.com/garden-plants/bedding-plants',
                    'image' => 'images/home-preview/live/80-3.jpg',
                ],
                [
                    'label' => 'Outdoor Living',
                    'url' => 'https://www.yougarden.com/outdoor-living',
                    'image' => 'images/home-preview/cats/outdoor.jpg',
                ],
                [
                    'label' => 'Fruit Trees',
                    'url' => 'https://www.yougarden.com/grow-your-own-fruit-and-veg/fruit-trees',
                    'image' => 'images/home-preview/cats/fruit-trees.jpg',
                ],
                [
                    'label' => 'Japanese Acers',
                    'url' => 'https://www.yougarden.com/trees-and-shrubs/garden-trees/japanese-acer-trees',
                    'image' => 'images/home-preview/cats/acers.jpg',
                ],
                [
                    'label' => 'Hanging Baskets',
                    'url' => 'https://www.yougarden.com/garden-plants/bedding-plants/pre-planted-hanging-baskets',
                    'image' => 'images/home-preview/cats/hanging-baskets.jpg',
                ],
                [
                    'label' => 'Herbs',
                    'url' => 'https://www.yougarden.com/grow-your-own-fruit-and-veg/herbs',
                    'image' => 'images/home-preview/cats/herbs.jpg',
                ],
                [
                    'label' => 'Pots & Planters',
                    'url' => 'https://www.yougarden.com/outdoor-living/pots-and-planters',
                    'image' => 'images/home-preview/cats/pots-planters.jpg',
                ],
                [
                    'label' => 'Garden Tools',
                    'url' => 'https://www.yougarden.com/outdoor-living/garden-tools',
                    'image' => 'images/home-preview/cats/garden-tools.jpg',
                ],
                [
                    'label' => 'Bird Care',
                    'url' => 'https://www.yougarden.com/outdoor-living/bird-care',
                    'image' => 'images/home-preview/cats/bird-feeders.jpg',
                ],
                [
                    'label' => 'Gifts',
                    'url' => 'https://www.yougarden.com/gifts',
                    'image' => 'images/home-preview/cats/gifts.jpg',
                ],
            ],
            'customer_favourites' => [
                'headline' => 'Customer favourites',
                'headline_url' => 'https://www.yougarden.com/garden-plants/popular-garden-plants',
                'products' => [
                    [
                        'name' => "Pair of Italian Cypress Trees",
                        'url' => 'https://www.yougarden.com/item-p-510471/pair-of-italian-cypress-trees',
                        'image' => 'https://s3.amazonaws.com/YouGarden/Web/500x500/510471.jpg',
                        'price' => '£39.98',
                        'saving' => 20,
                    ],
                    [
                        'name' => "Canna 'Tropicanna'",
                        'url' => 'https://www.yougarden.com/item-p-560606/canna-tropicanna',
                        'image' => 'https://s3.amazonaws.com/YouGarden/Web/500x500/560606.jpg',
                        'price' => '£7.99',
                        'saving' => 38,
                    ],
                    [
                        'name' => "Lilac 'Palibin' Standard",
                        'url' => 'https://www.yougarden.com/item-p-510317/lilac-palibin-standard',
                        'image' => 'https://s3.amazonaws.com/YouGarden/Web/500x500/510317.jpg',
                        'price' => '£24.99',
                        'saving' => 38,
                    ],
                    [
                        'name' => "Japanese Acer 'Taylor'",
                        'url' => 'https://www.yougarden.com/item-p-510524/japanese-acer-taylor',
                        'image' => 'https://s3.amazonaws.com/YouGarden/Web/500x500/510524.jpg',
                        'price' => '£34.99',
                        'saving' => 13,
                    ],
                    [
                        'name' => "Imperata 'Red Baron' - Blood Grass",
                        'url' => 'https://www.yougarden.com/item-p-560017/imperata-red-baron--blood-grass',
                        'image' => 'https://s3.amazonaws.com/YouGarden/Web/500x500/560017.jpg',
                        'price' => '£14.97',
                        'saving' => 50,
                    ],
                    [
                        'name' => "Geranium 'Rozanne' - RHS Plant of the Centenary",
                        'url' => 'https://www.yougarden.com/item-p-480120/geranium-rozanne--rhs-plant-of-the-centenary',
                        'image' => 'https://s3.amazonaws.com/YouGarden/Web/500x500/480120.jpg',
                        'price' => '£19.97',
                        'saving' => 33,
                    ],
                    [
                        'name' => "Nandina 'Obsessed' - Sacred Bamboo",
                        'url' => 'https://www.yougarden.com/item-p-510759/nandina-obsessed--sacred-bamboo',
                        'image' => 'https://s3.amazonaws.com/YouGarden/Web/500x500/510759.jpg',
                        'price' => '£14.99',
                        'saving' => 25,
                    ],
                ],
            ],
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
                'url' => route('demo.sale'),
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

    /**
     * CRO-optimised /sale landing page.
     * Above-the-fold: category image strip + PLP filters, then sale product grid.
     */
    public function sale(): View
    {
        DemoCart::seed();

        $yg = 'https://www.yougarden.com';
        $img = fn (string $file) => 'images/home-preview/sale/'.$file;

        $deal = function (
            string $name,
            string $url,
            string $image,
            string $price,
            int $discount,
            array $categories,
            float $rating,
            int $reviews,
            bool $bestseller = false,
            bool $featured = false,
            bool $outOfStock = false,
        ) use ($img): array {
            return [
                'name' => $name,
                'url' => $url,
                'image' => $img($image),
                'price' => $price,
                'discount' => $discount,
                'categories' => $categories,
                'rating' => $rating,
                'reviews' => $reviews,
                'bestseller' => $bestseller,
                'featured' => $featured,
                'out_of_stock' => $outOfStock,
            ];
        };

        $topDeals = [
            $deal(
                "Imperata 'Red Baron' — Blood Grass",
                $yg.'/item-p-560017/imperata-red-baron--blood-grass',
                'imperata-red-baron.jpg',
                'From £9.99',
                58,
                ['bestsellers', 'garden', 'clearance'],
                4.7,
                312,
                true,
                true,
            ),
            $deal(
                "The 'Best Ever' Hybrid Tea Rose Bush Collection",
                $yg.'/item-p-780034/the-best-ever-hybrid-tea-rose-bush-collection',
                'rose-best-ever.jpg',
                'Just £9.99',
                66,
                ['bestsellers', 'roses'],
                4.6,
                891,
                true,
                true,
            ),
            $deal(
                "Geranium 'Rozanne' — RHS Plant of the Centenary",
                $yg.'/item-p-480120/geranium-rozanne--rhs-plant-of-the-centenary',
                'geranium-rozanne.jpg',
                'From £9.99',
                33,
                ['bestsellers', 'garden'],
                4.8,
                1240,
                true,
            ),
            $deal(
                'Strawberry Plants — Sweet Summer Collection',
                $yg.'/item-p-320011/strawberry-plants',
                'sale-strawberries.jpg',
                'From £9.99',
                40,
                ['fruit', 'bestsellers'],
                4.5,
                478,
                true,
            ),
        ];

        $moreDeals = [
            $deal(
                "Rudbeckia 'Goldsturm'",
                $yg.'/item-p-560076/rudbeckia-goldsturm',
                'rudbeckia-goldsturm.jpg',
                'Just £14.97',
                50,
                ['garden', 'clearance'],
                4.4,
                186,
            ),
            $deal(
                "Nandina 'Obsessed' — Sacred Bamboo",
                $yg.'/item-p-510759/nandina-obsessed--sacred-bamboo',
                'nandina-obsessed.jpg',
                'Just £14.99',
                25,
                ['garden'],
                4.3,
                94,
                false,
                false,
                true,
            ),
            $deal(
                "Plum 'Victoria'",
                $yg.'/item-p-300025/plum-victoria',
                'sale-plum.jpg',
                'From £19.99',
                30,
                ['fruit', 'bare-root'],
                4.6,
                265,
            ),
            $deal(
                'Pre-Planted Tumbling Tom Tomato Baskets',
                $yg.'/item-p-280006/pre-planted-tumbling-tom-mix-tomato-hanging-baskets',
                'sale-tomatoes.jpg',
                'Just £19.99',
                33,
                ['fruit', 'garden'],
                4.5,
                512,
            ),
            $deal(
                'Pair of Italian Cypress Trees',
                $yg.'/item-p-510471/pair-of-italian-cypress-trees',
                'italian-cypress.jpg',
                'From £24.99',
                20,
                ['garden', 'bare-root'],
                4.4,
                733,
                false,
                false,
                true,
            ),
            $deal(
                'Bottlebrush Plant Callistemon citrinus',
                $yg.'/item-p-510046/bottlebrush-plant-callistemon-citrinus',
                'bottlebrush.jpg',
                'Just £19.99',
                20,
                ['bestsellers', 'garden'],
                4.5,
                401,
                true,
            ),
            $deal(
                "Ophiopogon 'Black Dragon Grass'",
                $yg.'/item-p-560219/ophiopogon-black-dragon-grass',
                'black-dragon-grass.jpg',
                'From £9.99',
                16,
                ['garden', 'clearance'],
                4.2,
                67,
            ),
            $deal(
                'Pond Plant Collection',
                $yg.'/item-p-560559/pond-plant-collection',
                'pond-collection.jpg',
                'Just £24.99',
                28,
                ['garden', 'clearance'],
                4.3,
                118,
            ),
            $deal(
                "Coronilla glauca 'Citrina'",
                $yg.'/item-p-511488/coronilla-glauca-citrina',
                'coronilla-citrina.jpg',
                'From £9.99',
                33,
                ['garden'],
                4.4,
                152,
            ),
            $deal(
                "Cordyline 'Charlie Boy'",
                $yg.'/item-p-680295/cordyline-charlie-boy',
                'cordyline-charlie.jpg',
                'From £14.99',
                37,
                ['garden', 'clearance'],
                4.3,
                89,
            ),
            $deal(
                "Magnolia 'Susan'",
                $yg.'/item-p-510157/magnolia-susan',
                'magnolia-susan.jpg',
                'Just £19.99',
                20,
                ['garden', 'bare-root'],
                4.5,
                210,
            ),
            $deal(
                'Acorn Planters 25cm Copper Tone × 4',
                $yg.'/item-p-130361/acorn-planters-25cm-copper-tone-x-4',
                'acorn-planters.jpg',
                'Just £14.96',
                37,
                ['clearance'],
                4.1,
                54,
            ),
        ];

        $allDeals = array_merge($topDeals, $moreDeals);
        $demoSkus = ['401842', '402156', '403891', '404220', '510317', '404221', '501004'];

        $allDeals = array_map(static function (array $deal, int $index) use ($demoSkus): array {
            $priceText = (string) ($deal['price'] ?? '');
            preg_match('/(\d+(?:\.\d+)?)/', $priceText, $priceMatch);
            $priceValue = isset($priceMatch[1]) ? (float) $priceMatch[1] : 9.99;
            $discount = (int) ($deal['discount'] ?? 0);
            $was = $discount > 0 ? round($priceValue / (1 - ($discount / 100)), 2) : null;
            $sku = $demoSkus[$index % count($demoSkus)];

            $deal['sku'] = $sku;
            $deal['price_value'] = $priceValue;
            $deal['price_label'] = str_contains(strtolower($priceText), 'from') ? 'From' : 'Just';
            $deal['was_price'] = $was;
            $deal['save'] = $was ? round($was - $priceValue, 2) : 0;
            $deal['club_price'] = round($priceValue * 0.85, 2);
            $deal['variant'] = '1 × sale item';
            $deal['blurb'] = 'Sale offer — limited stock while the deal lasts.';
            $deal['description'] = 'Shop '.$deal['name'].' at a reduced sale price. A YouGarden favourite with reliable garden performance.';
            $deal['features'] = [
                ['label' => 'Sale price'],
                ['label' => 'Easy To Grow'],
                ['label' => 'UK delivery'],
            ];
            $deal['popular_views'] = 90 + (($index * 41) % 120);
            $deal['low_stock'] = empty($deal['out_of_stock']) && ($index % 5 === 0);
            $deal['gallery'] = [
                ['image' => $deal['image'], 'alt' => $deal['name']],
                ['image' => 'images/products/401842.jpg', 'alt' => $deal['name'].' — view 2'],
                ['image' => 'images/products/402156.jpg', 'alt' => $deal['name'].' — view 3'],
                ['image' => 'images/products/403891.jpg', 'alt' => $deal['name'].' — view 4'],
                ['image' => 'images/products/404220.jpg', 'alt' => $deal['name'].' — view 5'],
            ];

            return $deal;
        }, $allDeals, array_keys($allDeals));

        return view('demo.sale', [
            'cart' => DemoCart::state(),
            'shop_menu' => DemoArgosNav::shopMenu($yg),
            'trending_links' => DemoArgosNav::trendingLinks($yg),
            'listing' => [
                'products' => $allDeals,
                'filters' => DemoCart::listingFilters(),
                'sort_options' => DemoCart::listingSortOptions(),
            ],
            'all_deals' => $allDeals,
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
                    'url' => route('demo.listing.garden-plants'),
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
