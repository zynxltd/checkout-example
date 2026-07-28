<?php

namespace Tests\Feature;

use App\Services\DemoCart;
use Tests\TestCase;

class ClubBarAfterRemoveTest extends TestCase
{
    public function test_removing_club_restores_join_club_banner(): void
    {
        $this->withSession([
            'demo_cart_items' => [
                ['sku' => '401842', 'qty' => 1],
                ['sku' => 'PLP002', 'qty' => 1],
            ],
            'demo_club_member' => false,
            'demo_club_in_cart' => false,
        ]);

        $before = $this->getJson('/cart/fragment');
        $before->assertOk();
        $this->assertStringContainsString('yg-club-bar', $before->json('html'));
        $this->assertGreaterThan(0, $before->json('cart.club_savings'));
        $this->assertFalse($before->json('cart.club_in_cart'));

        $add = $this->postJson('/cart/club', ['sku' => DemoCart::CLUB_SKU_AUTO]);
        $add->assertOk();
        $this->assertTrue($add->json('cart.club_in_cart'));
        $this->assertStringNotContainsString('yg-club-bar', $add->json('html'));
        $this->assertGreaterThan(0, $add->json('cart.club_member_savings'));
        $this->assertStringContainsString('yg-club-savings', $add->json('html'));

        $remove = $this->postJson('/cart/remove', ['sku' => DemoCart::CLUB_SKU_AUTO]);
        $remove->assertOk();
        $this->assertFalse($remove->json('cart.club_in_cart'));
        $this->assertFalse($remove->json('cart.club_member'));
        $this->assertGreaterThan(0, $remove->json('cart.club_savings'));
        $this->assertStringContainsString('yg-club-bar', $remove->json('html'));
        $this->assertStringNotContainsString('yg-club-savings-banner', $remove->json('html'));
        $this->assertStringNotContainsString('yg-club-savings-strip', $remove->json('html'));

        $after = $this->getJson('/cart/fragment');
        $after->assertOk();
        $this->assertStringContainsString('yg-club-bar', $after->json('html'));
    }

    public function test_club_in_cart_applies_member_pricing_without_club_price_key(): void
    {
        $this->withSession([
            'demo_cart_items' => [
                ['sku' => '401842', 'qty' => 1],
            ],
            'demo_club_member' => false,
        ]);

        $add = $this->postJson('/cart/club', ['sku' => DemoCart::CLUB_SKU_AUTO]);
        $add->assertOk();

        $geranium = collect($add->json('cart.items'))->firstWhere('sku', '401842');
        $this->assertNotNull($geranium);
        $this->assertEqualsWithDelta(8.49, (float) $geranium['unit_price'], 0.001);
        $this->assertEqualsWithDelta(1.50, (float) $add->json('cart.club_member_savings'), 0.001);
    }
}
