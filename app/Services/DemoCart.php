<?php

namespace App\Services;

use App\Support\DemoDrawerVariant;

class DemoCart
{
    /** SKU used when “Add to basket” is clicked on the demo PDP (yougarden.com item-s-pa255) */
    public const PDP_SKU = 'PA255';

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

    /** Gift / postage vouchers are typically 10- or 16-digit numbers. */
    public static function looksLikeGiftVoucher(string $code): bool
    {
        $digits = preg_replace('/\D/', '', trim($code));

        return strlen($digits) === 10 || strlen($digits) === 16;
    }

    /** Club £5 vouchers and postage codes are alphanumeric, often 9–16 characters. */
    public static function looksLikeClubVoucher(string $code): bool
    {
        $normalized = strtoupper(preg_replace('/\s+/', '', trim($code)));

        if ($normalized === '') {
            return false;
        }

        if (str_starts_with($normalized, 'PP')) {
            return true;
        }

        $length = strlen($normalized);

        return $length >= 9
            && $length <= 16
            && preg_match('/^[A-Z0-9]+$/', $normalized) === 1;
    }

    /** Basket accepts offer codes only — anything else belongs at checkout. */
    public static function isVoucherOnlyCode(string $code): bool
    {
        if (self::isValidOfferCode($code)) {
            return false;
        }

        $normalized = strtoupper(trim($code));

        if ($normalized === self::DEMO_VOUCHER_CODE) {
            return true;
        }

        if (self::looksLikeGiftVoucher($code)) {
            return true;
        }

        if (self::isValidVoucherCode($code)) {
            return true;
        }

        return self::looksLikeClubVoucher($code);
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
            'title' => "Petunia 'Easy Wave' Ultimate Mix",
            'page_title' => "Petunia 'Easy Wave' Ultimate Mix",
            'tagline' => 'A vibrant mix of blooms that create a dynamic and cheerful display throughout the summer.',
            'pack' => '5 x Garden Ready Plants',
            'price' => $p['price'],
            'was_price' => $p['was_price'],
            'save' => 0,
            'club_price' => $p['club_price'],
            'rating' => 4.5,
            'reviews' => 82,
            'image' => $p['image'],
            'image_alt' => "Petunia 'Easy Wave' Ultimate Mix in a hanging basket",
            'breadcrumb' => [
                ['label' => 'Home', 'url' => route('demo.pdp'), 'icon' => true],
                ['label' => 'Bestsellers', 'url' => route('demo.listing.perennials')],
                ['label' => 'Petunia Easy Wave Mix', 'url' => null],
            ],
            'also_bought' => [
                'sku' => '401842',
                'name' => "Upright Zonal Geranium 'Parade' Mix",
                'price' => 9.99,
            ],
            'features' => [
                ['label' => 'Perfect In Pots', 'icon' => 'pot'],
                ['label' => 'Plant In Sunshine', 'icon' => 'sun'],
                ['label' => 'Protect From Frost', 'icon' => 'frost'],
                ['label' => 'Easy To Grow', 'icon' => 'easy'],
                ['label' => 'Wildlife Friendly', 'icon' => 'wildlife'],
            ],
            'dimensions' => null,
            'category_label' => 'Bedding Plants',
            'bestseller' => false,
            'popular_views' => 144,
            'in_stock' => true,
            'description_excerpt' => 'A vibrant mix of blooms that create a dynamic and cheerful display throughout the summer. These easy wave petunias are perfect for hanging baskets, containers and borders, delivering masses of colour with minimal effort.',
            'gallery' => [
                ['image' => 'images/products/404220.jpg', 'alt' => "Petunia 'Easy Wave' Ultimate Mix hanging basket"],
                ['image' => 'images/products/401842.jpg', 'alt' => 'Close-up of colourful petunia blooms'],
                ['image' => 'images/products/402156.jpg', 'alt' => 'Petunias on a sunny patio'],
                ['image' => 'images/products/403891.jpg', 'alt' => 'Mixed petunias in a container'],
                ['image' => 'images/products/404220.jpg', 'alt' => 'Growing guide video', 'type' => 'video'],
            ],
            'variants' => [
                [
                    'id' => '5pack',
                    'label' => '5 x Garden Ready Plants',
                    'sku' => 'PA255',
                    'price' => 6.99,
                    'was_price' => null,
                    'default' => true,
                ],
                [
                    'id' => '10pack',
                    'label' => '10 x Garden Ready Plants',
                    'sku' => 'PA256',
                    'price' => 12.99,
                    'was_price' => null,
                    'default' => false,
                ],
                [
                    'id' => 'basket',
                    'label' => '1 x 35cm Pre-Planted Basket',
                    'sku' => 'PA257',
                    'price' => 24.98,
                    'was_price' => 39.98,
                    'default' => false,
                ],
            ],
            'bulk_tiers' => [],
            'addons' => [
                [
                    'sku' => '501004',
                    'name' => 'Enriched Multi-Purpose Compost',
                    'price' => 7.99,
                    'image' => 'images/products/404220.jpg',
                ],
                [
                    'sku' => '501005',
                    'name' => 'Organic Seaweed Feed',
                    'price' => 6.49,
                    'image' => 'images/products/403891.jpg',
                ],
            ],
            'similar' => [
                ['name' => 'Surfinia Trailing Petunia Mix', 'price' => 9.99, 'image' => 'images/products/401842.jpg', 'url' => '#'],
                ['name' => 'Calibrachoa Mini Petunia Collection', 'price' => 12.99, 'image' => 'images/products/402156.jpg', 'url' => '#'],
                ['name' => 'Bacopa Trailing White', 'price' => 6.99, 'image' => 'images/products/403891.jpg', 'url' => '#'],
                ['name' => 'Pre-Planted Summer Hanging Basket', 'price' => 24.98, 'image' => 'images/products/404220.jpg', 'url' => '#'],
            ],
            'specs' => [
                ['label' => 'Flowering period', 'value' => 'June – October'],
                ['label' => 'Planting position', 'value' => 'Full sun'],
                ['label' => 'Eventual height', 'value' => '25 – 35cm'],
                ['label' => 'Eventual spread', 'value' => '60 – 90cm'],
                ['label' => 'Hardiness', 'value' => 'Protect from frost'],
            ],
            'care_tabs' => [
                [
                    'id' => 'water',
                    'title' => 'How to water',
                    'content' => 'Water regularly during dry spells, especially when growing in containers and baskets. Allow the compost to dry slightly between waterings.',
                ],
                [
                    'id' => 'plant',
                    'title' => 'How to plant',
                    'content' => 'Plant in well-drained compost in a sunny spot. Ideal for hanging baskets, patio pots and front-of-border displays.',
                ],
                [
                    'id' => 'tip',
                    'title' => 'Top tip',
                    'content' => 'Deadhead spent blooms and feed weekly in summer for the longest flowering season.',
                ],
            ],
            'plant_calendar' => [
                'title' => 'Plant calendar',
                'months' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                'seasons' => [
                    [
                        'id' => 'planting',
                        'short' => 'Plant',
                        'label' => 'Planting',
                        'ranges' => [['from' => 4, 'to' => 6]],
                    ],
                    [
                        'id' => 'flowering',
                        'short' => 'Flower',
                        'label' => 'Flowering',
                        'ranges' => [['from' => 5, 'to' => 9]],
                    ],
                ],
            ],
            'content_sections' => [
                [
                    'id' => 'description',
                    'title' => 'Description',
                    'open' => true,
                    'paragraphs' => [
                        'A vibrant mix of blooms that create a dynamic and cheerful display throughout the summer. These easy wave petunias are perfect for hanging baskets, containers and borders, delivering masses of colour with minimal effort.',
                        'The Ultimate Mix combines complementary shades for a professional-looking display. Plants spread and trail beautifully, filling out baskets and pots quickly once established.',
                        'Supplied as garden-ready plants — simply plant out after the last frosts and enjoy months of continuous colour.',
                    ],
                ],
                [
                    'id' => 'top-tips',
                    'title' => 'Top Tips',
                    'bullets' => [
                        'Plant in a sunny position for the best flower power.',
                        'Feed weekly with a high-potash liquid feed during the growing season.',
                        'Perfect for hanging baskets, window boxes and patio containers.',
                        'Protect from frost — keep indoors until all risk has passed.',
                    ],
                ],
                [
                    'id' => 'delivery',
                    'title' => 'Delivery Information',
                    'paragraphs' => [
                        'Please allow us 3–5 working days to dispatch your order. When your order is dispatched, we\'ll send you another email with details of how to track it.',
                        'Our nursery team sends plants nursery fresh in the perfect condition to thrive.',
                    ],
                ],
                [
                    'id' => 'reviews',
                    'title' => 'Reviews',
                    'paragraphs' => [
                        'See Feefo customer ratings and recent reviews for this product below.',
                    ],
                ],
            ],
            'feefo' => [
                'rating' => 4.5,
                'max_rating' => 5,
                'review_count' => 82,
                'reviews' => [
                    [
                        'rating' => 5,
                        'title' => 'Stunning colour',
                        'text' => 'Filled my baskets beautifully — still going strong in September.',
                        'author' => 'Trusted Customer',
                        'date' => '14 August 2025',
                    ],
                    [
                        'rating' => 5,
                        'title' => 'Great value',
                        'text' => 'Healthy plants, quick delivery. Would buy again.',
                        'author' => 'Trusted Customer',
                        'date' => '2 June 2025',
                    ],
                    [
                        'rating' => 4,
                        'title' => 'Lovely mix',
                        'text' => 'Good spread and plenty of flowers. Needed regular watering in the heat.',
                        'author' => 'Trusted Customer',
                        'date' => '19 July 2025',
                    ],
                ],
            ],
            'footer' => [
                'columns' => [
                    [
                        'title' => 'Help',
                        'links' => [
                            ['label' => 'Customer Services', 'url' => '#'],
                            ['label' => 'Delivery', 'url' => route('demo.standard-delivery')],
                            ['label' => 'Track Order', 'url' => '#'],
                            ['label' => 'Lifetime Guarantee', 'url' => route('demo.lifetime-guarantee')],
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
                            ['label' => 'Plant Finder', 'url' => route('demo.plant-finder')],
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
                            ['label' => 'About Us', 'url' => route('demo.about-us')],
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

    /** @return list<string> */
    public static function plantFinderMonths(): array
    {
        return [
            '1' => 'January',
            '2' => 'February',
            '3' => 'March',
            '4' => 'April',
            '5' => 'May',
            '6' => 'June',
            '7' => 'July',
            '8' => 'August',
            '9' => 'September',
            '10' => 'October',
            '11' => 'November',
            '12' => 'December',
        ];
    }

    /** @return list<array{id: string, label: string}> */
    public static function plantFinderCharacteristics(): array
    {
        return [
            ['id' => 'scented', 'label' => 'Scented / Fragrant'],
            ['id' => 'pots', 'label' => 'Perfect in pots'],
            ['id' => 'shade', 'label' => 'Plant in shade'],
            ['id' => 'sunshine', 'label' => 'Plant in sunshine'],
            ['id' => 'hardy', 'label' => 'Winter hardy'],
            ['id' => 'frost', 'label' => 'Protect from frost'],
            ['id' => 'edible', 'label' => 'Edible'],
            ['id' => 'cut-flower', 'label' => 'Cut flower'],
            ['id' => 'easy', 'label' => 'Easy to grow'],
            ['id' => 'wildlife', 'label' => 'Wildlife friendly'],
        ];
    }

    /** @return list<array<string, mixed>> */
    private static function plantFinderProducts(): array
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
                'name' => "English Lavender 'Hidcote'",
                'price_label' => 'Just',
                'price' => 14.98,
                'discount' => 50,
                'reviews' => 412,
                'rating' => 4.8,
                'category' => 'perennials',
                'planting' => [3, 4, 5, 9],
                'flowering' => [6, 7, 8],
                'fruiting' => [],
                'traits' => ['scented', 'sunshine', 'hardy', 'easy', 'wildlife', 'cut-flower'],
            ],
            [
                'name' => "Apple 'Braeburn' Tree",
                'price_label' => 'Just',
                'price' => 24.99,
                'discount' => 37,
                'reviews' => 189,
                'rating' => 4.6,
                'category' => 'fruit-trees',
                'planting' => [10, 11, 3],
                'flowering' => [4, 5],
                'fruiting' => [9, 10],
                'traits' => ['sunshine', 'hardy', 'edible', 'wildlife'],
            ],
            [
                'name' => "Clematis 'Nelly Moser'",
                'price_label' => 'From',
                'price' => 10.38,
                'discount' => 20,
                'reviews' => 276,
                'rating' => 4.7,
                'category' => 'climbing',
                'planting' => [3, 4, 9, 10],
                'flowering' => [5, 6, 7, 8, 9],
                'fruiting' => [],
                'traits' => ['shade', 'sunshine', 'hardy', 'easy', 'cut-flower'],
            ],
            [
                'name' => "Hydrangea paniculata 'Limelight'",
                'price_label' => 'From',
                'price' => 9.99,
                'discount' => 33,
                'reviews' => 341,
                'rating' => 4.9,
                'category' => 'shrubs',
                'planting' => [3, 4, 10],
                'flowering' => [7, 8, 9],
                'fruiting' => [],
                'traits' => ['shade', 'sunshine', 'hardy', 'easy', 'cut-flower', 'wildlife'],
            ],
            [
                'name' => "Strawberry 'Sweet Colossus'",
                'price_label' => 'From',
                'price' => 9.99,
                'discount' => 50,
                'reviews' => 198,
                'rating' => 4.5,
                'category' => 'fruit-bushes',
                'planting' => [3, 4, 5],
                'flowering' => [5, 6],
                'fruiting' => [6, 7, 8],
                'traits' => ['sunshine', 'pots', 'edible', 'easy'],
            ],
            [
                'name' => 'Citrus Blood Orange Tree',
                'price_label' => 'Just',
                'price' => 29.99,
                'discount' => 25,
                'reviews' => 156,
                'rating' => 4.4,
                'category' => 'citrus',
                'planting' => [4, 5, 6],
                'flowering' => [4, 5],
                'fruiting' => [11, 12, 1, 2],
                'traits' => ['sunshine', 'pots', 'frost', 'edible', 'scented'],
            ],
            [
                'name' => "Echinacea 'Cheyenne Spirit'",
                'price_label' => 'From',
                'price' => 9.99,
                'discount' => 50,
                'reviews' => 223,
                'rating' => 4.7,
                'category' => 'perennials',
                'planting' => [3, 4, 5, 9],
                'flowering' => [7, 8, 9],
                'fruiting' => [],
                'traits' => ['sunshine', 'hardy', 'easy', 'wildlife', 'cut-flower'],
            ],
            [
                'name' => "Foxglove Digitalis 'Illumination Flame'",
                'price_label' => 'From',
                'price' => 14.99,
                'discount' => 37,
                'reviews' => 167,
                'rating' => 4.6,
                'category' => 'perennials',
                'planting' => [3, 4, 5],
                'flowering' => [6, 7, 8],
                'fruiting' => [],
                'traits' => ['shade', 'hardy', 'wildlife', 'cut-flower'],
            ],
            [
                'name' => "Blueberry 'Blueray'",
                'price_label' => 'Just',
                'price' => 9.99,
                'discount' => 0,
                'reviews' => 134,
                'rating' => 4.5,
                'category' => 'fruit-bushes',
                'planting' => [10, 11, 3, 4],
                'flowering' => [5, 6],
                'fruiting' => [7, 8],
                'traits' => ['sunshine', 'pots', 'hardy', 'edible', 'wildlife'],
            ],
            [
                'name' => "Pre-Planted Fuchsia Trailing Hanging Baskets",
                'price_label' => 'Just',
                'price' => 24.98,
                'discount' => 37,
                'reviews' => 289,
                'rating' => 4.8,
                'category' => 'bedding',
                'planting' => [4, 5, 6],
                'flowering' => [6, 7, 8, 9],
                'fruiting' => [],
                'traits' => ['sunshine', 'pots', 'easy', 'wildlife'],
            ],
            [
                'name' => "Acer palmatum 'Emerald Lace'",
                'price_label' => 'Just',
                'price' => 9.99,
                'discount' => 33,
                'reviews' => 201,
                'rating' => 4.7,
                'category' => 'trees',
                'planting' => [10, 11, 3],
                'flowering' => [4, 5],
                'fruiting' => [],
                'traits' => ['shade', 'sunshine', 'hardy', 'pots'],
            ],
            [
                'name' => "Amaryllis 'Snow Queen' Growing Kit",
                'price_label' => 'Just',
                'price' => 12.99,
                'discount' => 13,
                'reviews' => 98,
                'rating' => 4.3,
                'category' => 'bulbs',
                'planting' => [10, 11, 12],
                'flowering' => [12, 1, 2],
                'fruiting' => [],
                'traits' => ['pots', 'easy', 'cut-flower', 'frost'],
            ],
        ];

        $categoryLabels = [
            'perennials' => 'Perennials',
            'shrubs' => 'Shrubs',
            'trees' => 'Trees',
            'climbing' => 'Climbing',
            'bedding' => 'Bedding',
            'bulbs' => 'Bulbs',
            'fruit-trees' => 'Fruit trees',
            'fruit-bushes' => 'Fruit bushes',
            'citrus' => 'Citrus',
        ];

        return array_map(function (array $product, int $index) use ($images, $categoryLabels) {
            $product['image'] = $images[$index % count($images)];
            $product['url'] = route('demo.pdp');
            $product['category_label'] = $categoryLabels[$product['category']] ?? 'Plants';
            $product['was_price'] = $product['discount'] > 0
                ? round($product['price'] / (1 - ($product['discount'] / 100)), 2)
                : null;

            return $product;
        }, $products, array_keys($products));
    }

    /** @return list<array<string, mixed>> */
    public static function plantFinderQuiz(): array
    {
        return [
            [
                'id' => 'space',
                'question' => 'Where will you be growing?',
                'hint' => 'Pick the spot you have in mind — we will suggest plants that suit it.',
                'options' => [
                    ['id' => 'any', 'label' => 'Any space', 'desc' => 'Show me everything', 'filters' => []],
                    ['id' => 'garden', 'label' => 'Garden border', 'desc' => 'Beds, borders and lawns', 'filters' => []],
                    ['id' => 'patio', 'label' => 'Patio or pots', 'desc' => 'Containers and planters', 'filters' => ['traits' => ['pots']]],
                    ['id' => 'balcony', 'label' => 'Balcony', 'desc' => 'Compact and easy care', 'filters' => ['traits' => ['pots', 'easy']]],
                ],
            ],
            [
                'id' => 'light',
                'question' => 'How much sun does your spot get?',
                'hint' => 'Most plants thrive in the right light — this narrows your matches fast.',
                'options' => [
                    ['id' => 'any', 'label' => 'Not sure', 'desc' => 'Skip this for now', 'filters' => []],
                    ['id' => 'sun', 'label' => 'Full sunshine', 'desc' => '6+ hours of direct sun', 'filters' => ['traits' => ['sunshine']]],
                    ['id' => 'shade', 'label' => 'Shade', 'desc' => 'Mostly shaded area', 'filters' => ['traits' => ['shade']]],
                    ['id' => 'flexible', 'label' => 'A bit of both', 'desc' => 'Sun or partial shade', 'filters' => []],
                ],
            ],
            [
                'id' => 'goal',
                'question' => 'What are you hoping to grow?',
                'hint' => 'Tell us what you are looking for and we will filter the catalogue.',
                'options' => [
                    ['id' => 'any', 'label' => 'Surprise me', 'desc' => 'All plant types', 'filters' => []],
                    ['id' => 'flowers', 'label' => 'Colourful flowers', 'desc' => 'Blooms and borders', 'filters' => ['category' => 'perennials']],
                    ['id' => 'edible', 'label' => 'Fruit & veg', 'desc' => 'Home-grown harvests', 'filters' => ['traits' => ['edible']]],
                    ['id' => 'easy', 'label' => 'Easy & low fuss', 'desc' => 'Great for beginners', 'filters' => ['traits' => ['easy']]],
                ],
            ],
            [
                'id' => 'season',
                'question' => 'When do you want it to shine?',
                'hint' => 'Choose when you would like flowers, fruit or interest in the garden.',
                'options' => [
                    ['id' => 'any', 'label' => 'Any time', 'desc' => 'Year-round interest', 'filters' => []],
                    ['id' => 'spring', 'label' => 'Spring', 'desc' => 'March – May', 'filters' => ['flowering' => '4']],
                    ['id' => 'summer', 'label' => 'Summer', 'desc' => 'June – August', 'filters' => ['flowering' => '7']],
                    ['id' => 'autumn', 'label' => 'Autumn', 'desc' => 'September – November', 'filters' => ['flowering' => '9']],
                ],
            ],
        ];
    }

    /** @return array<string, mixed> */
    public static function plantFinderPage(): array
    {
        return [
            'title' => 'Plant Finder',
            'intro' => 'Answer a few quick questions and we will suggest plants that suit your space — or jump straight to the filters below.',
            'breadcrumb' => [
                ['label' => 'Home', 'url' => route('demo.pdp')],
                ['label' => 'Plant Finder', 'url' => null],
            ],
            'months' => self::plantFinderMonths(),
            'categories' => [
                '' => 'All categories',
                'perennials' => 'Perennial Plants & Flowers',
                'shrubs' => 'Garden Shrubs',
                'trees' => 'Garden Trees',
                'climbing' => 'Climbing Plants',
                'bedding' => 'Bedding Plants',
                'bulbs' => 'Garden Bulbs',
                'fruit-trees' => 'Fruit Trees',
                'fruit-bushes' => 'Fruit Bushes',
                'citrus' => 'Citrus Trees & Plants',
            ],
            'characteristics' => self::plantFinderCharacteristics(),
            'sort_options' => [
                ['value' => 'name-asc', 'label' => 'Name A–Z'],
                ['value' => 'name-desc', 'label' => 'Name Z–A'],
                ['value' => 'price-asc', 'label' => 'Price: Low – High'],
                ['value' => 'price-desc', 'label' => 'Price: High – Low'],
            ],
            'quiz' => self::plantFinderQuiz(),
            'trait_labels' => collect(self::plantFinderCharacteristics())->pluck('label', 'id')->all(),
            'products' => self::plantFinderProducts(),
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
                'was_price' => 14.99,
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
            'PA255' => [
                'sku' => 'PA255',
                'name' => "Petunia 'Easy Wave' Ultimate Mix",
                'variant' => '5 x Garden Ready Plants',
                'image' => 'images/products/404220.jpg',
                'price' => 6.99,
                'was_price' => 9.99,
                'club_price' => 5.94,
                'club_saving_per_unit' => 1.05,
            ],
            'PA256' => [
                'sku' => 'PA256',
                'name' => "Petunia 'Easy Wave' Ultimate Mix",
                'variant' => '10 x Garden Ready Plants',
                'image' => 'images/products/404220.jpg',
                'price' => 12.99,
                'was_price' => 19.99,
                'club_price' => 11.04,
                'club_saving_per_unit' => 1.95,
            ],
            'PA257' => [
                'sku' => 'PA257',
                'name' => "Petunia 'Easy Wave' Ultimate Mix",
                'variant' => '1 x 35cm Pre-Planted Basket',
                'image' => 'images/products/404220.jpg',
                'price' => 24.98,
                'was_price' => 39.98,
                'club_price' => 21.23,
                'club_saving_per_unit' => 3.75,
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
                'was_price' => 7.99,
                'club_price' => 4.24,
                'club_saving_per_unit' => 0.75,
            ],
            '501002' => [
                'sku' => '501002',
                'name' => 'Rootgrow Mycorrhizal Fungi',
                'variant' => '360g pouch',
                'image' => 'images/products/402156.jpg',
                'price' => 3.99,
                'was_price' => 5.99,
                'club_price' => 3.39,
                'club_saving_per_unit' => 0.60,
            ],
            '501003' => [
                'sku' => '501003',
                'name' => 'Bulb Starter Fertiliser with rootgrow',
                'variant' => '1 x 1kg tub',
                'image' => 'images/products/403891.jpg',
                'price' => 9.99,
                'was_price' => 14.99,
                'club_price' => 8.49,
                'club_saving_per_unit' => 1.50,
            ],
            '501004' => [
                'sku' => '501004',
                'name' => 'Enriched Multi-Purpose Compost',
                'variant' => '40L bag',
                'image' => 'images/products/404220.jpg',
                'price' => 7.99,
                'was_price' => 11.99,
                'club_price' => 6.79,
                'club_saving_per_unit' => 1.20,
            ],
            '501005' => [
                'sku' => '501005',
                'name' => 'Organic Seaweed Feed',
                'variant' => '1L concentrate',
                'image' => 'images/products/404220.jpg',
                'price' => 6.49,
                'was_price' => 9.99,
                'club_price' => 5.52,
                'club_saving_per_unit' => 0.97,
            ],
            '501006' => [
                'sku' => '501006',
                'name' => "Lilac 'Palibin' Tree Feed",
                'variant' => '500g tub',
                'image' => 'images/products/510317.png',
                'price' => 5.99,
                'was_price' => 8.99,
                'club_price' => 5.09,
                'club_saving_per_unit' => 0.90,
            ],
            '501007' => [
                'sku' => '501007',
                'name' => 'Bulb Planter Tool',
                'image' => 'images/products/403891.jpg',
                'price' => 9.49,
                'was_price' => 12.99,
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
                'was_price' => self::CLUB_WAS_PRICE,
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
            'demo_club_in_cart' => false,
            'demo_drawer_enabled' => true,
            'demo_free_delivery_bar' => false,
            'demo_show_upsells' => true,
            'demo_wide_drawer' => false,
            'demo_show_apple_pay' => false,
            'demo_show_clearpay' => false,
            'demo_show_klarna' => false,
            'demo_checkout_codes_top' => true,
        ]);

        DemoDrawerVariant::setEnabled(true);
        DemoDrawerVariant::setV30Enabled(true);
        DemoDrawerVariant::setV40Enabled(true);
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
            $wasUnit = (float) ($product['was_price'] ?? 0);
            if ($wasUnit <= $unitPrice) {
                $wasUnit = round($unitPrice * 1.5, 2);
            }
            $lineWas = $wasUnit * $row['qty'];
            $lineSaving = max(0, round($lineWas - $line, 2));
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
                'unit_price' => $unitPrice,
                'was_price' => $wasUnit,
                'line_saving' => $lineSaving,
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
            'show_clearpay' => (bool) session('demo_show_clearpay', false),
            'show_klarna' => (bool) session('demo_show_klarna', false),
            'compact_v21' => DemoDrawerVariant::isActive(),
            'summary_v30' => DemoDrawerVariant::isV30Active(),
            'feedback_v40' => DemoDrawerVariant::isV40Active(),
            'checkout_codes_top' => (bool) session('demo_checkout_codes_top', true),
            'checkout_codes_ticket' => (bool) session('demo_checkout_codes_ticket', false),
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
