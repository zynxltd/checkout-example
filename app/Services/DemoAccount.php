<?php

namespace App\Services;

class DemoAccount
{
    public const SESSION_KEY = 'demo_account_user';

    public const WHISTL_DEMO_TRACKING_URL = 'https://despatch.whistl.co.uk/Tracking/reference/H06A8A0004034411';

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
            'date_of_birth_iso' => '1988-01-15',
            'initial' => '',
            'password' => config('demo.account_password'),
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
                [
                    'id' => 'alternate',
                    'is_default' => false,
                    'name' => 'MR John Smith',
                    'business_name' => '',
                    'lines' => [
                        'line1' => '27 Meadow View',
                        'line2' => 'Didsbury',
                        'town' => 'Manchester',
                        'postcode' => 'M20 2AB',
                        'country' => 'UNITED KINGDOM',
                    ],
                    'phone' => '+44 (0)7700 900123',
                ],
            ],
            'communication_preferences' => self::defaultCommunicationPreferences(),
            'orders' => self::guestSampleOrders(),
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
            'password' => config('demo.club_account_password'),
            'invoice_address' => [
                'line1' => 'Eventus',
                'line2' => 'You Garden Ltd Sunderland Road, Northfields Industrial Estate',
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
                    'name' => 'Mr R Llewellyn',
                    'business_name' => 'You Garden Ltd',
                    'lines' => [
                        'line1' => 'Eventus',
                        'line2' => 'You Garden Ltd Sunderland Road, Northfields Industrial Estate',
                        'town' => 'MARKET DEEPING',
                        'postcode' => 'PE6 8FD',
                        'country' => 'UNITED KINGDOM',
                    ],
                    'phone' => '01778382799',
                ],
            ],
            'communication_preferences' => self::defaultCommunicationPreferences(clubMember: true),
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

    /** @return array<string, mixed>|null */
    public static function checkoutPrefill(): ?array
    {
        if (! self::isLoggedIn()) {
            return null;
        }

        $user = self::user();
        $invoice = $user['invoice_address'] ?? [];
        $defaultDelivery = collect($user['delivery_addresses'] ?? [])->firstWhere('is_default', true)
            ?? ($user['delivery_addresses'][0] ?? null);
        $deliveryLines = is_array($defaultDelivery) ? ($defaultDelivery['lines'] ?? []) : [];

        $normalizePostcode = static fn (?string $postcode): string => strtoupper(preg_replace('/\s+/', '', (string) $postcode));
        $alternativeDelivery = $defaultDelivery
            && $normalizePostcode($invoice['postcode'] ?? '') !== $normalizePostcode($deliveryLines['postcode'] ?? '');

        $prefill = [
            'email' => $user['email'] ?? '',
            'signed_in_label' => 'Signed in as '.($user['email'] ?? ''),
            'billing' => [
                'title' => strtoupper((string) ($user['title'] ?? 'MR')),
                'first_name' => $user['first_name'] ?? '',
                'last_name' => $user['last_name'] ?? '',
                'phone' => $user['phone'] ?? '',
                'date_of_birth' => $user['date_of_birth_iso'] ?? '',
                'postcode' => $invoice['postcode'] ?? '',
                'address1' => $invoice['line1'] ?? '',
                'address2' => $invoice['line2'] ?? '',
                'city' => $invoice['town'] ?? '',
            ],
            'alternative_delivery' => $alternativeDelivery,
        ];

        if ($alternativeDelivery) {
            $prefill['delivery'] = [
                'title' => strtoupper((string) ($user['title'] ?? 'MR')),
                'first_name' => $user['first_name'] ?? '',
                'last_name' => $user['last_name'] ?? '',
                'phone' => $defaultDelivery['phone'] ?? ($user['phone'] ?? ''),
                'postcode' => $deliveryLines['postcode'] ?? '',
                'address1' => $deliveryLines['line1'] ?? '',
                'address2' => $deliveryLines['line2'] ?? '',
                'address3' => $deliveryLines['line3'] ?? '',
                'address4' => $deliveryLines['line4'] ?? '',
                'city' => $deliveryLines['town'] ?? '',
            ];
        }

        return $prefill;
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

        $template = self::isClubMember() ? self::clubMemberUser() : self::guestUser();
        $user = session(self::SESSION_KEY, $template);
        $user['orders'] = $template['orders'];
        $user['communication_preferences'] = self::normalizeCommunicationPreferences($user);

        return $user;
    }

    /** @param array<string, mixed> $user */
    /** @return list<array{id: string, text: string, opted_out: bool}> */
    public static function normalizeCommunicationPreferences(array $user): array
    {
        $defaults = self::defaultCommunicationPreferences(! empty($user['club']));
        $stored = $user['communication_preferences'] ?? [];

        if (isset($stored[0]['text'])) {
            return $stored;
        }

        foreach ($defaults as $index => &$preference) {
            if (! isset($stored[$index])) {
                continue;
            }

            $legacy = $stored[$index];
            if (array_key_exists('opted_in', $legacy)) {
                $preference['opted_out'] = ! $legacy['opted_in'];
            } elseif (array_key_exists('opted_out', $legacy)) {
                $preference['opted_out'] = (bool) $legacy['opted_out'];
            }
        }
        unset($preference);

        return $defaults;
    }

    /** @return list<array{id: string, text: string, opted_out: bool}> */
    public static function defaultCommunicationPreferences(bool $clubMember = false): array
    {
        $preferences = [
            [
                'id' => 'catalogues',
                'text' => 'As a YouGarden customer we would like to send you our catalogues featuring new varieties and exclusive offers. Please tick if you DO NOT wish to receive.',
                'read_text' => 'You would like to receive our catalogues featuring new varieties and exclusive offers.',
                'opted_out' => false,
            ],
            [
                'id' => 'email_offers',
                'text' => 'We would like to send you exclusive offers and discounts by email. Please tick if you DO NOT wish to receive.',
                'read_text' => 'You would like to receive our exclusive offers and discounts by email.',
                'opted_out' => false,
            ],
            [
                'id' => 'phone_sms',
                'text' => 'We would like to send you garden related offers and contact you by Telephone and SMS. Please tick if you DO NOT wish to receive.',
                'read_text' => 'You would like to receive our garden related offers and contact you by Telephone and SMS',
                'opted_out' => false,
            ],
            [
                'id' => 'partners',
                'text' => 'We think you\'d enjoy some of the latest products and offers by post from our trusted partners; companies operating in the retail, charity, finance, travel, FMCG and utility sectors. If you DO NOT wish to receive these please tick.',
                'read_text' => 'You would like to enjoy some of the latest products and offers by post from our trusted partners; companies operating in the retail, charity, finance, travel, FMCG and utility sectors.',
                'opted_out' => false,
            ],
        ];

        if ($clubMember) {
            $preferences[0]['opted_out'] = true;
        }

        return $preferences;
    }

    /** @param array<string, mixed> $payload */
    public static function updateInvoiceAddress(array $payload): void
    {
        if (! self::isLoggedIn()) {
            return;
        }

        $user = session(self::SESSION_KEY);
        $user['invoice_address'] = [
            'line1' => $payload['line1'],
            'line2' => $payload['line2'] ?? '',
            'town' => $payload['town'],
            'postcode' => $payload['postcode'],
            'country' => $payload['country'] ?? 'UNITED KINGDOM',
        ];
        session([self::SESSION_KEY => $user]);
    }

    /** @param list<string> $optedOutIds */
    public static function updateCommunicationPreferences(array $optedOutIds): void
    {
        if (! self::isLoggedIn()) {
            return;
        }

        $user = session(self::SESSION_KEY);
        $optedOut = array_flip($optedOutIds);

        $user['communication_preferences'] = collect($user['communication_preferences'] ?? [])
            ->map(function (array $pref) use ($optedOut) {
                $id = $pref['id'] ?? '';
                $pref['opted_out'] = $id !== '' && isset($optedOut[$id]);

                return $pref;
            })
            ->values()
            ->all();

        session([self::SESSION_KEY => $user]);
    }

    /** @return array<string, mixed>|null */
    public static function findDeliveryAddress(string $id): ?array
    {
        foreach (self::user()['delivery_addresses'] as $address) {
            if (($address['id'] ?? '') === $id) {
                return $address;
            }
        }

        return null;
    }

    /** @param array<string, mixed> $payload */
    public static function updateDeliveryAddress(string $id, array $payload): void
    {
        if (! self::isLoggedIn()) {
            return;
        }

        $user = session(self::SESSION_KEY);
        $addresses = $user['delivery_addresses'] ?? [];
        $makeDefault = ! empty($payload['is_default']);

        foreach ($addresses as $index => $address) {
            if ($makeDefault) {
                $addresses[$index]['is_default'] = ($address['id'] ?? '') === $id;
            }

            if (($address['id'] ?? '') !== $id) {
                continue;
            }

            $addresses[$index]['name'] = $payload['name'];
            $addresses[$index]['business_name'] = $payload['business_name'] ?? '';
            $addresses[$index]['phone'] = $payload['phone'];
            $addresses[$index]['lines'] = [
                'line1' => $payload['line1'],
                'line2' => $payload['line2'] ?? '',
                'town' => $payload['town'],
                'postcode' => $payload['postcode'],
                'country' => $payload['country'] ?? 'UNITED KINGDOM',
            ];
        }

        $user['delivery_addresses'] = $addresses;
        session([self::SESSION_KEY => $user]);
    }

    public static function deleteDeliveryAddress(string $id): bool
    {
        if (! self::isLoggedIn()) {
            return false;
        }

        $user = session(self::SESSION_KEY);
        $addresses = $user['delivery_addresses'] ?? [];

        if (count($addresses) <= 1) {
            return false;
        }

        $removedDefault = false;
        $addresses = array_values(array_filter($addresses, function (array $address) use ($id, &$removedDefault) {
            if (($address['id'] ?? '') !== $id) {
                return true;
            }

            $removedDefault = ! empty($address['is_default']);

            return false;
        }));

        if (count($addresses) === count($user['delivery_addresses'] ?? [])) {
            return false;
        }

        if ($removedDefault) {
            $addresses[0]['is_default'] = true;
        }

        $user['delivery_addresses'] = $addresses;
        session([self::SESSION_KEY => $user]);

        return true;
    }

    /** @param array<string, mixed> $payload */
    public static function updateProfile(array $payload): void
    {
        if (! self::isLoggedIn()) {
            return;
        }

        $user = session(self::SESSION_KEY);
        $initial = trim((string) ($payload['initial'] ?? ''));
        $firstName = trim((string) ($payload['first_name'] ?? ''));
        $shortFirst = $initial !== '' ? strtoupper($initial) : strtoupper(substr($firstName, 0, 1));

        $user['title'] = $payload['title'];
        $user['first_name'] = $firstName;
        $user['initial'] = $initial;
        $user['last_name'] = trim((string) ($payload['last_name'] ?? ''));
        $user['display_name'] = strtoupper((string) ($payload['title'] ?? 'Mr')).' '.$shortFirst.' '.$user['last_name'];
        $user['business_name'] = trim((string) ($payload['business_name'] ?? ''));
        $user['email'] = strtolower(trim((string) ($payload['email'] ?? '')));
        $user['phone'] = trim((string) ($payload['phone'] ?? ''));

        if (! empty($payload['date_of_birth_iso'])) {
            $user['date_of_birth_iso'] = $payload['date_of_birth_iso'];
            $user['date_of_birth'] = $payload['date_of_birth'] ?? '';
        } else {
            $user['date_of_birth_iso'] = '';
            $user['date_of_birth'] = '';
        }

        if (! empty($payload['password'])) {
            $user['password'] = $payload['password'];
        }

        session([self::SESSION_KEY => $user]);
    }

    public static function verifyPassword(string $password): bool
    {
        if (! self::isLoggedIn()) {
            return false;
        }

        $stored = (string) (self::user()['password'] ?? '');

        return $stored !== '' && hash_equals($stored, $password);
    }

    /** @param array<string, mixed> $address */
    public static function formattedOrderAddress(array $address): string
    {
        $parts = array_filter([
            $address['name'] ?? '',
            $address['business_name'] ?? '',
        ]);

        $lines = $address['lines'] ?? $address;
        $parts[] = $lines['line1'] ?? '';
        $parts[] = $lines['line2'] ?? '';
        $parts[] = $lines['town'] ?? '';
        $parts[] = $lines['postcode'] ?? '';
        $parts[] = strtoupper((string) ($lines['country'] ?? 'UNITED KINGDOM'));

        return implode("\n", array_filter($parts));
    }

    /** @param array<string, mixed> $order @param array<string, mixed> $user */
    public static function orderBillingAddress(array $order, array $user): array
    {
        if (! empty($order['billing_address'])) {
            return $order['billing_address'];
        }

        return [
            'name' => $user['display_name'] ?? '',
            'business_name' => $user['business_name'] ?? '',
            'phone' => $user['phone'] ?? '',
            'lines' => $user['invoice_address'] ?? [],
        ];
    }

    /** @param array<string, mixed> $order @param array<string, mixed> $user */
    public static function orderDeliveryAddress(array $order, array $user): array
    {
        if (! empty($order['delivery_address'])) {
            return $order['delivery_address'];
        }

        $delivery = $user['delivery_addresses'][0] ?? [];

        return [
            'name' => $delivery['name'] ?? ($user['display_name'] ?? ''),
            'business_name' => $delivery['business_name'] ?? '',
            'phone' => $delivery['phone'] ?? ($user['phone'] ?? ''),
            'lines' => $delivery['lines'] ?? [],
        ];
    }

    public static function isLoggedIn(): bool
    {
        return session()->has(self::SESSION_KEY);
    }

    /**
     * Hard-coded demo accounts for the prototype (no database).
     *
     * @return array<string, array{password: string, club: bool}>
     */
    public static function demoLoginAccounts(): array
    {
        $guestLogin = strtolower(trim((string) config('demo.account_email', 'demo')));
        $clubLogin = strtolower(trim((string) config('demo.club_account_email', 'democlub')));

        $accounts = [
            $guestLogin => [
                'password' => (string) config('demo.account_password', 'password'),
                'club' => false,
            ],
            $clubLogin => [
                'password' => (string) config('demo.club_account_password', 'password'),
                'club' => true,
            ],
        ];

        $accounts['demo'] = $accounts[$guestLogin];
        $accounts['democlub'] = $accounts[$clubLogin];
        $accounts['john@example.com'] = $accounts[$guestLogin];
        $accounts['richard@yougarden.com'] = $accounts[$clubLogin];

        return $accounts;
    }

    public static function attemptLogin(string $login, string $password): bool
    {
        $login = strtolower(trim($login));
        $accounts = self::demoLoginAccounts();

        $account = $accounts[$login]
            ?? $accounts[explode('@', $login, 2)[0] ?? '']
            ?? null;

        if ($account === null) {
            return false;
        }

        if (! hash_equals($account['password'], $password)) {
            return false;
        }

        if ($account['club']) {
            self::loginAsClubMember();
        } else {
            self::loginAsGuest();
        }

        self::grantSiteAccess();

        return true;
    }

    public static function grantSiteAccess(): void
    {
        session(['demo_preview_authenticated' => true]);
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
    public static function whistlTrackingSteps(): array
    {
        return [
            ['label' => 'Delivered to Garage', 'date' => '25/03/2026 10:40', 'complete' => true],
            ['label' => 'Out for delivery — Delivery 10:00 - 12:00 today', 'date' => '25/03/2026 09:47', 'complete' => true],
            ['label' => 'Courier received', 'date' => '25/03/2026 09:08', 'complete' => true],
            ['label' => 'Out for delivery to courier', 'date' => '25/03/2026 00:55', 'complete' => true],
            ['label' => 'Processed at depot', 'date' => '24/03/2026 23:32', 'complete' => true],
            ['label' => 'Hub trailer via sorter', 'date' => '24/03/2026 16:13', 'complete' => true],
            ['label' => 'Received at Hermes hub', 'date' => '24/03/2026 16:12', 'complete' => true],
            ['label' => 'Shipment created', 'date' => '23/03/2026 11:31', 'complete' => true],
            ['label' => 'Pre-advice loaded', 'date' => '23/03/2026 11:31', 'complete' => true],
        ];
    }

    /**
     * Shared Patio Potato demo order — OR15284193 with live Whistl tracking.
     *
     * @param  array<string, mixed>  $billing
     * @param  array<string, mixed>  $delivery
     * @return array<string, mixed>
     */
    public static function patioPotatoDemoOrder(array $billing, array $delivery): array
    {
        return [
            'id' => 'OR15284193',
            'date' => '20/03/2026',
            'value' => 12.72,
            'subtotal' => 12.72,
            'status' => 'Order completed',
            'tracking' => 'H06A8A0004034411',
            'tracking_url' => self::WHISTL_DEMO_TRACKING_URL,
            'sender_reference' => 'SD14690111',
            'recipient_reference' => 'OR15284193',
            'carrier' => 'Evri',
            'service' => 'NPOD',
            'delivery' => 0.00,
            'items' => [
                [
                    'name' => 'Patio Potato Selection',
                    'product_number' => '350007',
                    'qty' => 1,
                    'price' => 12.72,
                    'image' => 'images/products/404220.jpg',
                ],
            ],
            'billing_address' => $billing,
            'delivery_address' => $delivery,
            'tracking_steps' => self::whistlTrackingSteps(),
        ];
    }

    /** @return array<string, string>|null */
    public static function orderTrackingUrl(array $order): ?string
    {
        if (! empty($order['tracking_url'])) {
            return (string) $order['tracking_url'];
        }

        if (($order['id'] ?? '') === 'OR15284193' && ! empty($order['tracking'])) {
            return self::WHISTL_DEMO_TRACKING_URL;
        }

        if (empty($order['tracking'])) {
            return null;
        }

        return route('demo.account.order.track', ['orderId' => $order['id']]);
    }

    /** @return list<array<string, mixed>> */
    public static function guestSampleOrders(): array
    {
        return [
            self::patioPotatoDemoOrder(
                [
                    'name' => 'MR John Smith',
                    'business_name' => '',
                    'phone' => '+44 (0)7700 900123',
                    'lines' => [
                        'line1' => '12 Guest Lane',
                        'line2' => '',
                        'town' => 'Manchester',
                        'postcode' => 'M1 4GH',
                        'country' => 'UNITED KINGDOM',
                    ],
                ],
                [
                    'name' => 'MR John Smith',
                    'business_name' => '',
                    'phone' => '+44 (0)7700 900123',
                    'lines' => [
                        'line1' => '27 Meadow View',
                        'line2' => 'Didsbury',
                        'town' => 'Manchester',
                        'postcode' => 'M20 2AB',
                        'country' => 'UNITED KINGDOM',
                    ],
                ],
            ),
        ];
    }

    /** @return list<array<string, mixed>> */
    public static function sampleOrders(): array
    {
        $clubBilling = [
            'name' => 'MR R Llewellyn',
            'business_name' => '',
            'phone' => '01778382799',
            'lines' => [
                'line1' => 'Eventus',
                'line2' => 'You Garden Ltd Sunderland Road, Northfields Industrial Estate',
                'town' => 'MARKET DEEPING',
                'postcode' => 'PE6 8FD',
                'country' => 'UNITED KINGDOM',
            ],
        ];

        $clubDelivery = [
            'name' => 'Mr Richard Llewellyn',
            'business_name' => '',
            'phone' => '01778382799',
            'lines' => [
                'line1' => '3 Fallowfields',
                'line2' => 'Deeping St. Nicholas',
                'town' => 'Spalding',
                'postcode' => 'PE11 3TL',
                'country' => 'UNITED KINGDOM',
            ],
        ];

        return [
            self::patioPotatoDemoOrder($clubBilling, $clubDelivery),
            self::demoOrder(
                id: 'OR15120488',
                date: '28/02/2026',
                status: 'Order completed',
                delivery: 6.99,
                tracking: 'H06A8A0004019822',
                items: [
                    ['name' => "English Lavender 'Hidcote'", 'product_number' => '510317', 'qty' => 2, 'price' => 9.99, 'image' => 'images/products/510317.png'],
                    ['name' => 'Enriched Multi-Purpose Compost', 'product_number' => '100062', 'qty' => 1, 'price' => 8.99, 'image' => 'images/products/404220.jpg'],
                ],
                billing: $clubBilling,
                deliveryAddress: $clubDelivery,
            ),
            self::demoOrder(
                id: 'OR15088341',
                date: '12/01/2026',
                status: 'Order completed',
                delivery: 0.00,
                tracking: null,
                items: [
                    ['name' => "Hardy Gerbera 'Garvinea' Bright Collection", 'product_number' => '480102', 'qty' => 1, 'price' => 19.99, 'image' => 'images/products/401842.jpg'],
                ],
                billing: $clubBilling,
                deliveryAddress: $clubDelivery,
            ),
            self::demoOrder(
                id: 'OR15044117',
                date: '03/12/2025',
                status: 'Dispatched',
                delivery: 6.99,
                tracking: 'YGTRACK77821',
                items: [
                    ['name' => 'Summer Flowering Fuchsia Collection', 'product_number' => '400551', 'qty' => 1, 'price' => 14.99, 'image' => 'images/products/402156.jpg'],
                    ['name' => 'Bacopa Trailing White', 'product_number' => '400220', 'qty' => 2, 'price' => 6.99, 'image' => 'images/products/403891.jpg'],
                ],
                billing: $clubBilling,
                deliveryAddress: $clubDelivery,
            ),
            [
                'id' => 'OR14971252',
                'date' => '04/11/2025',
                'value' => 0.00,
                'subtotal' => 0.00,
                'status' => 'Order completed',
                'tracking' => null,
                'carrier' => null,
                'delivery' => 0.00,
                'items' => [],
                'tracking_steps' => [],
                'billing_address' => $clubBilling,
                'delivery_address' => $clubDelivery,
            ],
            self::demoOrder(
                id: 'OR14920163',
                date: '18/10/2025',
                status: 'Order completed',
                delivery: 6.99,
                tracking: null,
                items: [
                    ['name' => "Clematis 'Nelly Moser'", 'product_number' => '510088', 'qty' => 1, 'price' => 12.99, 'image' => 'images/products/403891.jpg'],
                    ['name' => 'Hardy Carefree Lavender Collection', 'product_number' => '480440', 'qty' => 1, 'price' => 16.99, 'image' => 'images/products/510317.png'],
                ],
                billing: $clubBilling,
                deliveryAddress: $clubDelivery,
            ),
            self::demoOrder(
                id: 'OR14877409',
                date: '22/09/2025',
                status: 'Order completed',
                delivery: 0.00,
                tracking: null,
                items: [
                    ['name' => "Apple 'Braeburn' Tree", 'product_number' => '300041', 'qty' => 1, 'price' => 24.99, 'image' => 'images/products/404220.jpg'],
                ],
                billing: $clubBilling,
                deliveryAddress: $clubDelivery,
            ),
            self::demoOrder(
                id: 'OR14822055',
                date: '05/08/2025',
                status: 'Order completed',
                delivery: 6.99,
                tracking: null,
                items: [
                    ['name' => 'Complete Hardy Garden Perennial Collection', 'product_number' => '480901', 'qty' => 1, 'price' => 29.99, 'image' => 'images/products/401842.jpg'],
                    ['name' => 'Organic Seaweed Feed', 'product_number' => '100118', 'qty' => 1, 'price' => 7.99, 'image' => 'images/products/403891.jpg'],
                ],
                billing: $clubBilling,
                deliveryAddress: $clubDelivery,
            ),
            self::demoOrder(
                id: 'OR14765580',
                date: '14/07/2025',
                status: 'Order completed',
                delivery: 6.99,
                tracking: null,
                items: [
                    ['name' => "Strawberry 'Sweet Colossus'", 'product_number' => '320015', 'qty' => 3, 'price' => 8.99, 'image' => 'images/products/402156.jpg'],
                ],
                billing: $clubBilling,
                deliveryAddress: $clubDelivery,
            ),
            [
                'id' => 'OR14619028',
                'date' => '17/06/2025',
                'value' => 0.00,
                'subtotal' => 0.00,
                'status' => 'Order cancelled',
                'tracking' => null,
                'carrier' => null,
                'delivery' => 0.00,
                'items' => [],
                'tracking_steps' => [],
                'billing_address' => $clubBilling,
                'delivery_address' => $clubDelivery,
            ],
            self::demoOrder(
                id: 'OR14588312',
                date: '29/05/2025',
                status: 'Order completed',
                delivery: 0.00,
                tracking: null,
                items: [
                    ['name' => 'Brilliant Buddleia Collection', 'product_number' => '510204', 'qty' => 1, 'price' => 18.99, 'image' => 'images/products/404220.jpg'],
                ],
                billing: $clubBilling,
                deliveryAddress: $clubDelivery,
            ),
            self::demoOrder(
                id: 'OR14510277',
                date: '11/04/2025',
                status: 'Order completed',
                delivery: 6.99,
                tracking: null,
                items: [
                    ['name' => "Hydrangea paniculata 'Limelight'", 'product_number' => '510156', 'qty' => 1, 'price' => 17.99, 'image' => 'images/products/401842.jpg'],
                    ['name' => 'Surfinia Trailing Petunia Mix', 'product_number' => '400310', 'qty' => 2, 'price' => 9.99, 'image' => 'images/products/402156.jpg'],
                ],
                billing: $clubBilling,
                deliveryAddress: $clubDelivery,
            ),
            self::demoOrder(
                id: 'OR14456801',
                date: '02/03/2025',
                status: 'Order completed',
                delivery: 6.99,
                tracking: null,
                items: [
                    ['name' => 'Hardy Fragrant Lily Collection', 'product_number' => '480330', 'qty' => 1, 'price' => 15.99, 'image' => 'images/products/403891.jpg'],
                    ['name' => 'Pre-Planted Summer Hanging Basket', 'product_number' => '400880', 'qty' => 1, 'price' => 24.98, 'image' => 'images/products/404220.jpg'],
                ],
                billing: $clubBilling,
                deliveryAddress: $clubDelivery,
            ),
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $items
     * @param  array<string, mixed>  $billing
     * @param  array<string, mixed>  $deliveryAddress
     * @return array<string, mixed>
     */
    public static function demoOrder(
        string $id,
        string $date,
        string $status,
        float $delivery,
        ?string $tracking,
        array $items,
        array $billing,
        array $deliveryAddress,
    ): array {
        $subtotal = round(array_sum(array_map(
            static fn (array $item): float => (float) ($item['price'] ?? 0) * (int) ($item['qty'] ?? 0),
            $items,
        )), 2);

        return [
            'id' => $id,
            'date' => $date,
            'value' => round($subtotal + $delivery, 2),
            'subtotal' => $subtotal,
            'status' => $status,
            'tracking' => $tracking,
            'carrier' => $tracking ? 'Evri' : null,
            'delivery' => $delivery,
            'items' => $items,
            'billing_address' => $billing,
            'delivery_address' => $deliveryAddress,
            'tracking_steps' => [],
        ];
    }

    public const ORDERS_PER_PAGE = 5;

    /**
     * @return array{
     *     items: list<array<string, mixed>>,
     *     current_page: int,
     *     last_page: int,
     *     per_page: int,
     *     total: int,
     *     from: int,
     *     to: int
     * }
     */
    public static function paginateOrders(int $page = 1, ?int $perPage = null): array
    {
        $perPage = $perPage ?? self::ORDERS_PER_PAGE;
        $orders = self::user()['orders'] ?? [];
        $total = count($orders);
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = max(1, min($page, $lastPage));
        $offset = ($page - 1) * $perPage;
        $items = array_values(array_slice($orders, $offset, $perPage));
        $from = $total === 0 ? 0 : $offset + 1;
        $to = $total === 0 ? 0 : min($offset + count($items), $total);

        return [
            'items' => $items,
            'current_page' => $page,
            'last_page' => $lastPage,
            'per_page' => $perPage,
            'total' => $total,
            'from' => $from,
            'to' => $to,
        ];
    }

    /** @return array<string, mixed>|null */
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
