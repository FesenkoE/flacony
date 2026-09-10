<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $cart = session('cart', []);
        $cartLots = session('cart_lots', []);

        $variants = ProductVariant::with('product.brand')
            ->whereIn('id', array_keys($cart))
            ->get();

        $variantItems = $variants->map(fn (ProductVariant $variant) => [
            'type' => 'variant',
            'key' => $variant->id,
            'brand_name' => $variant->product->brand->name,
            'product_name' => $variant->product->name,
            'detail' => "{$variant->volume_ml} мл × {$cart[$variant->id]}",
            'subtotal' => $variant->price * $cart[$variant->id],
        ]);

        $lots = Lot::whereIn('id', array_keys($cartLots))->get();

        $lotItems = $lots->map(fn (Lot $lot) => [
            'type' => 'lot',
            'key' => $lot->id,
            'brand_name' => $lot->brand_name,
            'product_name' => $lot->product_name,
            'detail' => "{$cartLots[$lot->id]} мл (распив)",
            'subtotal' => $lot->priceForMl((float) $cartLots[$lot->id]),
        ]);

        $items = $variantItems->concat($lotItems)->values();

        return Inertia::render('cart/index', [
            'items' => $items,
            'total' => $items->sum('subtotal'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'variant_id' => ['required', 'exists:product_variants,id'],
        ]);

        $variant = ProductVariant::with('product.brand')->findOrFail($validated['variant_id']);

        $cart = session('cart', []);
        $cart[$variant->id] = ($cart[$variant->id] ?? 0) + 1;
        session(['cart' => $cart]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$variant->product->brand->name} — {$variant->product->name}, {$variant->volume_ml} мл добавлен в корзину",
        ]);

        return back();
    }

    public function destroy(ProductVariant $variant): RedirectResponse
    {
        $cart = session('cart', []);
        unset($cart[$variant->id]);
        session(['cart' => $cart]);

        return back();
    }

    public function storeLot(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'lot_id' => ['required', 'exists:lots,id'],
            'volume_ml' => ['required', 'numeric', 'min:0.5'],
        ]);

        $lot = Lot::findOrFail($validated['lot_id']);
        $volumeMl = min((float) $validated['volume_ml'], (float) $lot->remaining_volume_ml);

        $cartLots = session('cart_lots', []);
        $cartLots[$lot->id] = $volumeMl;
        session(['cart_lots' => $cartLots]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$lot->brand_name} — {$lot->product_name}, {$volumeMl} мл добавлен в корзину",
        ]);

        return back();
    }

    public function destroyLot(Lot $lot): RedirectResponse
    {
        $cartLots = session('cart_lots', []);
        unset($cartLots[$lot->id]);
        session(['cart_lots' => $cartLots]);

        return back();
    }
}
