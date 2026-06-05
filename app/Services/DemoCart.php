<?php

namespace App\Services;

use App\Support\DemoDrawerVariant;

class DemoCart
{
    /** SKU used when “Add to basket” is clicked on the demo PDP (yougarden.com item-p-510317) */
    public const PDP_SKU = '510317';

    /** Auto-renewal yearly club membership (yougarden.com item-p-820005) */
    public const CLUB_SKU_AUTO = '820005';

    /** One-year manual renewal membership (demo) */
    public const CLUB_SKU_MANUAL = '820010';

    /** @deprecated Use CLUB_SKU_AUTO */
    public const CLUB_SKU = self::CLUB_SKU_AUTO;

    /** @var list<string> */
    private const EXCLUDED_SKUS = ['500001'];

    public const CLUB_PRICE = 10.00;

    public const CLUB_WAS_PRICE = 20.00;

    public const CLUB_MANUAL_PRICE = 20.00;

    public const CLUB_VOUCHER_VALUE = 33.98;

    /** Demo offer code accepted in the cart drawer prototype */
    public const DEMO_OFFER_CODE = 'TEST';

    /** Demo offer code that applies with no monetary discount (status-only) */
    public const DEMO_OFFER_CODE_STATUS = 'EM0000';

    public const DEMO_OFFER_DISCOUNT = 5.50;

    /** Demo voucher code — TEST (same as offer) or legacy VOUCHER */
    public const DEMO_VOUCHER_CODE = 'VOUCHER';

    public const DEMO_VOUCHER_DISCOUNT = 3.30;

    public static function isValidOfferCode(string $code): bool
    {
        $normalized = strtoupper(trim($code));

        return in_array($normalized, [self::DEMO_OFFER_CODE, self::DEMO_OFFER_CODE_STATUS], true);
    }

    public static function isValidVoucherCode(string $code): bool
    {
        $normalized = strtoupper(trim($code));

        return in_array($normalized, [self::DEMO_OFFER_CODE, self::DEMO_VOUCHER_CODE], true);
    }

    public static function offerCodeDiscount(?string $code): float
    {
        $normalized = strtoupper(trim((string) $code));

        if ($normalized === self::DEMO_OFFER_CODE) {
            return self::DEMO_OFFER_DISCOUNT;
        }

        return 0.0;
    }

    public static function voucherCodeDiscount(?string $code): float
    {
        $normalized = strtoupper(trim((string) $code));

        if ($normalized === self::DEMO_OFFER_CODE) {
            return self::DEMO_OFFER_DISCOUNT;
        }

        if ($normalized === self::DEMO_VOUCHER_CODE) {
            return self::DEMO_VOUCHER_DISCOUNT;
        }

        return 0.0;
    }

    /** @return list<string> */
    public static function clubSkus(): array
    {
        return [self::CLUB_SKU_AUTO, self::CLUB_SKU_MANUAL];
    }

    public const DELIVERY = 6.99;

    public const FREE_DELIVERY_THRESHOLD = 60.00;

    /** Gift progress bar — tier at £50, full gift unlocked at £80 (V2 drawer) */
    public const GIFT_PROGRESS_MILESTONE = 50.00;

    public const GIFT_PROGRESS_MAX = 80.00;

