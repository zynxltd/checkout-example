<?php

namespace App\Http\Controllers;

use App\Support\DemoDrawerVariant;
use App\Services\DemoAccount;
use App\Services\DemoCart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function fragment(Request $request): JsonResponse
    {
        DemoCart::seed();

        $html = view('demo.partials.drawer', [
            'cart' => DemoCart::state(),
        ])->render();

        return response()->json([
            'html' => $html,
            'cart' => DemoCart::state(),
        ]);
    }

    public function add(Request $request): JsonResponse
    {
        DemoCart::seed();

        $sku = $request->string('sku')->toString() ?: DemoCart::PDP_SKU;
        $qty = max(1, (int) $request->input('qty', 1));

        if (! isset(DemoCart::catalogue()[$sku])) {
            return response()->json(['error' => 'Unknown product.'], 422);
        }

        $variant = $request->string('variant')->toString();
        DemoCart::addItem($sku, $qty, $variant !== '' ? $variant : null);

        return $this->fragment($request);
    }

    public function updateQty(Request $request): JsonResponse
    {
        DemoCart::seed();
        $sku = $request->string('sku')->toString();
        $qty = max(0, (int) $request->input('qty', 1));

        $items = collect(session('demo_cart_items', []))
            ->map(function ($row) use ($sku, $qty) {
                if ($row['sku'] === $sku) {
                    $row['qty'] = $qty;
                }

                return $row;
            })
            ->filter(fn ($row) => $row['qty'] > 0)
            ->values()
            ->all();

        session(['demo_cart_items' => $items]);

        return $this->fragment($request);
    }

    public function remove(Request $request): JsonResponse
    {
        DemoCart::seed();
        $sku = $request->string('sku')->toString();

        $items = collect(session('demo_cart_items', []))
            ->reject(fn ($row) => $row['sku'] === $sku)
            ->values()
            ->all();

        session(['demo_cart_items' => $items]);
        DemoCart::syncClubInCartFlag();

        return $this->fragment($request);
    }

    public function applyCode(Request $request): JsonResponse
    {
        DemoCart::seed();
        $type = $request->string('type')->toString();
        $code = trim($request->string('code')->toString());

        if ($code === '') {
            return response()->json([
                'error' => 'Please enter a code.',
            ], 422);
        }

        if ($type === 'offer') {
            if (session('demo_offer_code')) {
                return response()->json([
                    'error' => 'You can only use one offer code per order.',
                ], 422);
            }

            if (strtoupper($code) === DemoCart::DEMO_VOUCHER_CODE) {
                return response()->json([
                    'error' => 'VOUCHER is a voucher code — enter it under Voucher code.',
                ], 422);
            }

            if (! DemoCart::isValidOfferCode($code)) {
                return response()->json([
                    'error' => 'This offer code isn\'t valid. Try TEST or EM0000 in this demo.',
                ], 422);
            }

            session(['demo_offer_code' => strtoupper($code)]);

            return $this->fragment($request);
        }

        if ($type === 'voucher') {
            return response()->json([
                'error' => 'Gift vouchers can only be applied on the checkout page.',
            ], 422);
        }

        return response()->json(['error' => 'Invalid code type.'], 422);
    }

    public function removeCode(Request $request): JsonResponse
    {
        DemoCart::seed();
        $type = $request->string('type')->toString();

        if ($type === 'offer') {
            session(['demo_offer_code' => null]);
        } elseif ($type === 'voucher') {
            return response()->json([
                'error' => 'Gift vouchers can only be removed on the checkout page.',
            ], 422);
        }

        return $this->fragment($request);
    }

    public function addClub(Request $request): JsonResponse
    {
        DemoCart::seed();

        if (session('demo_club_member')) {
            return response()->json(['error' => 'You are already a club member.'], 422);
        }

        if (DemoCart::hasClubInCart()) {
            return response()->json(['error' => 'Club membership is already in your basket.'], 422);
        }

        $sku = $request->string('sku')->toString() ?: DemoCart::CLUB_SKU_AUTO;

        if (! in_array($sku, DemoCart::clubSkus(), true)) {
            return response()->json(['error' => 'Unknown membership product.'], 422);
        }

        DemoCart::addClubMembership($sku);

        return $this->fragment($request);
    }

    public function toggleDrawer(Request $request): JsonResponse
    {
        session(['demo_drawer_enabled' => $request->boolean('enabled')]);

        return response()->json([
            'drawer_enabled' => session('demo_drawer_enabled'),
        ]);
    }

    public function toggleOption(Request $request): JsonResponse
    {
        DemoCart::seed();

        $key = $request->string('key')->toString();
        $value = $request->boolean('enabled');

        if ($key === 'compact_v21') {
            DemoDrawerVariant::setEnabled($value);

            return $this->fragment($request);
        }

        if ($key === 'summary_v30') {
            DemoDrawerVariant::setV30Enabled($value);

            return $this->fragment($request);
        }

        if ($key === 'feedback_v40') {
            DemoDrawerVariant::setV40Enabled($value);

            return $this->fragment($request);
        }

        if ($key === 'checkout_codes_top') {
            session(['demo_checkout_codes_top' => $value]);

            return response()->json(['ok' => true, 'reload' => true]);
        }

        if ($key === 'checkout_codes_ticket') {
            session(['demo_checkout_codes_ticket' => $value]);

            return response()->json(['ok' => true, 'reload' => true]);
        }

        if ($key === 'club_member') {
            DemoAccount::setClubMember($value);

            return response()->json(['ok' => true, 'reload' => true]);
        }

        $map = [
            'delivery_bar' => 'demo_free_delivery_bar',
            'upsells' => 'demo_show_upsells',
            'wide_drawer' => 'demo_wide_drawer',
            'apple_pay' => 'demo_show_apple_pay',
            'clearpay' => 'demo_show_clearpay',
            'klarna' => 'demo_show_klarna',
        ];

        if (! isset($map[$key])) {
            return response()->json(['error' => 'Unknown option.'], 422);
        }

        session([$map[$key] => $value]);

        return $this->fragment($request);
    }
}
