<?php

namespace Tests\Feature;

use App\Services\DemoCart;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutCompleteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['demo-preview.auth_enabled' => false]);
    }

    public function test_pay_now_redirects_to_confirmation_page(): void
    {
        DemoCart::seed();

        $this->assertFalse(DemoCart::state()['is_empty']);

        $response = $this->post(route('demo.checkout.complete'), [
            'email' => 'test@yougarden.com',
            'billing_first_name' => 'Tom',
            'billing_last_name' => 'Tester',
            'billing_address1' => '1 Test Lane',
            'billing_city' => 'Peterborough',
            'billing_postcode' => 'PE1 1AA',
            'billing_region' => 'GB',
            'payment_method' => 'card',
            'card_number' => '4242424242424242',
        ]);

        $response->assertRedirect(route('demo.checkout.confirmation'));
        $this->assertNotNull(DemoCart::lastOrder());

        $confirm = $this->get(route('demo.checkout.confirmation'));
        $confirm->assertOk();
        $confirm->assertSee('Thank you', false);
        $confirm->assertSee('Tom', false);
        $confirm->assertDontSee('No recent order', false);
    }

    public function test_confirmation_without_order_redirects_to_checkout(): void
    {
        DemoCart::seed();

        $response = $this->get(route('demo.checkout.confirmation'));

        $response->assertRedirect(route('demo.checkout'));
        $this->get(route('demo.checkout'))->assertDontSee('No recent order', false);
    }

    public function test_confirmation_without_order_or_basket_redirects_home(): void
    {
        session(['demo_cart_items' => []]);

        $response = $this->get(route('demo.checkout.confirmation'));

        $response->assertRedirect(route('demo.home'));
    }

    public function test_pay_now_json_returns_confirmation_redirect(): void
    {
        DemoCart::seed();

        $response = $this->postJson(route('demo.checkout.complete'), [
            'email' => 'test@yougarden.com',
            'billing_first_name' => 'Tom',
            'billing_last_name' => 'Tester',
            'billing_address1' => '1 Test Lane',
            'billing_city' => 'Peterborough',
            'billing_postcode' => 'PE1 1AA',
            'billing_region' => 'GB',
            'payment_method' => 'card',
            'card_number' => '4242424242424242',
        ]);

        $response->assertOk()
            ->assertJsonPath('ok', true)
            ->assertJsonPath('redirect', route('demo.checkout.confirmation'));

        $this->get(route('demo.checkout.confirmation'))
            ->assertOk()
            ->assertSee('Thank you', false);
    }
}
