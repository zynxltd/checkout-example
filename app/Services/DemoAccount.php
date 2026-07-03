<?php

namespace App\Services;

class DemoAccount
{
    public const SESSION_KEY = 'demo_account_user';

    public static function defaultUser(): array
    {
        return self::guestUser();
    }

    /** @return array<string, mixed> */
    public static function guestUser(): array
    {
        return [
            'account_number' => '10028471',
            'title' => 'Mr',
            'first_name' => 'John',
            'last_name' => 'Smith',
            'display_name' => 'MR John Smith',
            'business_name' => '',
            'email' => 'john@example.com',
            'phone' => '+44 (0)7700 900123',
            'date_of_birth' => '15 Jan 1988',
            'invoice_address' => [
                'line1' => '12 Guest Lane',
                'line2' => '',
                'town' => 'Manchester',
                'postcode' => 'M1 4GH',
                'country' => 'UNITED KINGDOM',
            ],
            'delivery_addresses' => [
                [
                    'id' => 'default',
                    'is_default' => true,
                    'name' => 'MR John Smith',
                    'business_name' => '',
                    'lines' => [
                        'line1' => '12 Guest Lane',
                        'line2' => '',
                        'town' => 'Manchester',
                        'postcode' => 'M1 4GH',
                        'country' => 'UNITED KINGDOM',
                    ],
                    'phone' => '+44 (0)7700 900123',
                ],
            ],
            'communication_preferences' => [
                ['label' => 'catalogues with new varieties and offers', 'opted_in' => true],
                ['label' => 'exclusive offers and discounts via email', 'opted_in' => true],
            ],
            'orders' => [],
            'club' => null,
        ];
    }

    /** @return array<string, mixed> */
    public static function clubMemberUser(): array
    {
        return [
            'account_number' => '10907202',
            'title' => 'Mr',
            'first_name' => 'Richard',
            'last_name' => 'Llewellyn',
            'display_name' => 'MR R Llewellyn',
            'business_name' => 'You Garden Ltd',
            'email' => 'richard@yougarden.com',
            'phone' => '01778382799',
            'date_of_birth' => '12 Mar 1972',
            'date_of_birth_iso' => '1972-03-12',
            'initial' => '',
            'invoice_address' => [
                'line1' => 'Stamford Road Industrial Estate',
                'line2' => 'Ryhall Road',
                'town' => 'MARKET DEEPING',
                'postcode' => 'PE6 8FD',
                'country' => 'UNITED KINGDOM',
            ],
            'delivery_addresses' => [
                [
                    'id' => 'home',
                    'is_default' => true,
                    'name' => 'Mr Richard Llewellyn',
                    'business_name' => '',
                    'lines' => [
                        'line1' => '3 Fallowfields',
                        'line2' => 'Deeping St. Nicholas',
                        'town' => 'Spalding',
                        'postcode' => 'PE11 3TL',
                        'country' => 'UNITED KINGDOM',
                    ],
                    'phone' => '01778382799',
                ],
                [
                    'id' => 'office',
                    'is_default' => false,
                    'name' => 'Mr Richard Llewellyn',
                    'business_name' => 'You Garden Ltd',
                    'lines' => [
                        'line1' => 'Stamford Road Industrial Estate',
                        'line2' => 'Ryhall Road',
                        'town' => 'MARKET DEEPING',
                        'postcode' => 'PE6 8FD',
                        'country' => 'UNITED KINGDOM',
                    ],
                    'phone' => '01778382799',
                ],
            ],
            'communication_preferences' => [
                ['label' => 'catalogues with new varieties and offers', 'opted_in' => false],
                ['label' => 'exclusive offers and discounts via email', 'opted_in' => true],
                ['label' => 'garden-related offers via telephone and SMS', 'opted_in' => true],
                ['label' => 'club member magazine and gardening content via email', 'opted_in' => true],
            ],
            'orders' => self::sampleOrders(),
            'club' => [
                'membership_start' => '24/01/2025',
                'membership_end' => '31/01/2028',
                'product_vouchers' => [
                    ['code' => 'FF9PX3UH3CP3BVGH', 'expires' => '31/07/2026', 'applied' => true],
                    ['code' => 'YKS9VPUR3H', 'expires' => '31/07/2026', 'applied' => false],
                    ['code' => 'CLB5OFF2026B', 'expires' => '31/01/2027', 'applied' => false],
                ],
                'postage_vouchers' => [
                    ['code' => 'PPFREE26A', 'expires' => '31/12/2026', 'applied' => false],
                ],
                'benefits' => [
                    [
                        'discount' => '15% OFF',
                        'categories' => 'Bulbs, Flowers, Roses, Plants, Trees & Shrubs, Fruit & Veg, Garden Essentials',
                    ],
                    [
                        'discount' => '7.5% OFF',
                        'categories' => 'Outdoor Living, Gifts',
                    ],
                ],
                'magazine' => [
                    'headline' => 'Your Club Magazine',
                    'intro' => 'Read the latest Club Magazine, exclusive to Discount Club members.',
                    'series' => 'Club Members Exclusive',
                    'issue' => 'Issue 5 | June 2026',
                    'title' => 'Your June Garden Starts Here',
                    'teasers' => [
                        'New Roses Fresh From Chelsea',
                        'Money-Saving, Long Flowering Perennials',
                        'Tales From Gardening Trips Abroad',
                    ],
                    'url' => 'https://content.yudu.com/web/433ma/0A44t64/CM-June-Iss-5-26/index.html',
                    'cover' => 'images/club-mag-issue-5-june-2026-cover.png',
                ],
            ],
        ];
    }

