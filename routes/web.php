<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\PreviewLoginController;
use App\Http\Controllers\TvLiveController;
use Illuminate\Support\Facades\Route;

Route::get('/login', [PreviewLoginController::class, 'show'])->name('demo.login');
Route::post('/login', [PreviewLoginController::class, 'login'])->name('demo.login.submit');
Route::post('/logout', [PreviewLoginController::class, 'logout'])->name('demo.logout');

Route::middleware(['demo.preview', 'demo.drawer-variant'])->group(function () {
    Route::get('/', [DemoController::class, 'homeArgos'])->name('demo.home');
    Route::get('/home-argos-preview', fn () => redirect()->route('demo.home'))->name('demo.home-argos');
    Route::get('/sale', [DemoController::class, 'sale'])->name('demo.sale');
    Route::get('/pdp', [DemoController::class, 'pdp'])->name('demo.pdp');
    Route::get('/item-p-820001/yg-discount-club-annual-membership', [DemoController::class, 'clubPdp'])->name('demo.club');
    Route::get('/discount-club', fn () => redirect()->route('demo.club'))->name('demo.club.short');
    Route::get('/about-us', [DemoController::class, 'aboutUs'])->name('demo.about-us');
    Route::get('/standard-delivery', [DemoController::class, 'standardDelivery'])->name('demo.standard-delivery');
    Route::get('/lifetime-guarantee', [DemoController::class, 'lifetimeGuarantee'])->name('demo.lifetime-guarantee');
    Route::get('/plant-finder', [DemoController::class, 'plantFinder'])->name('demo.plant-finder');
    Route::get('/garden-plants', [ListingController::class, 'gardenPlants'])->name('demo.listing.garden-plants');
    Route::get('/perennial-plants-and-flowers', [ListingController::class, 'perennials'])->name('demo.listing.perennials');
    Route::get('/tv-live', [TvLiveController::class, 'show'])->name('demo.tv-live');
    Route::get('/account/login', [AccountController::class, 'login'])->name('demo.account.login');
    Route::get('/account/demo-login/{type?}', [AccountController::class, 'demoLogin'])->name('demo.account.demo-login');
    Route::post('/account/login', [AccountController::class, 'loginSubmit'])->name('demo.account.login.submit');
    Route::get('/account/forgotten-password', [AccountController::class, 'forgottenPassword'])->name('demo.account.forgotten-password');
    Route::post('/account/forgotten-password', [AccountController::class, 'forgottenPasswordSubmit'])->name('demo.account.forgotten-password.submit');
    Route::get('/account/register', [AccountController::class, 'register'])->name('demo.account.register');
    Route::post('/account/register', [AccountController::class, 'registerSubmit'])->name('demo.account.register.submit');
    Route::post('/account/logout', [AccountController::class, 'logout'])->name('demo.account.logout');
    Route::get('/account', [AccountController::class, 'home'])->name('demo.account.home');
    Route::get('/account/orders', [AccountController::class, 'orders'])->name('demo.account.orders');
    Route::get('/account/orders/{orderId}', [AccountController::class, 'orderShow'])->name('demo.account.order');
    Route::get('/account/orders/{orderId}/track', [AccountController::class, 'orderTrack'])->name('demo.account.order.track');
    Route::get('/account/information', [AccountController::class, 'information'])->name('demo.account.information');
    Route::get('/account/information/edit', [AccountController::class, 'informationEdit'])->name('demo.account.information.edit');
    Route::post('/account/information', [AccountController::class, 'informationSubmit'])->name('demo.account.information.submit');
    Route::get('/account/delivery', [AccountController::class, 'delivery'])->name('demo.account.delivery');
    Route::get('/account/delivery/amend', [AccountController::class, 'deliveryAmend'])->name('demo.account.delivery.amend');
    Route::post('/account/delivery/amend', [AccountController::class, 'deliveryAmendSubmit'])->name('demo.account.delivery.amend.submit');
    Route::post('/account/delivery/delete', [AccountController::class, 'deliveryDelete'])->name('demo.account.delivery.delete');
    Route::get('/account/club-membership', [AccountController::class, 'club'])->name('demo.account.club');

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
});
