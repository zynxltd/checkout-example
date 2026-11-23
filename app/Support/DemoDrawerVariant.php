<?php

namespace App\Support;

use Illuminate\Http\Request;

class DemoDrawerVariant
{
    public const QUERY = '2.1';

    public const V30 = '3.0';

    public const V40 = '4.0';

    public const OFF = 'off';

    public const SESSION_KEY = 'demo_drawer_variant';

    public const SESSION_V30_KEY = 'demo_drawer_v30';

    public const SESSION_V40_KEY = 'demo_feedback_v40';

    public const SESSION_TEST_KEY = 'demo_drawer_test_variant';

    /** Club banner off unless prototype toggle turns it on. */
    public const SESSION_SHOW_CLUB_KEY = 'demo_drawer_club_banner';

    public const SESSION_SHOW_SPF_KEY = 'demo_drawer_show_spf';

    public const SESSION_SHOW_OFFER_KEY = 'demo_drawer_show_offer';

    /** @var list<string> */
    public const TEST_VARIANTS = ['1', '2', '3'];

    public static function applyFromRequest(Request $request): void
    {
        // Compact v2.1 and subtotal v3.0 default on; prototype tools toggle persists on/off in session.
    }

    public static function setEnabled(bool $enabled): void
    {
        session([self::SESSION_KEY => $enabled ? self::QUERY : self::OFF]);
    }

    public static function isActive(): bool
    {
        return session(self::SESSION_KEY, self::QUERY) !== self::OFF;
    }

    public static function setV30Enabled(bool $enabled): void
    {
        session([self::SESSION_V30_KEY => $enabled]);
    }

    public static function isV30Active(): bool
    {
        return (bool) session(self::SESSION_V30_KEY, true);
    }

    public static function setV40Enabled(bool $enabled): void
    {
        session([self::SESSION_V40_KEY => $enabled]);
    }

    public static function isV40Active(): bool
    {
        return (bool) session(self::SESSION_V40_KEY, true);
    }

    public static function setTestVariant(string $variant): void
    {
        if (! in_array($variant, self::TEST_VARIANTS, true)) {
            $variant = '1';
        }

        session([self::SESSION_TEST_KEY => $variant]);
    }

    public static function testVariant(): string
    {
        $variant = (string) session(self::SESSION_TEST_KEY, '1');

        return in_array($variant, self::TEST_VARIANTS, true) ? $variant : '1';
    }

    public static function setShowClub(bool $enabled): void
    {
        session([self::SESSION_SHOW_CLUB_KEY => $enabled]);
    }

    public static function showClubBanner(): bool
    {
        // Default off — only show when prototype tool toggles it on.
        return session()->has(self::SESSION_SHOW_CLUB_KEY)
            ? (bool) session(self::SESSION_SHOW_CLUB_KEY)
            : false;
    }

    public static function setShowRootBoost(bool $enabled): void
    {
        session([self::SESSION_SHOW_SPF_KEY => $enabled]);
    }

    public static function showRootBoost(): bool
    {
        return (bool) session(self::SESSION_SHOW_SPF_KEY, true);
    }

    public static function setShowOfferCode(bool $enabled): void
    {
        session([self::SESSION_SHOW_OFFER_KEY => $enabled]);
    }

    public static function showOfferCode(): bool
    {
        return session()->has(self::SESSION_SHOW_OFFER_KEY)
            ? (bool) session(self::SESSION_SHOW_OFFER_KEY)
            : true;
    }

    /**
     * Cart drawer A/B layout flags for prototype Variant 1 / 2 / 3.
     *
     * Shared across all variants:
     * - No "You may also like" on mobile
     * - Split footer CTA: View Basket | Checkout (half / half)
     *
     * Club / SPF / offer code are independent prototype toggles.
     *
     * @return array{
     *     id: string,
     *     hide_ymal_mobile: bool,
     *     show_club: bool,
     *     offer_code_mode: 'hidden'|'dropdown'|'visible',
     *     show_root_boost: bool,
     *     show_secondary_cta: bool,
     *     primary_cta: 'checkout'|'basket'|'split'
     * }
     */
    public static function testConfig(): array
    {
        $id = self::testVariant();

        return [
            'id' => $id,
            'hide_ymal_mobile' => true,
            'show_root_boost' => self::showRootBoost(),
            'show_club' => self::showClubBanner(),
            'offer_code_mode' => self::showOfferCode() ? 'visible' : 'hidden',
            'show_secondary_cta' => false,
            'primary_cta' => 'split',
        ];
    }

    public static function drawerClass(): string
    {
        $test = self::testConfig();
        $classes = ['yg-drawer--test-v'.$test['id']];

        if ($test['hide_ymal_mobile']) {
            $classes[] = 'yg-drawer--no-ymal-mobile';
        }

        if (empty($test['show_club'])) {
            $classes[] = 'yg-drawer--no-club';
        }

        $cta = $test['primary_cta'] ?? 'checkout';
        if ($cta === 'basket') {
            $classes[] = 'yg-drawer--cta-basket';
        } elseif ($cta === 'split') {
            $classes[] = 'yg-drawer--cta-split';
        }

        if ($test['offer_code_mode'] === 'dropdown') {
            $classes[] = 'yg-drawer--offer-dropdown';
        } elseif ($test['offer_code_mode'] === 'hidden') {
            $classes[] = 'yg-drawer--offer-hidden';
        }

        return implode(' ', $classes);
    }
}
