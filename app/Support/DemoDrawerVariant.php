<?php

namespace App\Support;

use Illuminate\Http\Request;

class DemoDrawerVariant
{
    public const QUERY = '2.1';

    public const SESSION_KEY = 'demo_drawer_variant';

    public static function applyFromRequest(Request $request): void
    {
        // Compact v2.1 is off by default; enabled only via prototype tools toggle (session).
    }

    public static function setEnabled(bool $enabled): void
    {
        if ($enabled) {
            session([self::SESSION_KEY => self::QUERY]);

            return;
        }

        session()->forget(self::SESSION_KEY);
    }

    public static function isActive(): bool
    {
        return session(self::SESSION_KEY) === self::QUERY;
    }

    public static function drawerClass(): string
    {
        return self::isActive() ? 'yg-drawer--v-2-1' : '';
    }
}
