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
        ]);
    }

    public function loginSubmit(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $email = strtolower(trim($request->input('email')));
        $password = $request->input('password');

        if (
            $email !== strtolower(config('demo.account_email'))
            || $password !== config('demo.account_password')
        ) {
            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'Invalid email or password. Use the demo credentials shown below.']);
        }

        DemoAccount::login();

        return redirect()->route('demo.account.home');
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

        // Prototype: always load the fixed demo customer profile
        DemoAccount::login();

        return redirect()->route('demo.account.home');
    }

    public function logout(): RedirectResponse
    {
        DemoAccount::logout();

        return redirect()->route('demo.account.login');
    }

    public function home(): View
    {
        return $this->dashboard('demo.account-home', 'home');
    }

    public function orders(): View
    {
        return $this->dashboard('demo.account-orders', 'orders');
    }

    public function information(): View
    {
        return $this->dashboard('demo.account-information', 'information');
    }

    public function delivery(): View
    {
        return $this->dashboard('demo.account-delivery', 'delivery');
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
        ]);
    }
}
