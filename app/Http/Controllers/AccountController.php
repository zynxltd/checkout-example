<?php

namespace App\Http\Controllers;

use App\Services\DemoAccount;
use App\Services\DemoCart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AccountController extends Controller
{
    public function login(): View
    {
        DemoCart::seed();

        return view('demo.account-login', [
            'cart' => DemoCart::state(),
            'promo' => DemoAccount::loginPromo(),
        ]);
    }

    public function loginSubmit(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'max:120'],
            'password' => ['required', 'string'],
        ]);

        $login = strtolower(trim($request->input('email')));
        $password = $request->input('password');

        if (
            $login === strtolower(config('demo.club_account_email'))
            && $password === config('demo.club_account_password')
        ) {
            DemoAccount::loginAsClubMember();

            return redirect()->route('demo.account.home');
        }

        if (
            $login === strtolower(config('demo.account_email'))
            && $password === config('demo.account_password')
        ) {
            DemoAccount::loginAsGuest();

            return redirect()->route('demo.account.home');
        }

        return back()
            ->withInput($request->only('email'))
            ->withErrors(['email' => 'Invalid login or password. Use the demo credentials shown below.']);
    }

    public function register(): View
    {
        DemoCart::seed();

        return view('demo.account-register', [
            'cart' => DemoCart::state(),
            'defaults' => DemoAccount::formDefaults(),
        ]);
    }

    public function registerSubmit(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => ['required', 'string', 'max:20'],
            'first_name' => ['required', 'string', 'max:80'],
            'last_name' => ['required', 'string', 'max:80'],
            'email' => ['required', 'email', 'max:120'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['required', 'string', 'max:40'],
            'address_line1' => ['required', 'string', 'max:120'],
            'address_line2' => ['nullable', 'string', 'max:120'],
            'town' => ['required', 'string', 'max:80'],
            'postcode' => ['required', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:80'],
            'terms' => ['accepted'],
        ]);

        DemoAccount::loginAsGuest();

        return redirect()->route('demo.account.home');
    }

    public function logout(): RedirectResponse
    {
        DemoAccount::logout();

        return redirect()->route('demo.account.login');
    }

    public function home(): View|RedirectResponse
    {
        return $this->dashboard('demo.account-home', 'home');
    }

    public function orders(): View|RedirectResponse
    {
        return $this->dashboard('demo.account-orders', 'orders');
    }

    public function orderShow(string $orderId): View|RedirectResponse
    {
        return $this->orderDashboard('demo.account-order', 'orders', $orderId);
    }

    public function orderTrack(string $orderId): View|RedirectResponse
    {
        return $this->orderDashboard('demo.account-order-track', 'orders', $orderId, requireTracking: true);
    }

    public function information(): View|RedirectResponse
    {
        return $this->dashboard('demo.account-information', 'information');
    }

    public function informationEdit(): View|RedirectResponse
    {
        return $this->dashboard('demo.account-information-edit', 'information');
    }

    public function informationSubmit(Request $request): RedirectResponse
    {
        if (! DemoAccount::isLoggedIn()) {
            return redirect()->route('demo.account.login');
        }

        return redirect()
            ->route('demo.account.information')
            ->with('status', 'Your account information has been updated.');
    }

    public function delivery(): View|RedirectResponse
    {
        return $this->dashboard('demo.account-delivery', 'delivery');
    }

    public function deliveryAmend(): View|RedirectResponse
    {
        return $this->dashboard('demo.account-delivery-amend', 'delivery');
    }

    public function club(): View|RedirectResponse
    {
        return $this->dashboard('demo.account-club-membership', 'club');
    }

    private function dashboard(string $view, string $active): View|RedirectResponse
    {
        DemoCart::seed();

        if (! DemoAccount::isLoggedIn()) {
            return redirect()->route('demo.account.login');
        }

        return view($view, [
            'cart' => DemoCart::state(),
            'user' => DemoAccount::user(),
            'active' => $active,
            'club_member' => DemoAccount::isClubMember(),
            'promo' => DemoAccount::dashboardPromo(),
        ]);
    }

    private function orderDashboard(
        string $view,
        string $active,
        string $orderId,
        bool $requireTracking = false,
    ): View|RedirectResponse {
        DemoCart::seed();

        if (! DemoAccount::isLoggedIn()) {
            return redirect()->route('demo.account.login');
        }

        $order = DemoAccount::findOrder($orderId);

        if ($order === null) {
            return redirect()->route('demo.account.orders');
        }

        if ($requireTracking && empty($order['tracking'])) {
            return redirect()->route('demo.account.order', ['orderId' => $orderId]);
        }

        return view($view, [
            'cart' => DemoCart::state(),
            'user' => DemoAccount::user(),
            'active' => $active,
            'club_member' => DemoAccount::isClubMember(),
            'promo' => DemoAccount::dashboardPromo(),
            'order' => $order,
        ]);
    }
}
