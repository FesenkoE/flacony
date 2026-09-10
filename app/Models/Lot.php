<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lot extends Model
{
    protected $fillable = [
        'user_id',
        'brand_name',
        'product_name',
        'total_volume_ml',
        'remaining_volume_ml',
        'price_per_ml',
        'bulk_threshold_ml',
        'bulk_price_per_ml',
    ];

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
}
