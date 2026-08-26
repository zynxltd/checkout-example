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

    public function complete(Request $request): RedirectResponse|JsonResponse
    {
        DemoCart::seed();

        if (DemoCart::state()['is_empty']) {
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'error' => 'Your basket is empty — add items before checkout.',
                    'redirect' => route('demo.checkout'),
                ], 422);
            }

            return redirect()
                ->route('demo.checkout')
                ->with('checkout_notice', 'Your basket is empty — add items before checkout.');
        }

        $order = DemoCart::placeOrder($request->all());

        // Persist + one-request flash backup (survives a flaky session write between pay → confirm).
        session()->flash('demo_checkout_just_placed', true);
        session()->flash('demo_checkout_order', $order);
        session()->save();

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'ok' => true,
                'order_number' => $order['number'] ?? null,
                'redirect' => route('demo.checkout.confirmation'),
            ]);
        }

        return redirect()->route('demo.checkout.confirmation');
    }

    public function confirmation(): View|RedirectResponse
    {
        DemoCart::seed();

        $order = DemoCart::lastOrder() ?? session('demo_checkout_order');

        if (is_array($order) && $order !== [] && ! DemoCart::lastOrder()) {
            session(['demo_last_order' => $order]);
            session()->save();
        }

        if (! is_array($order) || $order === []) {
            // No receipt — resume checkout quietly if the basket is still open.
            if (! DemoCart::state()['is_empty']) {
                return redirect()->route('demo.checkout');
            }

            return redirect()
                ->route('demo.home')
                ->with('checkout_notice', 'No order found — add items and check out when you are ready.');
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