    /** @return array<string, mixed> PDP product shown on the demo product page */
    public static function pdpProduct(): array
    {
        $p = self::catalogue()[self::PDP_SKU];

        return [
            'sku' => $p['sku'],
            'title' => 'Sicilian Lemon Tree',
            'page_title' => "Sicilian Lemon Tree — 1 x 4 Litre Potted",
            'tagline' => 'Fresh Fruit, Fragrant Blossom And Mediterranean Style In A Pot',
            'pack' => '1 x 4 Litre Pot',
            'price' => $p['price'],
            'was_price' => $p['was_price'],
            'save' => round($p['was_price'] - $p['price'], 2),
            'club_price' => $p['club_price'],
            'image' => $p['image'],
            'image_alt' => 'Sicilian Lemon Tree in a 4 litre pot',
            'breadcrumb' => [
                ['label' => 'Home', 'url' => '/'],
                ['label' => 'Fruits and Veg', 'url' => '#'],
                ['label' => 'Citrus Trees And Plants', 'url' => '#'],
                ['label' => 'Sicilian Lemon Tree', 'url' => null],
            ],
            'also_bought' => [
                'sku' => '680019',
                'name' => 'Citrus Orange Tree — 1 x 4L Pot',
                'price' => 24.99,
            ],
            'features' => [
                ['label' => 'Scented / Fragrant', 'icon' => 'scent'],
                ['label' => 'Perfect In Pots', 'icon' => 'pot'],
                ['label' => 'Plant In Sunshine', 'icon' => 'sun'],
                ['label' => 'Protect From Frost', 'icon' => 'hardy'],
                ['label' => 'Edible', 'icon' => 'easy'],
            ],
            'dimensions' => 'Width: 100cm · Height: 200cm',
            'plant_calendar' => [
                'title' => 'Plant calendar',
                'months' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                'seasons' => [
                    [
                        'id' => 'planting',
                        'short' => 'Plant',
                        'label' => 'Planting',
                        'ranges' => [['from' => 3, 'to' => 7]],
                    ],
                    [
                        'id' => 'flowering',
                        'short' => 'Flower',
                        'label' => 'Flowering',
                        'ranges' => [['from' => 2, 'to' => 5]],
                    ],
                    [
                        'id' => 'fruiting',
                        'short' => 'Fruit',
                        'label' => 'Fruiting',
                        'ranges' => [['from' => 0, 'to' => 2], ['from' => 9, 'to' => 11]],
                    ],
                ],
            ],
            'content_sections' => [
                [
                    'id' => 'description',
                    'title' => 'Description',
                    'open' => true,
                    'paragraphs' => [
                        'Pick your very own delicious fresh lemons and add a Mediterranean feel to your home or garden! Packed full of vitamin C, these fruits are not only delicious, but good for you as well! Use your fruits in everything from freshly squeezed lemonade, to scrumptious lemon meringue pies, and save loads of money on supermarket prices!',
                        "This Lemon 'Lunario' tree produces blossom from late spring through to the end of the year. From the blossom, small lemons will be produced, which will quickly swell into ripe and juicy fruits which will ripen for picking late summer up to the end of the year.",
                        "Allow your tree time to establish in its new home and within 12 months you'll grow delicious full-sized fruit!",
                        "To ensure you'll be picking delicious fruit year after year, we advise you keep your trees in their pots, and place in a sunny, sheltered position. Protect from frost during the winter time either by bringing indoors into a conservatory, or by covering with a plant cosy.",
                        'Supplied as an established plant in a 4 litre pot, approximately 70–90cm tall. Please note, this may be supplied with thorns.',
                    ],
                ],
                [
                    'id' => 'top-tips',
                    'title' => 'Top Tips',
                    'bullets' => [
                        'Pick home-grown lemons within 12 months and create a Mediterranean feel in your home or garden.',
                        "Lemon 'Lunario' produces sweet scented flowers from late spring followed by fruits from late summer.",
                        'Best left in a pot so it can be moved around easily. From June to September move your lemon outside — garden, patio or balcony. Lemon trees are not frost tolerant.',
                        'Water freely in summer but reduce watering during winter. Bring indoors for winter in a cool area away from radiators — an unheated conservatory or porch is ideal.',
                        'Supplied as an established plant in a 4 litre pot, approximately 70–90cm tall. Feed with specialist citrus feed during spring and summer.',
                    ],
                ],
                [
                    'id' => 'care',
                    'title' => 'Care Information',
                    'blocks' => [
                        [
                            'bullets' => [
                                'Feed with specialist feed every month in spring and summer growth — they are hungry fellows.',
                                'Sweetly fragrant blossom appears in late spring and can flower sporadically through the year. Fruit ripens up to 12 months later — plants are often in flower and fruiting at the same time.',
                                'Citrus tend not to thrive in centrally heated homes. From mid-June to late September, move plants outside — remember they are not frost tolerant and need cover if cold nights threaten.',
                                'Only minimal pruning is required to reshape or remove dead or damaged shoots.',
                            ],
                        ],
                        [
                            'heading' => 'Watering',
                            'bullets' => [
                                'In summer, water freely — ideally using rainwater. In winter, allow the surface to partially dry out before watering again. Always allow excess water to drain away.',
                                'Our Mediterranean citrus trees are grown in a slightly heavier growing medium — take care when watering. Do not overwater, but do not allow the soil to dry out completely.',
                            ],
                        ],
                    ],
                ],
                [
                    'id' => 'delivery',
                    'title' => 'Delivery Information',
                    'paragraphs' => [
                        'Please allow us 3–5 working days to dispatch your order. Pre-ordered items will be sent as soon as possible after the date quoted and we\'ll generally ship your entire order with your pre-ordered items.',
                        'When your order is dispatched, we\'ll send you another email with details of how to track it. Most orders are sent on a fully-tracked courier service with Yodel. No signature is required — our courier is asked to leave your order in a safe place on your property.',
                        'Smaller, lighter, single-item orders may be sent through the post with Royal Mail — in which case no tracking is available.',
                        'Our nursery team sends plants nursery fresh in the perfect condition to thrive. We avoid dispatching the most perishable plants if extreme weather is forecast, or over Bank Holiday weekends.',
                        'Please note, we cannot guarantee delivery on a certain day or time. Delivery to outlying postcode areas may take 1–2 days longer.',
                    ],
                ],
                [
                    'id' => 'reviews',
                    'title' => 'Reviews',
                    'paragraphs' => [
                        'See Feefo customer ratings and recent reviews for this product below.',
                    ],
                ],
                [
                    'id' => 'videos',
                    'title' => 'Videos',
                    'placeholder' => 'Product videos and growing guides will appear here on the live site.',
                ],
            ],
            'feefo' => [
                'rating' => 4.3,
                'max_rating' => 5,
                'review_count' => 18850,
                'reviews' => [
                    [
                        'rating' => 5,
                        'title' => 'Excellent quality',
                        'text' => 'Tree arrived well packed and already had healthy glossy leaves. Very pleased with the size for a 4 litre pot.',
                        'author' => 'Trusted Customer',
                        'date' => '1 August 2024',
                    ],
                    [
                        'rating' => 5,
                        'title' => 'Great little lemon tree',
                        'text' => 'Bought for the patio — flowers smelled amazing this summer and we picked our first lemon in autumn.',
                        'author' => 'Trusted Customer',
                        'date' => '12 October 2024',
                    ],
                    [
                        'rating' => 4,
                        'title' => 'Good value',
                        'text' => 'Nice plant, delivery was quick. Waiting for more fruit next year but blossom was lovely.',
                        'author' => 'Trusted Customer',
                        'date' => '3 March 2025',
                    ],
                    [
                        'rating' => 5,
                        'title' => 'Would recommend',
                        'text' => 'Helpful instructions included. Overwintered in the conservatory with no problems.',
                        'author' => 'Trusted Customer',
                        'date' => '18 January 2025',
                    ],
                ],
            ],
            'footer' => [
                'columns' => [
                    [
                        'title' => 'Help',
                        'links' => [
                            ['label' => 'Customer Services', 'url' => '#'],
                            ['label' => 'Delivery', 'url' => '#'],
                            ['label' => 'Track Order', 'url' => '#'],
                            ['label' => 'Lifetime Guarantee', 'url' => '#'],
                            ['label' => 'Contact Us', 'url' => '#'],
                            ['label' => 'Catalogue Request', 'url' => '#'],
                            ['label' => 'Fast Order', 'url' => '#'],
                            ['label' => 'Join The Team', 'url' => '#'],
                        ],
                    ],
                    [
                        'title' => 'Garden Advice',
                        'links' => [
                            ['label' => 'Jobs To Do This Month', 'url' => '#'],
                            ['label' => 'Plant Care Instructions', 'url' => '#'],
                            ['label' => 'Plant Finder', 'url' => '#'],
                            ['label' => 'Affiliate Programme', 'url' => '#'],
                            ['label' => 'Refer A Friend', 'url' => '#'],
                            ['label' => 'Videos', 'url' => '#'],
                            ['label' => 'Blog', 'url' => '#'],
                        ],
                    ],
                    [
                        'title' => 'Shopping',
                        'links' => [
                            ['label' => 'eGift Vouchers', 'url' => '#'],
                            ['label' => 'About Us', 'url' => '#'],
                            ['label' => 'Terms & Conditions', 'url' => '#'],
                            ['label' => 'Privacy Policy', 'url' => '#'],
                            ['label' => 'Cookie Policy', 'url' => '#'],
                            ['label' => 'Modern Slavery Policy', 'url' => '#'],
                            ['label' => 'YouGarden Reviews', 'url' => '#'],
                            ['label' => 'Sitemap', 'url' => '#'],
                        ],
                    ],
                ],
                'legal' => [
                    'Registered Company Name: YouGarden. Registered Company Address: Eventus House, Sunderland Road, Market Deeping, Peterborough, PE6 8FD.',
                    'Registered Company Number: 07864712. Registered in England & Wales.',
                    'YouGarden is a Shopping @ Home Limited Company.',
                ],
            ],
        ];
    }

