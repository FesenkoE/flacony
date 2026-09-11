<?php

namespace App\Support;

use App\Models\Lot;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;

class Cart
{
    public static function items(): Collection
    {
        $cart = session('cart', []);
        $cartLots = session('cart_lots', []);

        $variantItems = ProductVariant::with('product.brand')
            ->whereIn('id', array_keys($cart))
            ->get()
            ->map(fn (ProductVariant $variant) => [
                'type' => 'variant',
                'key' => $variant->id,
                'product_variant_id' => $variant->id,
                'lot_id' => null,
                'volume_ml' => null,
                'brand_name' => $variant->product->brand->name,
                'product_name' => $variant->product->name,
                'detail' => "{$variant->volume_ml} мл × {$cart[$variant->id]}",
                'subtotal' => $variant->price * $cart[$variant->id],
            ]);

        $lotItems = Lot::whereIn('id', array_keys($cartLots))
            ->get()
            ->map(fn (Lot $lot) => [
                'type' => 'lot',
                'key' => $lot->id,
                'product_variant_id' => null,
                'lot_id' => $lot->id,
                'volume_ml' => (float) $cartLots[$lot->id],
                'brand_name' => $lot->brand_name,
                'product_name' => $lot->product_name,
                'detail' => "{$cartLots[$lot->id]} мл (распив)",
                'subtotal' => $lot->priceForMl((float) $cartLots[$lot->id]),
            ]);

        return $variantItems->concat($lotItems)->values();
    }

    public static function clear(): void
    {
        session()->forget(['cart', 'cart_lots']);
    }
}
