<?php

namespace App\Services;

class DemoAccount
{
    public const SESSION_KEY = 'demo_account_user';

    public static function defaultUser(): array
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
            'date_of_birth' => 'Jan 15, 1988',
            'address' => [
                'line1' => '12 Guest Lane',
                'line2' => '',
                'town' => 'Manchester',
                'postcode' => 'M1 4GH',
                'country' => 'United Kingdom',
            ],
            'communication_preferences' => [
                'Catalogues with new varieties and offers',
                'Exclusive offers and discounts via email',
                'Garden-related offers via telephone and SMS',
                'Third-party offers by post from trusted partners',
            ],
            'orders' => [],
        ];
    }

    /** @return array<string, string> Defaults for register form prefill */
    public static function formDefaults(): array
    {
        $user = self::defaultUser();
        $address = $user['address'];

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

    public static function user(): array
    {
        return session(self::SESSION_KEY, self::defaultUser());
    }

    public static function isLoggedIn(): bool
    {
        return session()->has(self::SESSION_KEY);
    }

    public static function login(): void
    {
        session([self::SESSION_KEY => self::defaultUser()]);
    }

    public static function logout(): void
    {
        session()->forget(self::SESSION_KEY);
    }

    public static function formattedAddress(?array $address = null): string
    {
        $address ??= self::user()['address'];
        $parts = array_filter([
            $address['line1'] ?? '',
            $address['line2'] ?? '',
            $address['town'] ?? '',
            $address['postcode'] ?? '',
            strtoupper($address['country'] ?? ''),
        ]);

        return implode("\n", $parts);
    }
}