    /** @return array<string, mixed> PDP footer columns for sitewide shell */
    public static function siteFooter(): array
    {
        return self::pdpProduct()['footer'];
    }

    /** @return array<string, mixed> Perennial listing page (matches yougarden.com category grid) */
    /** @return list<array<string, mixed>> */
    private static function listingProducts(): array
    {
        $images = [
            'images/products/401842.jpg',
            'images/products/402156.jpg',
            'images/products/403891.jpg',
            'images/products/404220.jpg',
            'images/products/510317.png',
        ];

        $products = [
            [
                'name' => "Hardy Gerbera 'Garvinea' Bright Collection",
                'price_label' => 'Just',
                'price' => 19.99,
                'discount' => 58,
                'reviews' => 325,
                'rating' => 4.8,
            ],
            [
                'name' => 'Summer Flowering Fuchsia Collection',
                'price_label' => 'Just',
                'price' => 14.99,
                'discount' => 50,
                'reviews' => 797,
                'rating' => 4.7,
            ],
            [
                'name' => 'Hardy Mini Tree Daffodil Collection',
                'price_label' => 'Just',
                'price' => 24.99,
                'discount' => 58,
                'reviews' => 544,
                'rating' => 4.9,
            ],
            [
                'name' => 'Black Lace Elderberry Collection',
                'price_label' => 'From',
                'price' => 9.99,
                'discount' => 20,
                'reviews' => 77,
                'rating' => 4.5,
            ],
            [
                'name' => 'Complete Hardy Garden Perennial Collection',
                'price_label' => 'Just',
                'price' => 29.99,
                'discount' => 58,
                'reviews' => 449,
                'rating' => 4.3,
                'featured' => true,
            ],
            [
                'name' => 'Hardy Carefree Lavender Collection',
                'price_label' => 'Just',
                'price' => 9.99,
                'discount' => 58,
                'reviews' => 315,
                'rating' => 4.6,
            ],
            [
                'name' => 'Brilliant Buddleia Collection',
                'price_label' => 'From',
                'price' => 24.99,
                'discount' => 50,
                'reviews' => 292,
                'rating' => 4.4,
            ],
            [
                'name' => 'Buddleia Sungold Showers Collection',
                'price_label' => 'From',
                'price' => 24.99,
                'discount' => 50,
                'reviews' => 154,
                'rating' => 4.2,
            ],
            [
                'name' => 'Hardy Fragrant Lily Collection',
                'price_label' => 'From',
                'price' => 19.99,
                'discount' => 50,
                'reviews' => 199,
                'rating' => 4.7,
            ],
            [
                'name' => 'Clematis Collection',
                'price_label' => 'Just',
                'price' => 9.99,
                'discount' => 98,
                'reviews' => 587,
                'rating' => 4.8,
            ],
        ];

        return array_map(function (array $product, int $index) use ($images) {
            $product['image'] = $images[$index % count($images)];
            $product['url'] = route('demo.pdp');

            return $product;
        }, $products, array_keys($products));
    }

