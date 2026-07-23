<?php

namespace App\Http\Controllers;

use App\Services\DemoAccount;
use App\Services\DemoCart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;

class CheckoutController extends Controller
{
    public function show(Request $request): View|RedirectResponse|Response
    {
        DemoCart::seed();
        $cart = DemoCart::state();

        if ($cart['is_empty']) {
            return redirect()
                ->route('demo.home')
                ->with('checkout_notice', 'Your basket is empty — add items before checkout.');
        }

        $voucherFromUrl = trim($request->string('voucher')->toString());
        if (
            $voucherFromUrl !== ''
            && ! session('demo_voucher_code')
            && DemoCart::isValidVoucherCode($voucherFromUrl)
        ) {
            session(['demo_voucher_code' => DemoCart::normalizeVoucherCode($voucherFromUrl)]);

            return redirect()->route('demo.checkout');
        }

        $cart = DemoCart::state();

        return response()
            ->view('demo.checkout', [
                'cart' => $cart,
                'checkout_account' => DemoAccount::checkoutPrefill(),
            ])
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            ->header('Pragma', 'no-cache');
    }

    public function complete(Request $request): RedirectResponse
    {
        DemoCart::seed();

        if (DemoCart::state()['is_empty']) {
            return redirect()
                ->route('demo.home')
                ->with('checkout_notice', 'Your basket is empty — add items before checkout.');
        }

        DemoCart::placeOrder($request->all());

        return redirect()->route('demo.checkout.confirmation');
    }

    public function confirmation(): View|RedirectResponse
    {
        DemoCart::seed();

        $order = DemoCart::lastOrder();

        if (! $order) {
            return redirect()
                ->route('demo.home')
                ->with('checkout_notice', 'No recent order to show.');
        }

        return view('demo.confirmation', [
            'order' => $order,
            'recommendations' => DemoCart::recommendationsForPostPurchase($order['items'] ?? []),
        ]);
    }

    public function applyVoucher(Request $request): JsonResponse
    {
        DemoCart::seed();

        if (DemoCart::state()['is_empty']) {
            return response()->json(['error' => 'Your basket is empty.'], 422);
        }

        $code = trim($request->string('code')->toString());

        if ($code === '') {
            return response()->json(['error' => 'Please enter a voucher code.'], 422);
        }

        if (session('demo_voucher_code')) {
            return response()->json(['error' => 'You can only use one voucher per order.'], 422);
        }

        if (DemoCart::isValidOfferCode($code) && ! DemoCart::isValidVoucherCode($code)) {
            return response()->json([
                'error' => 'This is an offer code — use the "Offer code" field instead.',
            ], 422);
        }

        if (! DemoCart::isValidVoucherCode($code)) {
            if (DemoCart::looksLikeGiftVoucher($code)) {
                return response()->json([
                    'error' => 'This voucher isn\'t valid. Check the number and try again.',
                ], 422);
            }

            return response()->json([
                'error' => 'This voucher isn\'t valid. Check the code and try again.',
            ], 422);
        }

        session(['demo_voucher_code' => DemoCart::normalizeVoucherCode($code)]);

        return response()->json(['ok' => true]);
    }

    public function removeVoucher(Request $request): JsonResponse
    {
        DemoCart::seed();
        session(['demo_voucher_code' => null]);

        return response()->json(['ok' => true]);
    }
}
