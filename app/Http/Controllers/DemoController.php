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
                    'url' => route('demo.sale'),
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

        return view('demo.sale', [
            'cart' => DemoCart::state(),
            'shop_menu' => $this->argosShopMenu($yg),
            'trending_links' => [
                ['label' => 'Popular Garden Plants', 'url' => $yg.'/garden-plants/popular-garden-plants'],
                ['label' => 'Oleander Plants', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/oleander-plants'],
                ['label' => 'Autumn Bedding', 'url' => $yg.'/garden-plants/bedding-plants/autumn-bedding-plants'],
                ['label' => 'Citrus Trees', 'url' => $yg.'/trees-and-shrubs/mediterranean-plants-for-uk-gardens/citrus-trees-and-plants'],
                ['label' => 'Drought Tolerant Plants', 'url' => $yg.'/garden-plants/popular-garden-plants/drought-tolerant-plants'],
            ],
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

        return [
            [
                'title' => 'Garden Plants',
                'url' => $yg.'/garden-plants',
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
                        'url' => $yg.'/garden-plants/perennial-plants-and-flowers',
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
                            ['label' => 'View All Perennial Plants & Flowers', 'url' => $yg.'/garden-plants/perennial-plants-and-flowers'],
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
    }
}
