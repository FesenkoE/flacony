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
use App\Notifications\OrderStatusChanged;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class GuestCheckoutTest extends TestCase
{
    use RefreshDatabase;

    private ProductVariant $variant;

    private Lot $lot;

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();

        $product = Product::create([
            'brand_id' => Brand::create(['name' => 'Dior', 'slug' => 'dior'])->id,
            'category_id' => Category::create(['name' => 'unisex', 'slug' => 'unisex'])->id,
            'name' => 'Sauvage', 'slug' => 'sauvage', 'is_active' => true,
        ]);
        $this->variant = ProductVariant::create(['product_id' => $product->id, 'volume_ml' => 10, 'price' => 1000, 'stock_quantity' => 5]);
        $this->lot = Lot::create([
            'user_id' => User::factory()->create()->id, 'brand_name' => 'Creed', 'product_name' => 'Aventus',
            'photo_sprayer_path' => 'x.jpg', 'photo_batch_code_path' => 'y.jpg',
            'total_volume_ml' => 100, 'remaining_volume_ml' => 100, 'price_per_ml' => 30,
            'status' => Lot::STATUS_APPROVED,
        ]);
        PromoCode::create(['code' => 'WELCOME10', 'type' => 'percent', 'value' => 10, 'active' => true]);
    }

    private function guestCheckout(array $overrides = [])
    {
        return $this->withSession(['cart' => [$this->variant->id => 1], 'cart_lots' => [$this->lot->id => 5]])
            ->post('/checkout', [
                'first_name' => 'Олег', 'last_name' => 'Петренко', 'email' => 'guest@example.com',
                'phone' => '+380000000000', 'city' => 'Київ', 'address' => 'Відділення 1',
                'delivery_method' => 'np_branch', 'payment_method' => 'cod',
                ...$overrides,
            ]);
    }

    public function test_guest_can_open_checkout()
    {
        $this->withSession(['cart' => [$this->variant->id => 1]])->get('/checkout')->assertOk();
    }

    public function test_guest_order_has_no_user_and_is_reached_by_signed_link()
    {
        $response = $this->guestCheckout(['promo_code' => 'WELCOME10']);

        $orders = Order::orderBy('id')->get();
        $this->assertCount(2, $orders);                     // split per shipper works for guests too
        $this->assertTrue($orders->every(fn (Order $o) => $o->user_id === null));
        $this->assertEquals(900, $orders->first()->total);  // promo applied to Flacony's order

        $url = $orders->first()->viewUrl();
        $this->assertStringContainsString('signature=', $url);
        $response->assertRedirect($url);

        $this->get($url)->assertOk()->assertInertia(fn ($page) => $page
            ->where('isSeller', false)
            ->where('siblingOrders.0.url', $orders->last()->viewUrl()));

        Notification::assertSentOnDemand(OrderStatusChanged::class,
            fn ($n, $channels, $notifiable) => str_contains($n->toMail($notifiable)->actionUrl, 'signature='));
    }

    public function test_guest_order_is_forbidden_without_valid_signature()
    {
        $this->guestCheckout();
        $order = Order::first();

        $this->get("/orders/{$order->id}/view")->assertForbidden();
        $this->get($order->viewUrl().'x')->assertForbidden();
        $this->get("/orders/{$order->id}")->assertRedirect('/login');
        $this->actingAs(User::factory()->create())->get("/orders/{$order->id}")->assertForbidden();
    }

    public function test_guest_checkout_is_throttled()
    {
        foreach (range(1, 10) as $i) {
            $this->post('/checkout')->assertRedirect();
        }

        $this->post('/checkout')->assertTooManyRequests();
    }
}
