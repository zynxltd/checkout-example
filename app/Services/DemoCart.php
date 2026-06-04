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
            'title' => $p['name'],
            'page_title' => "Syringa 'Palibin' Lilac Tree - planted in 3 Litre Pot",
            'tagline' => 'Beautifully Fragrant, Gorgeous Colour, And Double Flowering — Add Classic Lilac Charm To Any Garden, Big Or Small!',
            'pack' => '1 x 3 Litre Pot',
            'price' => $p['price'],
            'was_price' => $p['was_price'],
            'save' => round($p['was_price'] - $p['price'], 2),
            'club_price' => $p['club_price'],
            'image' => $p['image'],
            'image_alt' => "Lilac 'Palibin' standard tree in a 3 litre pot",
            'breadcrumb' => [
                ['label' => 'Home', 'url' => '/'],
                ['label' => 'Garden Plants', 'url' => '#'],
                ['label' => 'Trees and Shrubs', 'url' => '#'],
                ['label' => "Lilac 'Palibin' Standard", 'url' => null],
            ],
            'also_bought' => [
                'sku' => '510626',
                'name' => "Pair Of Lilac Syringa Palibin Standard - 2 x 3 Litre Pots",
                'price' => 59.98,
            ],
            'features' => [
                ['label' => 'RHS Garden Merit', 'icon' => 'merit'],
                ['label' => 'Scented / Fragrant', 'icon' => 'scent'],
                ['label' => 'Perfect In Pots', 'icon' => 'pot'],
                ['label' => 'Plant In Sunshine', 'icon' => 'sun'],
                ['label' => 'Winter Hardy', 'icon' => 'hardy'],
                ['label' => 'Easy To Grow', 'icon' => 'easy'],
                ['label' => 'Wildlife Friendly', 'icon' => 'wildlife'],
            ],
            'dimensions' => 'Width: 150cm · Height: 250cm',
            'description_lead' => "Imagine a lilac that doesn't take over your garden but still delivers that unmistakable, heady fragrance and clouds of pretty blooms each spring. That's exactly what you get with this dwarf standard 'Palibin'.",
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
                'name' => "Lilac 'Palibin' Standard",
                'variant' => '1 x 3 Litre Pot',
                'image' => 'images/products/510317.png',
                'price' => 34.99,
                'was_price' => 39.99,
                'club_price' => 29.74,
                'club_saving_per_unit' => 5.25,
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
