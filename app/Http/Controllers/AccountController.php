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

        if (DemoAccount::attemptLogin(
            $request->string('email')->toString(),
            $request->string('password')->toString(),
        )) {
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
        DemoAccount::grantSiteAccess();

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

    public function orders(Request $request): View|RedirectResponse
    {
        DemoCart::seed();

        if (! DemoAccount::isLoggedIn()) {
            return redirect()->route('demo.account.login');
        }

        $page = max(1, $request->integer('page', 1));
        $ordersPage = DemoAccount::paginateOrders($page);

        if ($page !== $ordersPage['current_page']) {
            return redirect()->route('demo.account.orders', ['page' => $ordersPage['current_page']]);
        }

        return view('demo.account-orders', [
            'cart' => DemoCart::state(),
            'user' => DemoAccount::user(),
            'active' => 'orders',
            'club_member' => DemoAccount::isClubMember(),
            'club_benefits_compact' => DemoAccount::isClubBenefitsCompact(),
            'promo' => DemoAccount::dashboardPromo(),
            'ordersPage' => $ordersPage,
        ]);
    }

    public function orderShow(string $orderId): View|RedirectResponse
    {
        return $this->orderDashboard('demo.account-order', 'orders', $orderId);
    }

    public function orderTrack(string $orderId): View|RedirectResponse
    {
        DemoCart::seed();

        if (! DemoAccount::isLoggedIn()) {
            return redirect()->route('demo.account.login');
        }

        $order = DemoAccount::findOrder($orderId);

        if ($order === null) {
            return redirect()->route('demo.account.orders');
        }

        if (! empty($order['tracking_url'])) {
            return redirect()->away($order['tracking_url']);
        }

        if (($order['id'] ?? '') === 'OR15284193' && ! empty($order['tracking'])) {
            return redirect()->away(DemoAccount::WHISTL_DEMO_TRACKING_URL);
        }

        if (empty($order['tracking'])) {
            return redirect()->route('demo.account.order', ['orderId' => $orderId]);
        }

        return view('demo.account-order-track', [
            'cart' => DemoCart::state(),
            'user' => DemoAccount::user(),
            'active' => 'orders',
            'club_member' => DemoAccount::isClubMember(),
            'club_benefits_compact' => DemoAccount::isClubBenefitsCompact(),
            'promo' => DemoAccount::dashboardPromo(),
            'order' => $order,
        ]);
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

        $rules = [
            'title' => ['required', 'string', 'max:20'],
            'first_name' => ['required', 'string', 'max:80'],
            'initial' => ['nullable', 'string', 'max:1'],
            'last_name' => ['required', 'string', 'max:80'],
            'business_name' => ['nullable', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:120'],
            'email_confirmation' => ['required', 'same:email'],
            'phone' => ['required', 'string', 'max:40'],
            'date_of_birth' => ['nullable', 'date'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ];

        if ($request->filled('password')) {
            $rules['existing_password'] = ['required', 'string'];
        }

        $validated = $request->validate($rules);

        if ($request->filled('password') && ! DemoAccount::verifyPassword($validated['existing_password'])) {
            return back()
                ->withInput()
                ->withErrors(['existing_password' => 'Your existing password is incorrect.']);
        }

        $dobIso = '';
        $dobDisplay = '';
        if (! empty($validated['date_of_birth'])) {
            $dob = \Carbon\Carbon::parse($validated['date_of_birth']);
            $dobIso = $dob->format('Y-m-d');
            $dobDisplay = $dob->format('j M Y');
        }

        DemoAccount::updateProfile([
            'title' => $validated['title'],
            'first_name' => $validated['first_name'],
            'initial' => $validated['initial'] ?? '',
            'last_name' => $validated['last_name'],
            'business_name' => $validated['business_name'] ?? '',
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'date_of_birth_iso' => $dobIso,
            'date_of_birth' => $dobDisplay,
            'password' => $validated['password'] ?? null,
        ]);

        if ($request->boolean('invoice_address_open')) {
            $addressValidated = $request->validate([
                'invoice_line_1' => ['required', 'string', 'max:120'],
                'invoice_line_2' => ['nullable', 'string', 'max:120'],
                'invoice_town' => ['required', 'string', 'max:120'],
                'invoice_postcode' => ['required', 'string', 'max:20'],
            ]);

            DemoAccount::updateInvoiceAddress([
                'line1' => $addressValidated['invoice_line_1'],
                'line2' => $addressValidated['invoice_line_2'] ?? '',
                'town' => $addressValidated['invoice_town'],
                'postcode' => strtoupper(trim($addressValidated['invoice_postcode'])),
                'country' => 'UNITED KINGDOM',
            ]);
        }

        DemoAccount::updateCommunicationPreferences($request->input('communication_opt_out', []));

        return redirect()
            ->route('demo.account.information')
            ->with('status', 'Your account information has been updated.');
    }

    public function delivery(): View|RedirectResponse
    {
        return $this->dashboard('demo.account-delivery', 'delivery');
    }

    public function deliveryAmend(Request $request): View|RedirectResponse
    {
        DemoCart::seed();

        if (! DemoAccount::isLoggedIn()) {
            return redirect()->route('demo.account.login');
        }

        $addressId = $request->string('address')->toString() ?: 'default';
        $delivery = DemoAccount::findDeliveryAddress($addressId);

        if ($delivery === null) {
            return redirect()->route('demo.account.delivery');
        }

        return view('demo.account-delivery-amend', [
            'cart' => DemoCart::state(),
            'user' => DemoAccount::user(),
            'active' => 'delivery',
            'club_member' => DemoAccount::isClubMember(),
            'club_benefits_compact' => DemoAccount::isClubBenefitsCompact(),
            'promo' => DemoAccount::dashboardPromo(),
            'delivery' => $delivery,
        ]);
    }

    public function deliveryAmendSubmit(Request $request): RedirectResponse
    {
        if (! DemoAccount::isLoggedIn()) {
            return redirect()->route('demo.account.login');
        }

        $addressId = $request->string('address_id')->toString() ?: 'default';

        if (DemoAccount::findDeliveryAddress($addressId) === null) {
            return redirect()->route('demo.account.delivery');
        }

        $validated = $request->validate([
            'delivery_name' => ['required', 'string', 'max:120'],
            'delivery_business' => ['nullable', 'string', 'max:120'],
            'telephone' => ['required', 'string', 'max:40'],
            'address_line_1' => ['required', 'string', 'max:120'],
            'address_line_2' => ['nullable', 'string', 'max:120'],
            'address_line_3' => ['required', 'string', 'max:120'],
            'address_line_4' => ['nullable', 'string', 'max:120'],
            'address_line_5' => ['nullable', 'string', 'max:120'],
            'postcode' => ['required', 'string', 'max:20'],
        ]);

        DemoAccount::updateDeliveryAddress($addressId, [
            'name' => $validated['delivery_name'],
            'business_name' => $validated['delivery_business'] ?? '',
            'phone' => $validated['telephone'],
            'line1' => $validated['address_line_1'],
            'line2' => $validated['address_line_2'] ?? '',
            'town' => $validated['address_line_3'],
            'postcode' => strtoupper(trim($validated['postcode'])),
            'country' => 'UNITED KINGDOM',
            'is_default' => $request->boolean('default_address'),
        ]);

        return redirect()
            ->route('demo.account.delivery')
            ->with('status', 'Your delivery address has been updated.');
    }

    public function deliveryDelete(Request $request): RedirectResponse
    {
        if (! DemoAccount::isLoggedIn()) {
            return redirect()->route('demo.account.login');
        }

        $addressId = $request->string('address_id')->toString();

        if ($addressId === '' || ! DemoAccount::deleteDeliveryAddress($addressId)) {
            return redirect()
                ->route('demo.account.delivery')
                ->withErrors(['delivery' => 'This address could not be deleted. You must keep at least one delivery address.']);
        }

        return redirect()
            ->route('demo.account.delivery')
            ->with('status', 'Your delivery address has been deleted.');
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
            'club_benefits_compact' => DemoAccount::isClubBenefitsCompact(),
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
            'club_benefits_compact' => DemoAccount::isClubBenefitsCompact(),
            'promo' => DemoAccount::dashboardPromo(),
            'order' => $order,
        ]);
    }
}
