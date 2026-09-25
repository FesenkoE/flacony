<?php

namespace Tests\Feature;

use App\Models\Lot;
use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderStatusChanged;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class OrderStatusTest extends TestCase
{
    use RefreshDatabase;

    private function orderWithLot(int $orderedMl = 5): array
    {
        $user = User::factory()->create();
        $lot = Lot::create([
            'user_id' => $user->id, 'brand_name' => 'Creed', 'product_name' => 'Aventus',
            'photo_sprayer_path' => 'x.jpg', 'photo_batch_code_path' => 'y.jpg',
            'total_volume_ml' => 100, 'remaining_volume_ml' => 100 - $orderedMl,
            'price_per_ml' => 30, 'status' => Lot::STATUS_APPROVED,
        ]);
        $order = Order::create([
            'user_id' => $user->id, 'name' => 'Анна', 'email' => 'anna@example.com',
            'phone' => '+380000000000', 'city' => 'Київ', 'address' => 'Відділення 1',
            'delivery_method' => 'np_branch', 'payment_method' => 'cod',
            'locale' => 'uk', 'total' => 150,
        ]);
        $order->items()->create([
            'type' => 'lot', 'lot_id' => $lot->id, 'volume_ml' => $orderedMl,
            'brand_name' => 'Creed', 'product_name' => 'Aventus',
            'detail' => "{$orderedMl} мл (распив)", 'subtotal' => 150,
        ]);

        return [$order->refresh(), $lot];
    }

    public function test_cancelling_returns_ml_to_the_lot_and_emails_the_buyer()
    {
        Notification::fake();
        [$order, $lot] = $this->orderWithLot(5);

        $order->transitionTo(Order::STATUS_CANCELLED);

        $this->assertSame(Order::STATUS_CANCELLED, $order->fresh()->status);
        $this->assertSame(100, $lot->fresh()->remaining_volume_ml);
        Notification::assertSentOnDemand(OrderStatusChanged::class);
    }

    public function test_shipping_stores_tracking_number_and_mails_in_the_order_locale()
    {
        [$order] = $this->orderWithLot();
        $order->transitionTo(Order::STATUS_CONFIRMED);

        $order->transitionTo(Order::STATUS_SHIPPED, '20450000000000');

        $this->assertSame('20450000000000', $order->fresh()->tracking_number);

        app()->setLocale('uk');
        $mail = (new OrderStatusChanged($order->fresh()))->toMail($order);
        $this->assertSame("Замовлення №{$order->id} відправлено", $mail->subject);
        $this->assertSame('https://tracking.novaposhta.ua/#/uk/20450000000000', $mail->actionUrl);
    }

    public function test_legacy_order_without_email_changes_status_without_mailing()
    {
        Notification::fake();
        [$order] = $this->orderWithLot();
        $order->update(['email' => '']);

        $order->transitionTo(Order::STATUS_CONFIRMED);

        $this->assertSame(Order::STATUS_CONFIRMED, $order->fresh()->status);
        Notification::assertNothingSent();
    }

    public function test_invalid_transitions_are_rejected()
    {
        [$order] = $this->orderWithLot();

        $this->assertFalse($order->canTransitionTo(Order::STATUS_DELIVERED));
        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);
        $order->transitionTo(Order::STATUS_DELIVERED);
    }

    public function test_buyer_sees_status_and_tracking_on_the_order_page()
    {
        Notification::fake();
        [$order] = $this->orderWithLot();
        $order->transitionTo(Order::STATUS_CONFIRMED);
        $order->transitionTo(Order::STATUS_SHIPPED, '20450000000000');

        $this->actingAs($order->user)
            ->get("/orders/{$order->id}")
            ->assertInertia(fn ($page) => $page
                ->where('order.status', Order::STATUS_SHIPPED)
                ->where('order.tracking_number', '20450000000000'));
    }
}