    /** @return list<array{id: string, label: string, options: array<string, string>}> */
    public static function listingFilters(): array
    {
        $filter = static function (string $id, string $label, array $options): array {
            return [
                'id' => $id,
                'label' => $label,
                'options' => ['' => $label] + $options,
            ];
        };

        return [
            $filter('awards', 'Awards', [
                'rhs-agm' => 'RHS Award of Garden Merit',
                'perfect-for-pollinators' => 'Perfect for Pollinators',
            ]),
            $filter('features', 'Features', [
                'fragrant' => 'Fragrant',
                'evergreen' => 'Evergreen',
                'wildlife-friendly' => 'Wildlife Friendly',
            ]),
            $filter('planting_time', 'Planting Time', [
                'spring' => 'Spring',
                'summer' => 'Summer',
                'autumn' => 'Autumn',
            ]),
            $filter('blooming_time', 'Blooming Time', [
                'spring' => 'Spring',
                'summer' => 'Summer',
                'autumn' => 'Autumn',
            ]),
            $filter('fruiting_time', 'Fruiting Time', [
                'summer' => 'Summer',
                'autumn' => 'Autumn',
            ]),
            $filter('planting_position', 'Planting Position', [
                'full-sun' => 'Full Sun',
                'partial-shade' => 'Partial Shade',
                'shade' => 'Shade',
            ]),
            $filter('colours', 'Colours', [
                'pink' => 'Pink',
                'purple' => 'Purple',
                'white' => 'White',
                'yellow' => 'Yellow',
            ]),
        ];
    }

    /** @return list<array{value: string, label: string}> */
    public static function listingSortOptions(): array
    {
        return [
            ['value' => 'popularity', 'label' => 'Popularity'],
            ['value' => 'name-asc', 'label' => 'Name A-Z'],
            ['value' => 'name-desc', 'label' => 'Name Z-A'],
            ['value' => 'price-asc', 'label' => 'Price: Low - High'],
            ['value' => 'price-desc', 'label' => 'Price: High - Low'],
        ];
    }

    public static function listingPage(): array
    {
        return [
            'title' => 'Perennial Plants & Flowers',
            'breadcrumb' => [
                ['label' => 'Home', 'url' => route('demo.pdp')],
                ['label' => 'Garden Plants', 'url' => route('demo.listing.perennials')],
                ['label' => 'Perennial Plants & Flowers', 'url' => null],
            ],
            'filters' => self::listingFilters(),
            'sort_options' => self::listingSortOptions(),
            'products' => self::listingProducts(),
        ];
    }

