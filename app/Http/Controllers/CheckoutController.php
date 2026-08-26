<?php

namespace App\Http\Controllers;

use App\Services\DemoAccount;
use App\Services\DemoCart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
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

        try {
            $order = DemoCart::placeOrder($request->all());
        } catch (\Throwable $e) {
            report($e);

            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'error' => 'Could not complete payment. Please try again.',
                    'redirect' => route('demo.checkout'),
                ], 500);
            }

            return redirect()
                ->route('demo.checkout')
                ->with('checkout_notice', 'Could not complete payment. Please try again.');
        }

        $receipt = Str::random(40);
        // Always use file cache — demo/cloud has no database (CACHE_STORE=database 500s).
        try {
            Cache::store('file')->put(self::receiptCacheKey($receipt), $order, now()->addHours(2));
        } catch (\Throwable $e) {
            report($e);
        }

        // Persist + flash backup (survives flaky session writes between pay → confirm).
        session()->flash('demo_checkout_just_placed', true);
        session()->flash('demo_checkout_order', $order);
        session()->save();

        $redirect = route('demo.checkout.confirmation', ['receipt' => $receipt]);

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'ok' => true,
                'order_number' => $order['number'] ?? null,
                'redirect' => $redirect,
            ]);
        }

        return redirect()->to($redirect);
    }

    public function confirmation(Request $request): View|RedirectResponse
    {
        DemoCart::seed();

        $order = DemoCart::lastOrder();
        if (! is_array($order) || $order === []) {
            $flashed = session('demo_checkout_order');
            $order = is_array($flashed) ? $flashed : null;
        }

        $receipt = trim($request->string('receipt')->toString());
        if ((! is_array($order) || $order === []) && $receipt !== '') {
            try {
                $cached = Cache::store('file')->get(self::receiptCacheKey($receipt));
            } catch (\Throwable $e) {
                report($e);
                $cached = null;
            }
            if (is_array($cached) && $cached !== []) {
                $order = $cached;
            }
        }

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

    private static function receiptCacheKey(string $receipt): string
    {
        return 'demo_checkout_receipt:'.$receipt;
    }
}
