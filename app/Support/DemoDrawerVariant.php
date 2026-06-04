<?php

namespace App\Support;

use Illuminate\Http\Request;

class DemoDrawerVariant
{
    public const QUERY = '2.1';

    public const V30 = '3.0';

    public const OFF = 'off';

    public const SESSION_KEY = 'demo_drawer_variant';

    public const SESSION_V30_KEY = 'demo_drawer_v30';

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

    public static function drawerClass(): string
    {
        $classes = [];

        if (self::isActive()) {
            $classes[] = 'yg-drawer--v-2-1';
        }

        if (self::isV30Active()) {
            $classes[] = 'yg-drawer--v-3-0';
        }

        return implode(' ', $classes);
    }
}
