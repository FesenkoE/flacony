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
                'seller_id' => null,
                'seller_name' => null,
                'volume_ml' => $variant->volume_ml,
                'quantity' => $cart[$variant->id],
                'unit_price' => $variant->price,
                'brand_name' => $variant->product->brand->name,
                'product_name' => $variant->product->name,
                'detail' => "{$variant->volume_ml} мл × {$cart[$variant->id]}",
                'subtotal' => $variant->price * $cart[$variant->id],
            ]);

        $lotItems = Lot::with('seller:id,name')
            ->whereIn('id', array_keys($cartLots))
            ->get()
            ->map(fn (Lot $lot) => [
                'type' => 'lot',
                'key' => $lot->id,
                'product_variant_id' => null,
                'lot_id' => $lot->id,
                'seller_id' => $lot->user_id,
                'seller_name' => $lot->seller->name,
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