    public static function catalogue(): array
    {
        return [
            '401842' => [
                'sku' => '401842',
                'name' => "Upright Zonal Geranium 'Parade' Mix",
                'variant' => '12 x plug plants',
                'image' => 'images/products/401842.jpg',
                'price' => 9.99,
                'was_price' => null,
                'club_saving_per_unit' => 1.50,
            ],
            '402156' => [
                'sku' => '402156',
                'name' => "Eryngium 'Blue Hobbit'",
                'variant' => '1 x 9cm potted plant',
                'image' => 'images/products/402156.jpg',
                'price' => 14.97,
                'was_price' => 29.97,
                'club_saving_per_unit' => 5.25,
            ],
            '403891' => [
                'sku' => '403891',
                'name' => "Imperata 'Red Baron' - Blood Grass",
                'variant' => '1 x 2 Litre Pot',
                'image' => 'images/products/403891.jpg',
                'price' => 14.97,
                'was_price' => 29.97,
                'club_saving_per_unit' => 2.25,
            ],
            '510317' => [
                'sku' => '510317',
                'name' => 'Sicilian Lemon Tree',
                'variant' => '1 x 4 Litre Pot',
                'image' => 'images/products/510317.png',
                'price' => 24.99,
                'was_price' => 39.99,
                'club_price' => 21.24,
                'club_saving_per_unit' => 3.75,
            ],
            '404220' => [
                'sku' => '404220',
                'name' => "Pre-Planted 'Summer Sensation' Hanging Baskets",
                'variant' => '1 x 35cm basket',
                'image' => 'images/products/404220.jpg',
                'price' => 24.98,
                'was_price' => 39.98,
                'club_price' => 21.23,
                'club_saving_per_unit' => 3.75,
            ],
            '404221' => [
                'sku' => '404221',
                'name' => 'Premium Professional Compost',
                'variant' => '2 x 50 Litre Bags',
                'image' => 'images/products/404220.jpg',
                'price' => 24.98,
                'was_price' => 42.97,
                'club_price' => 21.23,
                'club_saving_per_unit' => 3.75,
            ],
            '501001' => [
                'sku' => '501001',
                'name' => 'Blooming Fast Superior Soluble Plant Food',
                'variant' => '800g tub',
                'image' => 'images/products/401842.jpg',
                'price' => 4.99,
                'was_price' => null,
                'club_price' => 4.24,
                'club_saving_per_unit' => 0.75,
            ],
            '501002' => [
                'sku' => '501002',
                'name' => 'Rootgrow Mycorrhizal Fungi',
                'variant' => '360g pouch',
                'image' => 'images/products/402156.jpg',
                'price' => 3.99,
                'was_price' => null,
                'club_price' => 3.39,
                'club_saving_per_unit' => 0.60,
            ],
            '501003' => [
                'sku' => '501003',
                'name' => 'Bulb Starter Fertiliser with rootgrow',
                'variant' => '1 x 1kg tub',
                'image' => 'images/products/403891.jpg',
                'price' => 9.99,
                'was_price' => null,
                'club_price' => 8.49,
                'club_saving_per_unit' => 1.50,
            ],
            '501004' => [
                'sku' => '501004',
                'name' => 'Enriched Multi-Purpose Compost',
                'variant' => '40L bag',
                'image' => 'images/products/404220.jpg',
                'price' => 7.99,
                'was_price' => null,
                'club_price' => 6.79,
                'club_saving_per_unit' => 1.20,
            ],
            '501005' => [
                'sku' => '501005',
                'name' => 'Organic Seaweed Feed',
                'variant' => '1L concentrate',
                'image' => 'images/products/404220.jpg',
                'price' => 6.49,
                'was_price' => null,
                'club_price' => 5.52,
                'club_saving_per_unit' => 0.97,
            ],
            '501006' => [
                'sku' => '501006',
                'name' => "Lilac 'Palibin' Tree Feed",
                'variant' => '500g tub',
                'image' => 'images/products/510317.png',
                'price' => 5.99,
                'was_price' => null,
                'club_price' => 5.09,
                'club_saving_per_unit' => 0.90,
            ],
            '501007' => [
                'sku' => '501007',
                'name' => 'Bulb Planter Tool',
                'image' => 'images/products/403891.jpg',
                'price' => 9.49,
                'was_price' => null,
                'club_price' => 8.07,
                'club_saving_per_unit' => 1.42,
            ],
            self::CLUB_SKU_AUTO => [
                'sku' => self::CLUB_SKU_AUTO,
                'name' => 'YG Discount Club Yearly Subscription Membership',
                'variant' => 'Auto renewal',
                'image' => 'images/club/discount-club-logo.png',
                'price' => self::CLUB_PRICE,
                'was_price' => self::CLUB_WAS_PRICE,
                'is_club' => true,
            ],
            self::CLUB_SKU_MANUAL => [
                'sku' => self::CLUB_SKU_MANUAL,
                'name' => 'YG Discount Club One Year Membership',
                'variant' => '1 year',
                'image' => 'images/club/discount-club-logo.png',
                'price' => self::CLUB_MANUAL_PRICE,
                'was_price' => null,
                'is_club' => true,
            ],
        ];
    }

    public static function hasClubInCart(): bool
    {
        self::seed();

        foreach (session('demo_cart_items', []) as $row) {
            if (in_array($row['sku'], self::clubSkus(), true)) {
                return true;
            }
        }

        return false;
    }

    public static function syncClubInCartFlag(): void
    {
        session(['demo_club_in_cart' => self::hasClubInCart()]);
    }

    public static function seed(): void
    {
        if (session()->has('demo_cart_items')) {
            return;
        }

        session([
            'demo_cart_items' => [
                ['sku' => '401842', 'qty' => 1],
                ['sku' => '402156', 'qty' => 1],
                ['sku' => '403891', 'qty' => 1],
                ['sku' => '404220', 'qty' => 4],
                ['sku' => '404221', 'qty' => 1],
            ],
            'demo_offer_code' => null,
            'demo_voucher_code' => null,
            'demo_club_member' => false,
            'demo_club_in_cart' => false,
            'demo_drawer_enabled' => true,
            'demo_free_delivery_bar' => false,
            'demo_show_upsells' => true,
            'demo_wide_drawer' => false,
            'demo_show_apple_pay' => false,
        ]);

        DemoDrawerVariant::setEnabled(true);
        DemoDrawerVariant::setV30Enabled(true);
    }

    /** @return list<array{sku: string, name: string, image: string, price: float, from?: bool, in_basket?: bool}> */
    public static function upsellProducts(): array
    {
        return [
            [
                'sku' => '501001',
                'name' => 'Blooming Fast Superior Soluble Plant Food',
                'variant' => '800g tub',
                'image' => 'images/products/401842.jpg',
                'price' => 4.99,
                'from' => true,
            ],
            [
                'sku' => '501002',
                'name' => 'Rootgrow Mycorrhizal Fungi',
                'variant' => '360g pouch',
                'image' => 'images/products/402156.jpg',
                'price' => 3.99,
                'from' => true,
            ],
            [
                'sku' => '501003',
                'name' => 'Bulb Starter Fertiliser with rootgrow',
                'variant' => '1 x 1kg tub',
                'image' => 'images/products/403891.jpg',
                'price' => 9.99,
                'from' => true,
            ],
            [
                'sku' => '402156',
                'name' => "Eryngium 'Blue Hobbit'",
                'image' => 'images/products/402156.jpg',
                'price' => 14.97,
            ],
            [
                'sku' => '501004',
                'name' => 'Enriched Multi-Purpose Compost',
                'variant' => '40L bag',
                'image' => 'images/products/404220.jpg',
                'price' => 7.99,
                'from' => true,
            ],
            [
                'sku' => '501005',
                'name' => 'Organic Seaweed Feed',
                'variant' => '1L concentrate',
                'image' => 'images/products/404220.jpg',
                'price' => 6.49,
                'from' => true,
            ],
            [
                'sku' => '501006',
                'name' => "Lilac 'Palibin' Tree Feed",
                'variant' => '500g tub',
                'image' => 'images/products/510317.png',
                'price' => 5.99,
                'from' => true,
            ],
            [
                'sku' => '501007',
                'name' => 'Bulb Planter Tool',
                'image' => 'images/products/403891.jpg',
                'price' => 9.49,
            ],
        ];
    }

