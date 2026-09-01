<?php

namespace Tests\Feature;

use App\Services\DemoAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountLoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'demo-preview.auth_enabled' => false,
            'demo.account_email' => 'demo',
            'demo.account_password' => 'password',
            'demo.club_account_email' => 'democlub',
            'demo.club_account_password' => 'password',
        ]);
    }

    public function test_guest_credentials_grant_access(): void
    {
        $this->post('/account/login', [
            'email' => 'demo',
            'password' => 'password',
        ])->assertRedirect(route('demo.account.home'));

        $this->get('/account')->assertOk();
        $this->assertSame('MR John Smith', DemoAccount::user()['display_name']);
    }

    public function test_club_credentials_grant_access(): void
    {
        $response = $this->post('/account/login', [
            'email' => 'democlub',
            'password' => 'password',
        ]);

        $response
            ->assertRedirect(route('demo.account.home'))
            ->assertSessionHas('demo_club_member', true);

        $this->get('/account/club-membership')
            ->assertOk()
            ->assertSee('MR R Llewellyn', false);
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        $this->post('/account/login', [
            'email' => 'demo',
            'password' => 'demo',
        ])->assertSessionHasErrors('email');

        $this->get('/account')->assertRedirect(route('demo.account.login'));
    }

    public function test_guest_login_persists_on_pdp_header(): void
    {
        $this->post('/account/login', [
            'email' => 'demo',
            'password' => 'password',
        ])->assertRedirect(route('demo.account.home'));

        $this->get('/')
            ->assertOk()
            ->assertSee('Welcome, John', false)
            ->assertSee('My Account', false);
    }

    public function test_club_login_persists_on_pdp_header(): void
    {
        $this->post('/account/login', [
            'email' => 'democlub',
            'password' => 'password',
        ])->assertRedirect(route('demo.account.home'));

        $this->get('/')
            ->assertOk()
            ->assertSee('Welcome, Richard', false)
            ->assertDontSee('Member pricing active', false);
    }

    public function test_logged_in_user_is_recognised_on_checkout(): void
    {
        $this->post('/account/login', [
            'email' => 'demo',
            'password' => 'password',
        ])->assertRedirect(route('demo.account.home'));

        $this->get('/checkout')
            ->assertOk()
            ->assertSee('Signed in as john@example.com', false)
            ->assertDontSee('Log in to your account', false);
    }

    public function test_account_login_grants_preview_access_when_gate_enabled(): void
    {
        config(['demo-preview.auth_enabled' => true]);

        $this->post('/account/login', [
            'email' => 'demo',
            'password' => 'password',
        ])->assertRedirect(route('demo.account.home'));

        $this->get('/account')->assertOk();
        $this->get('/')->assertOk();
    }
}
