<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Lot;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\PromoCode;
use App\Models\User;
use App\Notifications\NewSale;
use App\Notifications\OrderStatusChanged;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SplitCheckoutTest extends TestCase
{
    use RefreshDatabase;

    private User $buyer;

    private User $seller;

    private ProductVariant $variant;

    private Lot $lot;

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();

        $this->buyer = User::factory()->create();
        $this->seller = User::factory()->create(['name' => 'Анна']);

        $product = Product::create([
            'brand_id' => Brand::create(['name' => 'Dior', 'slug' => 'dior'])->id,
            'category_id' => Category::create(['name' => 'unisex', 'slug' => 'unisex'])->id,
            'name' => 'Sauvage', 'slug' => 'sauvage', 'is_active' => true,
        ]);
        $this->variant = ProductVariant::create(['product_id' => $product->id, 'volume_ml' => 10, 'price' => 1000, 'stock_quantity' => 5]);
        $this->lot = Lot::create([
            'user_id' => $this->seller->id, 'brand_name' => 'Creed', 'product_name' => 'Aventus',
            'photo_sprayer_path' => 'x.jpg', 'photo_batch_code_path' => 'y.jpg',
            'total_volume_ml' => 100, 'remaining_volume_ml' => 100, 'price_per_ml' => 30,
            'status' => Lot::STATUS_APPROVED,
        ]);
        PromoCode::create(['code' => 'WELCOME10', 'type' => 'percent', 'value' => 10, 'active' => true]);
    }

    private function checkout(array $cart, array $cartLots, array $overrides = [])
    {
        return $this->actingAs($this->buyer)
            ->withSession(['cart' => $cart, 'cart_lots' => $cartLots])
            ->post('/checkout', [
                'first_name' => 'Олег', 'last_name' => 'Петренко', 'email' => 'oleg@example.com',
                'phone' => '+380000000000', 'city' => 'Київ', 'address' => 'Відділення 1',
                'delivery_method' => 'np_branch', 'payment_method' => 'cod',
                ...$overrides,
            ]);
    }

    public function test_mixed_cart_becomes_one_order_per_shipper_and_promo_only_hits_flacony()
    {
        $this->checkout([$this->variant->id => 1], [$this->lot->id => 5], ['promo_code' => 'WELCOME10'])
            ->assertRedirect();

        $flacony = Order::whereNull('seller_id')->sole();
        $decant = Order::where('seller_id', $this->seller->id)->sole();

        $this->assertSame($flacony->checkout_id, $decant->checkout_id);
        $this->assertEquals(900, $flacony->total);        // 1000 − 10%
        $this->assertEquals(150, $decant->total);         // 5 ml × 30, no promo
        $this->assertNull($decant->promo_code);
        $this->assertSame(95, $this->lot->fresh()->remaining_volume_ml);

        Notification::assertSentOnDemandTimes(OrderStatusChanged::class, 2);
        Notification::assertSentTo($this->seller, NewSale::class);
    }

    public function test_promo_is_rejected_when_the_cart_has_only_decants()
    {
        $this->checkout([], [$this->lot->id => 5], ['promo_code' => 'WELCOME10'])
            ->assertSessionHasErrors('promo_code');

        $this->assertSame(0, Order::count());
    }

    public function test_decants_can_only_ship_with_nova_poshta()
    {
        $this->checkout([], [$this->lot->id => 5], ['delivery_method' => 'pickup'])
            ->assertSessionHasErrors('delivery_method');
    }

    public function test_only_the_seller_moves_their_order_along()
    {
        $this->checkout([], [$this->lot->id => 5])->assertRedirect();
        $order = Order::sole();

        $this->actingAs($this->buyer)->post("/orders/{$order->id}/status", ['status' => 'confirmed'])->assertForbidden();

        $this->actingAs($this->seller)->post("/orders/{$order->id}/status", ['status' => 'confirmed'])->assertRedirect();
        $this->actingAs($this->seller)->post("/orders/{$order->id}/status", ['status' => 'shipped', 'tracking_number' => '20450000000000'])->assertRedirect();

        $this->assertSame(Order::STATUS_SHIPPED, $order->fresh()->status);
        $this->assertSame('20450000000000', $order->fresh()->tracking_number);
        $this->actingAs($this->seller)->get("/orders/{$order->id}")->assertOk();
    }
}
