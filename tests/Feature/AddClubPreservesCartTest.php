<?php

namespace Tests\Feature;

use App\Services\DemoCart;
use Tests\TestCase;

class AddClubPreservesCartTest extends TestCase
{
    public function test_add_club_appends_membership_without_removing_other_lines(): void
    {
        $this->withSession([
            'demo_cart_items' => [
                ['sku' => '501001', 'qty' => 1],
                ['sku' => '501002', 'qty' => 2],
            ],
            'demo_club_member' => false,
        ]);

        $response = $this->postJson('/cart/club', ['sku' => DemoCart::CLUB_SKU_AUTO]);

        $response->assertOk();
        $cart = $response->json('cart');
        $this->assertNotNull($cart);
        $this->assertSame(4, $cart['item_count']);

        $skus = collect($cart['items'])->pluck('sku')->all();
        $this->assertContains('501001', $skus);
        $this->assertContains('501002', $skus);
        $this->assertContains(DemoCart::CLUB_SKU_AUTO, $skus);

        $sessionItems = session('demo_cart_items');
        $this->assertCount(3, $sessionItems);
    }

    public function test_add_club_on_empty_cart_only_adds_membership(): void
    {
        $this->withSession([
            'demo_cart_items' => [],
            'demo_club_member' => false,
        ]);

        $response = $this->postJson('/cart/club', ['sku' => DemoCart::CLUB_SKU_AUTO]);

        $response->assertOk();
        $cart = $response->json('cart');
        $this->assertSame(1, $cart['item_count']);
        $this->assertSame(DemoCart::CLUB_SKU_AUTO, $cart['items'][0]['sku']);
    }
}
