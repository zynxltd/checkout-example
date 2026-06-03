<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Demo preview gate (replaces Forge nginx basic auth)
    |--------------------------------------------------------------------------
    */

    'auth_enabled' => (bool) env('DEMO_PREVIEW_AUTH_ENABLED', true),

    'username' => env('DEMO_PREVIEW_USERNAME', 'web'),

    'password' => env('DEMO_PREVIEW_PASSWORD', 'letmein2'),

    /** When true, session cookie is discarded when the browser closes (signs user out). */
    'session_expire_on_close' => (bool) env('DEMO_PREVIEW_SESSION_EXPIRE_ON_CLOSE', true),

];
