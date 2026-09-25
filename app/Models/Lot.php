<?php

namespace App\Models;

use App\Notifications\LotModerated;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Lot extends Model
{
    use Searchable;

    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'user_id',
        'brand_name',
        'product_name',
        'photo_sprayer_path',
        'photo_batch_code_path',
        'description',
        'total_volume_ml',
        'remaining_volume_ml',
        'price_per_ml',
        'bulk_threshold_ml',
        'bulk_price_per_ml',
        'status',
        'rejection_reason',
        'locale',
    ];

    protected static function booted(): void
    {
        // Covers both the approve/reject table actions and the admin edit form.
        static::updated(function (Lot $lot) {
            if ($lot->wasChanged('status') && in_array($lot->status, [self::STATUS_APPROVED, self::STATUS_REJECTED], true)) {
                $lot->seller->notify((new LotModerated($lot))->locale($lot->locale));
            }
        });
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function priceForMl(float $ml): float
    {
        if ($this->bulk_threshold_ml !== null && $this->bulk_price_per_ml !== null && $ml >= $this->bulk_threshold_ml) {
            return round($ml * $this->bulk_price_per_ml, 2);
        }

        return round($ml * $this->price_per_ml, 2);
    }

    public function toSearchableArray(): array
    {
        return [
            'brand_name' => $this->brand_name,
            'product_name' => $this->product_name,
        ];
    }

    public function shouldBeSearchable(): bool
    {
        return $this->remaining_volume_ml > 0 && $this->status === self::STATUS_APPROVED;
    }
}
