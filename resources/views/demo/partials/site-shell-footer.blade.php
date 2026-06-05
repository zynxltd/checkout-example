@include('demo.partials.pdp-reviews-footer', [
    'product' => [
        'feefo' => $feefo ?? null,
        'footer' => $footer ?? \App\Services\DemoCart::siteFooter(),
    ],
])
