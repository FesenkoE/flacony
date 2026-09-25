<?php

namespace Tests\Feature;

use App\Models\Lot;
use App\Models\User;
use App\Notifications\LotModerated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class LotModerationNotificationTest extends TestCase
{
    use RefreshDatabase;

    private function pendingLot(User $seller): Lot
    {
        return Lot::create([
            'user_id' => $seller->id, 'brand_name' => 'Creed', 'product_name' => 'Aventus',
            'photo_sprayer_path' => 'x.jpg', 'photo_batch_code_path' => 'y.jpg',
            'total_volume_ml' => 100, 'remaining_volume_ml' => 100, 'price_per_ml' => 30,
            'status' => Lot::STATUS_PENDING, 'locale' => 'uk',
        ]);
    }

    public function test_seller_is_emailed_on_approval_and_rejection_but_not_on_pending()
    {
        Notification::fake();
        $seller = User::factory()->create();
        $lot = $this->pendingLot($seller);

        $lot->update(['status' => Lot::STATUS_APPROVED]);
        $lot->update(['status' => Lot::STATUS_REJECTED, 'rejection_reason' => 'Батч-код не видно']);
        $lot->update(['status' => Lot::STATUS_PENDING]);

        Notification::assertSentToTimes($seller, LotModerated::class, 2);
    }

    public function test_rejection_mail_carries_the_reason_in_the_sellers_language()
    {
        $lot = $this->pendingLot(User::factory()->create());
        $lot->update(['status' => Lot::STATUS_REJECTED, 'rejection_reason' => 'Батч-код не видно']);

        app()->setLocale('uk');
        $mail = (new LotModerated($lot))->toMail($lot->seller);

        $this->assertSame('Лот «Creed Aventus» не пройшов перевірку', $mail->subject);
        $this->assertContains('Причина: Батч-код не видно', $mail->introLines);
    }

    public function test_editing_a_rejected_lot_sends_it_back_to_moderation()
    {
        Notification::fake();
        $seller = User::factory()->create();
        $lot = $this->pendingLot($seller);
        $lot->update(['status' => Lot::STATUS_REJECTED, 'rejection_reason' => 'Нет описания']);

        $this->actingAs($seller)->put("/sellers/lots/{$lot->id}", [
            'brand_name' => 'Creed', 'product_name' => 'Aventus', 'description' => 'Батч A42',
            'total_volume_ml' => 100, 'price_per_ml' => 30,
        ])->assertRedirect();

        $this->assertSame(Lot::STATUS_PENDING, $lot->fresh()->status);
        $this->assertNull($lot->fresh()->rejection_reason);
    }
}
