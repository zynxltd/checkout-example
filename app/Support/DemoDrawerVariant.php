<?php

namespace App\Support;

use Illuminate\Http\Request;

class DemoDrawerVariant
{
    public const QUERY = '2.1';

    public const OFF = 'off';

    public const SESSION_KEY = 'demo_drawer_variant';

    public static function applyFromRequest(Request $request): void
    {
        // Compact v2.1 default on; prototype tools toggle persists on/off in session.
    }

    public static function setEnabled(bool $enabled): void
    {
        session([self::SESSION_KEY => $enabled ? self::QUERY : self::OFF]);
    }

    public static function isActive(): bool
    {
        return session(self::SESSION_KEY, self::QUERY) !== self::OFF;
    }

    public static function drawerClass(): string
    {
        return self::isActive() ? 'yg-drawer--v-2-1' : '';
    }
}