    /** @return list<array{sku: string, name: string, image: string, price: float, from?: bool, in_basket: bool}> */
    public static function upsellsForDrawer(): array
    {
        $inCart = collect(session('demo_cart_items', []))->pluck('sku')->flip();

        return array_map(function (array $upsell) use ($inCart) {
            $upsell['in_basket'] = $inCart->has($upsell['sku']);

            return $upsell;
        }, self::upsellProducts());
    }

    /**
     * Post-purchase recommendations (exclude items already in the completed order).
     *
     * @param  list<array{sku?: string}>  $orderItems
     * @return list<array{sku: string, name: string, image: string, price: float, variant?: string, from?: bool}>
     */
    public static function recommendationsForPostPurchase(array $orderItems): array
    {
        $orderedSkus = collect($orderItems)->pluck('sku')->filter()->flip();

        return array_values(array_slice(array_values(array_filter(
            self::upsellProducts(),
            fn (array $product) => ! $orderedSkus->has($product['sku']),
        )), 0, 4));
    }

    /** @return list<array{sku: string, qty: int, variant?: string}> */
    public static function cartLineItems(): array
    {
        $raw = session('demo_cart_items', []);

        if (! is_array($raw)) {
            return [];
        }

        return array_values(array_filter($raw, function ($row) {
            return is_array($row)
                && isset($row['sku'])
                && is_string($row['sku'])
                && $row['sku'] !== ''
                && isset($row['qty'])
                && (int) $row['qty'] > 0;
        }));
    }

    /** @param  list<array{sku: string, qty: int, variant?: string}>  $items */
    public static function setCartLineItems(array $items): void
    {
        session(['demo_cart_items' => array_values($items)]);
        self::syncClubInCartFlag();
    }

    public static function addItem(string $sku, int $qty = 1, ?string $variant = null): void
    {
        self::seed();

        $product = self::catalogue()[$sku] ?? null;
        if (! $product) {
            return;
        }

        $qty = max(1, $qty);
        $variant = trim((string) ($variant ?? $product['variant'] ?? '')) ?: null;
        $items = self::cartLineItems();
        $found = false;

        foreach ($items as $index => $row) {
            if ($row['sku'] === $sku) {
                $items[$index]['qty'] = (int) $row['qty'] + $qty;
                if ($variant && empty($items[$index]['variant'])) {
                    $items[$index]['variant'] = $variant;
                }
                $found = true;
                break;
            }
        }

        if (! $found) {
            $line = ['sku' => $sku, 'qty' => $qty];
            if ($variant) {
                $line['variant'] = $variant;
            }
            $items[] = $line;
        }

        self::setCartLineItems($items);
    }

    public static function addClubMembership(string $sku): void
    {
        self::seed();

        $existingSkus = collect(self::cartLineItems())->pluck('sku')->all();

        self::addItem($sku, 1);

        $afterSkus = collect(self::cartLineItems())->pluck('sku')->all();

        foreach ($existingSkus as $existingSku) {
            if (! in_array($existingSku, $afterSkus, true)) {
                throw new \RuntimeException('Adding club membership removed existing basket lines.');
            }
        }
    }

    /** Pack / size label for a basket line (session override or catalogue default). */
    public static function lineVariant(array $row, array $product): ?string
    {
        $variant = trim((string) ($row['variant'] ?? $product['variant'] ?? ''));

        return $variant !== '' ? $variant : null;
    }

    public static function purgeExcludedItems(): void
    {
        $items = collect(session('demo_cart_items', []))
            ->reject(fn ($row) => in_array($row['sku'], self::EXCLUDED_SKUS, true))
            ->values()
            ->all();

        session(['demo_cart_items' => $items]);
        self::syncClubInCartFlag();
    }

    /**
     * Extra club-member saving per unit (on top of the price already in the basket).
     *
     * @param  array<string, mixed>  $product
     */
    public static function productClubSavingPerUnit(array $product): float
    {
        if (! empty($product['is_club'])) {
            return 0.0;
        }

        if (isset($product['club_saving_per_unit']) && (float) $product['club_saving_per_unit'] > 0) {
            return (float) $product['club_saving_per_unit'];
        }

        $price = (float) ($product['price'] ?? 0);
        $clubPrice = $product['club_price'] ?? null;

        if ($clubPrice !== null && $price > (float) $clubPrice) {
            return round($price - (float) $clubPrice, 2);
        }

        return 0.0;
    }

