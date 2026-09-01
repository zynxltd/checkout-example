<?php

namespace App\Http\Controllers;

use App\Services\DemoAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PreviewLoginController extends Controller
{
    public function show(Request $request): View|RedirectResponse
    {
        if (! config('demo-preview.auth_enabled')) {
            return redirect()->route('demo.home');
        }

        if ($this->hasSiteAccess($request)) {
            return redirect()->to($this->intendedUrl($request));
        }

        return view('demo.login', [
            'redirect' => $request->query('redirect'),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        if (! config('demo-preview.auth_enabled')) {
            return redirect()->route('demo.home');
        }

        $request->validate([
            'username' => ['required', 'string', 'max:120'],
            'password' => ['required', 'string', 'max:128'],
        ]);

        $username = $request->string('username')->toString();
        $password = $request->string('password')->toString();

        if (DemoAccount::attemptLogin($username, $password)) {
            return redirect()->to($this->intendedUrl($request));
        }

        $previewUsername = config('demo-preview.username');
        $previewPassword = config('demo-preview.password');

        $valid = hash_equals($previewUsername, $username)
            && hash_equals($previewPassword, $password);

        if (! $valid) {
            return back()
                ->withInput($request->only('username'))
                ->withErrors(['username' => 'Invalid username or password.']);
        }

        $request->session()->regenerate();
        DemoAccount::grantSiteAccess();

        return redirect()->to($this->intendedUrl($request));
    }

    public function logout(Request $request): RedirectResponse
    {
        $request->session()->forget('demo_preview_authenticated');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('demo.login');
    }

    private function intendedUrl(Request $request): string
    {
        $redirect = $request->input('redirect') ?? $request->query('redirect');

        if (is_string($redirect) && $redirect !== '') {
            $parsed = parse_url($redirect);

            if ($parsed !== false && empty($parsed['host'])) {
                return $redirect;
            }

            if ($parsed !== false && isset($parsed['host']) && $parsed['host'] === $request->getHost()) {
                return $redirect;
            }
        }

        return route('demo.home');
    }

    private function hasSiteAccess(Request $request): bool
    {
        return $request->session()->get('demo_preview_authenticated') === true
            || DemoAccount::isLoggedIn();
    }
}
