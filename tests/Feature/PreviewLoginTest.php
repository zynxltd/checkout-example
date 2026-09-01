<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PreviewLoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'demo-preview.auth_enabled' => true,
            'demo-preview.username' => 'web',
            'demo-preview.password' => 'letmein2',
        ]);
    }

    public function test_home_redirects_to_login_when_unauthenticated(): void
    {
        $this->get('/')
            ->assertRedirect(route('demo.login', ['redirect' => url('/')]));
    }

    public function test_valid_credentials_grant_access(): void
    {
        $this->post('/login', [
            'username' => 'web',
            'password' => 'letmein2',
        ])->assertRedirect(route('demo.home'));

        $this->get('/')->assertOk();
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        $this->post('/login', [
            'username' => 'web',
            'password' => 'wrong',
        ])->assertSessionHasErrors('username');

        $this->get('/')->assertRedirect();
    }

    public function test_auth_can_be_disabled_via_config(): void
    {
        config(['demo-preview.auth_enabled' => false]);

        $this->get('/')->assertOk();
    }

    public function test_demo_account_credentials_grant_preview_and_account_access(): void
    {
        $this->post('/login', [
            'username' => 'demo',
            'password' => 'password',
            'redirect' => route('demo.account.home'),
        ])->assertRedirect(route('demo.account.home'));

        $this->get('/account')->assertOk();
        $this->get('/')->assertOk();
    }
}