    /**
     * Unit price charged when club membership is active (member pricing on catalogue lines).
     *
     * @param  array<string, mixed>  $product
     */
    public static function unitPriceForCart(array $product, bool $clubActive): float
    {
        $price = (float) ($product['price'] ?? 0);

        if (! $clubActive || ! empty($product['is_club'])) {
            return $price;
        }

        $clubPrice = $product['club_price'] ?? null;

        if ($clubPrice !== null && (float) $clubPrice < $price) {
            return (float) $clubPrice;
        }

        return $price;
    }

    public static function potentialClubSavings(): float
    {
        self::seed();

        $catalogue = self::catalogue();
        $total = 0.0;

        foreach (session('demo_cart_items', []) as $row) {
            $product = $catalogue[$row['sku']] ?? null;
            if (! $product) {
                continue;
            }
            $perUnit = self::productClubSavingPerUnit($product);
            if ($perUnit > 0) {
                $total += $perUnit * $row['qty'];
            }
        }

        return round($total, 2);
    }

    public static function state(): array
    {
        self::seed();
        self::purgeExcludedItems();
        self::syncClubInCartFlag();

        $catalogue = self::catalogue();
        $clubInCart = self::hasClubInCart();
        $clubActive = $clubInCart || (bool) session('demo_club_member');
        $items = [];
        $subtotal = 0.0;
        $wasTotal = 0.0;
        $clubMemberSavings = 0.0;

        foreach (session('demo_cart_items', []) as $row) {
            $product = $catalogue[$row['sku']] ?? null;
            if (! $product) {
                continue;
            }
            $unitPrice = self::unitPriceForCart($product, $clubActive);
            $line = round($unitPrice * $row['qty'], 2);
            $lineWas = ($product['was_price'] ?? $product['price']) * $row['qty'];
            $lineClubSaving = 0.0;

            if ($clubActive) {
                if (! empty($product['is_club']) && ($product['was_price'] ?? null) !== null) {
                    $lineClubSaving = round(($product['was_price'] - $product['price']) * $row['qty'], 2);
                } elseif (empty($product['is_club']) && $unitPrice < (float) $product['price']) {
                    $lineClubSaving = round(((float) $product['price'] - $unitPrice) * $row['qty'], 2);
                    $clubMemberSavings += $lineClubSaving;
                }
            }

            $items[] = array_merge($product, [
                'qty' => $row['qty'],
                'variant' => self::lineVariant($row, $product),
                'line_total' => $line,
                'club_saving' => $lineClubSaving,
            ]);
            $subtotal += $line;
            $wasTotal += $lineWas;
        }

        $itemCount = array_sum(array_column(session('demo_cart_items', []), 'qty'));
        $savingsFromWas = max(0, round($wasTotal - $subtotal, 2));
        $potentialClubSavings = self::potentialClubSavings();

        $offerCode = session('demo_offer_code');
        if ($offerCode && ! self::isValidOfferCode($offerCode)) {
            session(['demo_offer_code' => null]);
            $offerCode = null;
        }

        $voucherCode = session('demo_voucher_code');
        if ($voucherCode && ! self::isValidVoucherCode($voucherCode)) {
            session(['demo_voucher_code' => null]);
            $voucherCode = null;
        }

        $offerDiscount = self::offerCodeDiscount($offerCode);
        $voucherDiscount = self::voucherCodeDiscount($voucherCode);
        $delivery = self::DELIVERY;
        // Basket drawer total should exclude delivery (delivery is chosen/confirmed at checkout)
        $basketTotal = round(max(0, $subtotal - $offerDiscount), 2);
        $total = round(max(0, $subtotal + $delivery - $offerDiscount - $voucherDiscount), 2);
        $yourSavings = round($savingsFromWas + ($clubActive ? $clubMemberSavings : 0), 2);

        $giftMax = self::GIFT_PROGRESS_MAX;
        $giftMilestone = self::GIFT_PROGRESS_MILESTONE;
        $giftSpendMore = max(0, round($giftMax - $subtotal, 2));
        $giftProgress = min(100, $giftMax > 0 ? ($subtotal / $giftMax) * 100 : 100);
        $giftMilestonePercent = $giftMax > 0 ? ($giftMilestone / $giftMax) * 100 : 50;

        return [
            'items' => $items,
            'is_empty' => count($items) === 0,
            'item_count' => $itemCount,
            'subtotal' => round($subtotal, 2),
            'your_savings' => $yourSavings,
            'savings_from_was' => $savingsFromWas,
            'delivery' => round($delivery, 2),
            'basket_total' => $basketTotal,
            'total' => $total,
            'offer_code' => $offerCode,
            'offer_discount' => $offerDiscount,
            'voucher_code' => $voucherCode,
            'voucher_discount' => $voucherDiscount,
            'club_member' => (bool) session('demo_club_member'),
            'club_in_cart' => $clubInCart,
            'club_savings' => $potentialClubSavings,
            'club_member_savings' => round($clubMemberSavings, 2),
            'club_price' => self::CLUB_PRICE,
            'club_was_price' => self::CLUB_WAS_PRICE,
            'club_manual_price' => self::CLUB_MANUAL_PRICE,
            'drawer_enabled' => (bool) session('demo_drawer_enabled', true),
            'is_desktop' => request()->boolean('desktop') || ! request()->header('X-Mobile'),
            'gift_progress_max' => $giftMax,
            'gift_progress_milestone' => $giftMilestone,
            'gift_progress_percent' => round($giftProgress, 2),
            'gift_milestone_percent' => round($giftMilestonePercent, 2),
            'gift_spend_more' => $giftSpendMore,
            'gift_qualified' => $giftSpendMore <= 0,
            'gift_milestone_reached' => $subtotal >= $giftMilestone,
            'show_free_delivery_bar' => (bool) session('demo_free_delivery_bar', false),
            'show_upsells' => (bool) session('demo_show_upsells', false),
            'wide_drawer' => (bool) session('demo_wide_drawer', false),
            'show_apple_pay' => (bool) session('demo_show_apple_pay', false),
            'compact_v21' => DemoDrawerVariant::isActive(),
            'summary_v30' => DemoDrawerVariant::isV30Active(),
            'upsells' => self::upsellsForDrawer(),
        ];
    }

