<?php

namespace App\Models;

use App\Notifications\OrderStatusChanged;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class Order extends Model
{
    public const STATUS_NEW = 'new';

    public const STATUS_CONFIRMED = 'confirmed';

    public const STATUS_SHIPPED = 'shipped';

    public const STATUS_DELIVERED = 'delivered';

    public const STATUS_CANCELLED = 'cancelled';

    // RU labels double as translation keys (lang/uk.json) on the storefront.
    public const STATUS_LABELS = [
        self::STATUS_NEW => 'Новый',
        self::STATUS_CONFIRMED => 'Подтверждён',
        self::STATUS_SHIPPED => 'Отправлен',
        self::STATUS_DELIVERED => 'Доставлен',
        self::STATUS_CANCELLED => 'Отменён',
    ];

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'city',
        'address',
        'delivery_method',
        'payment_method',
        'promo_code',
        'discount_amount',
        'comment',
        'status',
        'locale',
        'tracking_number',
        'total',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function canTransitionTo(string $status): bool
    {
        return in_array($status, match ($this->status) {
            self::STATUS_NEW => [self::STATUS_CONFIRMED, self::STATUS_CANCELLED],
            self::STATUS_CONFIRMED => [self::STATUS_SHIPPED, self::STATUS_CANCELLED],
            self::STATUS_SHIPPED => [self::STATUS_DELIVERED],
            default => [],
        }, true);
    }

    public function transitionTo(string $status, ?string $trackingNumber = null): void
    {
        abort_unless($this->canTransitionTo($status), 422);

        DB::transaction(function () use ($status, $trackingNumber) {
            // Cancelling hands the decanted ml back to the seller's lot.
            if ($status === self::STATUS_CANCELLED) {
                foreach ($this->items()->where('type', 'lot')->whereNotNull('volume_ml')->get() as $item) {
                    Lot::whereKey($item->lot_id)->increment('remaining_volume_ml', $item->volume_ml);
                }
            }

            $this->update([
                'status' => $status,
                'tracking_number' => $trackingNumber ?? $this->tracking_number,
            ]);
        });

        if ($status !== self::STATUS_DELIVERED) {
            $this->notifyCustomer();
        }
    }

    public function notifyCustomer(): void
    {
        // Orders placed before checkout collected an email have none.
        if (blank($this->email)) {
            return;
        }

        // ponytail: sent synchronously — QUEUE_CONNECTION=database needs a running
        // worker; switch to ShouldQueue once one is set up in production.
        Notification::route('mail', $this->email)
            ->notify((new OrderStatusChanged($this))->locale($this->locale));
    }
}
