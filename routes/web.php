<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DemoController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DemoController::class, 'pdp'])->name('demo.pdp');

Route::get('/checkout', [CheckoutController::class, 'show'])->name('demo.checkout');
Route::post('/checkout/complete', [CheckoutController::class, 'complete'])->name('demo.checkout.complete');
Route::post('/checkout/voucher', [CheckoutController::class, 'applyVoucher'])->name('demo.checkout.voucher');
Route::delete('/checkout/voucher', [CheckoutController::class, 'removeVoucher'])->name('demo.checkout.voucher.remove');
Route::get('/checkout/confirmation', [CheckoutController::class, 'confirmation'])->name('demo.checkout.confirmation');

Route::prefix('cart')->group(function () {
    Route::get('fragment', [CartController::class, 'fragment']);
    Route::post('add', [CartController::class, 'add']);
    Route::post('qty', [CartController::class, 'updateQty']);
    Route::post('remove', [CartController::class, 'remove']);
    Route::post('code', [CartController::class, 'applyCode']);
    Route::delete('code', [CartController::class, 'removeCode']);
    Route::post('club', [CartController::class, 'addClub']);
    Route::post('toggle-drawer', [CartController::class, 'toggleDrawer']);
    Route::post('toggle-option', [CartController::class, 'toggleOption']);
});