    /**
     * Simulate checkout completion: snapshot basket, clear cart, store receipt in session.
     *
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    public static function placeOrder(array $input): array
    {
        $cart = self::state();

        if ($cart['is_empty']) {
            throw new \InvalidArgumentException('Cart is empty.');
        }

        $countries = config('countries', []);
        $sameAsBilling = filter_var($input['delivery_same_as_billing'] ?? true, FILTER_VALIDATE_BOOLEAN);
        $prefix = $sameAsBilling ? 'billing' : 'delivery';

        $region = (string) ($input[$prefix.'_region'] ?? $input['billing_region'] ?? $input['region'] ?? 'GB');
        $countryName = $countries[$region] ?? $region;

        $firstName = trim((string) ($input[$prefix.'_first_name'] ?? $input['billing_first_name'] ?? $input['first_name'] ?? '')) ?: 'Guest';
        $lastName = trim((string) ($input[$prefix.'_last_name'] ?? $input['billing_last_name'] ?? $input['last_name'] ?? ''));
        $customerName = trim($firstName.' '.$lastName);

        $address1 = trim((string) ($input[$prefix.'_address1'] ?? $input['billing_address1'] ?? $input['address1'] ?? '')) ?: '12 Garden Lane';
        $address2 = trim((string) ($input[$prefix.'_address2'] ?? $input['billing_address2'] ?? $input['address2'] ?? ''));
        $city = trim((string) ($input[$prefix.'_city'] ?? $input['billing_city'] ?? $input['city'] ?? '')) ?: 'Peterborough';
        $postcode = trim((string) ($input[$prefix.'_postcode'] ?? $input['billing_postcode'] ?? $input['postcode'] ?? '')) ?: 'PE6 8FD';
        $phone = trim((string) ($input[$prefix.'_phone'] ?? $input['billing_phone'] ?? $input['phone'] ?? '')) ?: '01733 000000';

        $cardNumber = preg_replace('/\D/', '', (string) ($input['card_number'] ?? ''));
        $last4 = strlen($cardNumber) >= 4 ? substr($cardNumber, -4) : '4242';
        $paymentMethod = (string) ($input['payment_method'] ?? 'card');

        $paymentSummary = match ($paymentMethod) {
            'paypal' => 'PayPal',
            'clearpay' => 'Clearpay',
            'klarna' => 'Klarna',
            default => ((str_starts_with($cardNumber, '5') ? 'Mastercard' : 'Visa')).' ending in '.$last4,
        };

        $codeDiscount = (float) ($cart['offer_discount'] ?? 0) + (float) ($cart['voucher_discount'] ?? 0);
        $taxEstimate = round(max(0, $cart['subtotal'] * 0.2 / 1.2), 2);

        $order = [
            'number' => 'YG'.random_int(100000, 999999),
            'confirmation' => strtoupper(substr(bin2hex(random_bytes(5)), 0, 10)),
            'placed_at' => now(),
            'email' => trim((string) ($input['email'] ?? '')) ?: 'cs@yougarden.com',
            'first_name' => $firstName,
            'last_name' => $lastName,
            'customer_name' => $customerName,
            'phone' => $phone,
            'shipping_method' => 'Standard delivery',
            'shipping_cost' => $cart['delivery'],
            'payment_method' => $paymentMethod,
            'payment_summary' => $paymentSummary,
            'shipping_address' => [
                'name' => $customerName,
                'line1' => $address1,
                'line2' => $address2,
                'city' => $city,
                'postcode' => $postcode,
                'region' => $region,
                'country' => $countryName,
            ],
            'items' => $cart['items'],
            'item_count' => $cart['item_count'],
            'subtotal' => $cart['subtotal'],
            'your_savings' => $cart['your_savings'],
            'offer_code' => $cart['offer_code'],
            'offer_discount' => $cart['offer_discount'],
            'voucher_code' => $cart['voucher_code'],
            'voucher_discount' => $cart['voucher_discount'],
            'code_discount' => $codeDiscount,
            'delivery' => $cart['delivery'],
            'total' => $cart['total'],
            'tax_estimate' => $taxEstimate,
            'club_member' => $cart['club_member'],
            'club_in_cart' => $cart['club_in_cart'],
        ];

        session(['demo_last_order' => $order]);
        session([
            'demo_cart_items' => [],
            'demo_offer_code' => null,
            'demo_voucher_code' => null,
        ]);

        return $order;
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function lastOrder(): ?array
    {
        $order = session('demo_last_order');

        return is_array($order) ? $order : null;
    }
}
