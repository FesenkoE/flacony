<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\ProductVariant;
use App\Support\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $items = Cart::items();

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
            'message' => __(':brand — :name, :volume мл добавлен в корзину', [
                'brand' => $variant->product->brand->name,
                'name' => $variant->product->name,
                'volume' => $variant->volume_ml,
            ]),
        ]);

        return back();
    }

    public function update(Request $request, ProductVariant $variant): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:99'],
        ]);

        $cart = session('cart', []);

        if ($validated['quantity'] === 0) {
            unset($cart[$variant->id]);
        } else {
            $cart[$variant->id] = $validated['quantity'];
        }

        session(['cart' => $cart]);

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
            'message' => __(':brand — :name, :volume мл добавлен в корзину', [
                'brand' => $lot->brand_name,
                'name' => $lot->product_name,
                'volume' => $volumeMl,
            ]),
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
