<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Adobe Fonts (Typekit) kit ID
    |--------------------------------------------------------------------------
    |
    | Create a web project at https://fonts.adobe.com/ including Gelica and
    | Proxima Nova, then paste the kit ID (from use.typekit.net/xxxx.css).
    |
    */
    'adobe_fonts_kit' => env('ADOBE_FONTS_KIT'),

    /*
    |--------------------------------------------------------------------------
    | Demo customer account login (prototype)
    |--------------------------------------------------------------------------
    */
    'account_email' => env('DEMO_ACCOUNT_EMAIL', 'demo'),
    'account_password' => env('DEMO_ACCOUNT_PASSWORD', 'password'),
    'club_account_email' => env('DEMO_CLUB_ACCOUNT_EMAIL', 'democlub'),
    'club_account_password' => env('DEMO_CLUB_ACCOUNT_PASSWORD', 'password'),

];