    /** @return array<string, string> */
    public static function formDefaults(): array
    {
        $user = self::guestUser();
        $address = $user['invoice_address'];

        return [
            'title' => $user['title'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'address_line1' => $address['line1'],
            'address_line2' => $address['line2'],
            'town' => $address['town'],
            'postcode' => $address['postcode'],
            'country' => $address['country'],
        ];
    }

    public static function isClubMember(): bool
    {
        return (bool) session('demo_club_member', false);
    }

    public static function isClubBenefitsCompact(): bool
    {
        return (bool) session('demo_club_benefits_compact', false);
    }

    public static function setClubBenefitsCompact(bool $active): void
    {
        session(['demo_club_benefits_compact' => $active]);
    }

    public static function user(): array
    {
        if (! self::isLoggedIn()) {
            return self::guestUser();
        }

        if (self::isClubMember()) {
            return session(self::SESSION_KEY, self::clubMemberUser());
        }

        return session(self::SESSION_KEY, self::guestUser());
    }

    public static function isLoggedIn(): bool
    {
        return session()->has(self::SESSION_KEY);
    }

    public static function loginAsGuest(): void
    {
        session([
            self::SESSION_KEY => self::guestUser(),
            'demo_club_member' => false,
        ]);
    }

    public static function loginAsClubMember(): void
    {
        session([
            self::SESSION_KEY => self::clubMemberUser(),
            'demo_club_member' => true,
        ]);
    }

    public static function login(): void
    {
        self::loginAsGuest();
    }

    public static function setClubMember(bool $active): void
    {
        session(['demo_club_member' => $active]);

        if (! self::isLoggedIn()) {
            return;
        }

        session([
            self::SESSION_KEY => $active ? self::clubMemberUser() : self::guestUser(),
        ]);
    }

    public static function logout(): void
    {
        session()->forget([self::SESSION_KEY, 'demo_club_member']);
    }

    /** @param array<string, mixed>|null $address */
    public static function formattedAddress(?array $address = null): string
    {
        if ($address === null) {
            $address = self::user()['invoice_address'] ?? [];
        }

        $parts = array_filter([
            $address['line1'] ?? '',
            $address['line2'] ?? '',
            $address['town'] ?? '',
            $address['postcode'] ?? '',
            strtoupper($address['country'] ?? ''),
        ]);

        return implode("\n", $parts);
    }

    /** @param array<string, mixed> $entry */
    public static function formattedDeliveryAddress(array $entry): string
    {
        $lines = $entry['lines'] ?? [];

        $parts = array_filter([
            $lines['line1'] ?? '',
            $lines['line2'] ?? '',
            $lines['town'] ?? '',
            $lines['postcode'] ?? '',
            strtoupper($lines['country'] ?? ''),
        ]);

        return implode("\n", $parts);
    }

    /** @param array<string, mixed> $user */
    public static function formattedMailingAddress(array $user): string
    {
        $parts = array_filter([
            $user['display_name'] ?? '',
            $user['business_name'] ?? '',
        ]);

        $address = self::formattedAddress($user['invoice_address'] ?? []);

        return implode("\n", array_filter([...$parts, $address]));
    }

    /** @return list<array<string, mixed>> */
    public static function sampleOrders(): array
    {
        return [
            [
                'id' => 'OR15284193',
                'date' => '18/06/2025',
                'value' => 84.97,
                'status' => 'Order completed',
                'tracking' => '1Z999AA10123456784',
                'carrier' => 'UPS',
                'items' => [
                    ['name' => 'Petunia Easy Wave Mixed', 'qty' => 2, 'price' => 14.97],
                    ['name' => 'Blooming Fast Superior Plant Food 800g', 'qty' => 1, 'price' => 4.99],
                    ['name' => 'Rootgrow Mycorrhizal Fungi 360g', 'qty' => 1, 'price' => 3.99],
                ],
                'delivery' => 4.99,
                'tracking_steps' => [
                    ['label' => 'Order placed', 'date' => '18 Jun 2025', 'complete' => true],
                    ['label' => 'Dispatched', 'date' => '19 Jun 2025', 'complete' => true],
                    ['label' => 'Out for delivery', 'date' => '21 Jun 2025', 'complete' => true],
                    ['label' => 'Delivered', 'date' => '21 Jun 2025', 'complete' => true],
                ],
            ],
            [
                'id' => 'OR14971252',
                'date' => '03/04/2025',
                'value' => 156.42,
                'status' => 'Order completed',
                'tracking' => null,
                'carrier' => null,
                'items' => [
                    ['name' => 'Rose Collection — Best Sellers', 'qty' => 1, 'price' => 89.99],
                    ['name' => 'Rose Food 1kg', 'qty' => 2, 'price' => 9.99],
                ],
                'delivery' => 4.99,
                'tracking_steps' => [],
            ],
            [
                'id' => 'OR14890311',
                'date' => '22/02/2025',
                'value' => 42.99,
                'status' => 'Order completed',
                'tracking' => null,
                'carrier' => null,
                'items' => [
                    ['name' => 'Daffodil Mixed Collection', 'qty' => 1, 'price' => 19.99],
                    ['name' => 'Tulip Mixed Collection', 'qty' => 1, 'price' => 18.99],
                ],
                'delivery' => 4.99,
                'tracking_steps' => [],
            ],
            [
                'id' => 'OR14755602',
                'date' => '09/01/2025',
                'value' => 19.99,
                'status' => 'Order cancelled',
                'tracking' => null,
                'carrier' => null,
                'items' => [
                    ['name' => 'Indoor Citrus Tree', 'qty' => 1, 'price' => 19.99],
                ],
                'delivery' => 0,
                'tracking_steps' => [],
            ],
            [
                'id' => 'OR14622188',
                'date' => '14/11/2024',
                'value' => 231.50,
                'status' => 'Order completed',
                'tracking' => null,
                'carrier' => null,
                'items' => [
                    ['name' => 'Fruit Tree Collection', 'qty' => 1, 'price' => 149.99],
                    ['name' => 'Enriched Multi-Purpose Compost 40L', 'qty' => 4, 'price' => 7.99],
                ],
                'delivery' => 0,
                'tracking_steps' => [],
            ],
        ];
    }

  /** @return array<string, string>|null */
    public static function findOrder(string $id): ?array
    {
        foreach (self::user()['orders'] as $order) {
            if (($order['id'] ?? '') === $id) {
                return $order;
            }
        }

        return null;
    }

    /** @return array<string, string> */
    public static function dashboardPromo(): array
    {
        if (self::isClubMember()) {
            return [
                'eyebrow' => 'Club member exclusive',
                'title' => 'Your £5 voucher expires 31 July',
                'body' => 'Apply YKS9VPUR3H at checkout — plus 15% off summer bedding, roses and perennials.',
                'cta_label' => 'View your vouchers',
                'cta_route' => 'demo.account.club',
            ];
        }

        return [
            'eyebrow' => 'Discount Club',
            'title' => 'Save up to 15% on your favourite plants',
            'body' => 'Join the YouGarden Discount Club for member pricing, voucher codes, and the exclusive Club Magazine.',
            'cta_label' => 'Join the Club',
            'cta_route' => 'demo.account.club',
        ];
    }

    /** @return array<string, string> */
    public static function loginPromo(): array
    {
        return [
            'eyebrow' => 'Limited time',
            'title' => 'Club members save up to 15% on summer favourites',
            'body' => 'Sign in to see your vouchers, order tracking, and exclusive Discount Club pricing.',
            'cta_label' => 'Explore summer plants',
            'cta_route' => 'demo.listing.perennials',
        ];
    }
}
