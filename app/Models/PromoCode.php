<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class PromoCode extends Model
{
    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_amount',
        'max_uses',
        'used_count',
        'expires_at',
        'active',
    ];

    protected $casts = [
        'active' => 'bool',
        'expires_at' => 'datetime',
    ];

    public function setCodeAttribute(string $value): void
    {
        $this->attributes['code'] = strtoupper($value);
    }

    public static function findByCode(string $code, bool $lock = false): ?self
    {
        $query = static::where('code', strtoupper($code));

        return $lock ? $query->lockForUpdate()->first() : $query->first();
    }

    public function assertUsableFor(float $subtotal): void
    {
        if (! $this->active) {
            throw ValidationException::withMessages(['promo_code' => __('Промокод не найден.')]);
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            throw ValidationException::withMessages(['promo_code' => __('Срок действия промокода истёк.')]);
        }

        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            throw ValidationException::withMessages(['promo_code' => __('Промокод больше не действует.')]);
        }

        if ($this->min_order_amount && $subtotal < $this->min_order_amount) {
            throw ValidationException::withMessages([
                'promo_code' => __('Минимальная сумма заказа для этого кода — :amount ₴.', [
                    'amount' => $this->min_order_amount,
                ]),
            ]);
        }
    }

    public function discountFor(float $subtotal): float
    {
        $discount = $this->type === 'percent'
            ? $subtotal * (float) $this->value / 100
            : (float) $this->value;

        return round(min($discount, $subtotal), 2);
    }
}
