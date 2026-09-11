<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\Order;
use App\Support\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $items = Cart::items();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index');
        }

        return Inertia::render('checkout/index', [
            'items' => $items,
            'total' => $items->sum('subtotal'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $items = Cart::items();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'city' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
        ]);

        $order = DB::transaction(function () use ($request, $validated, $items) {
            // ponytail: lock lot rows so two concurrent checkouts of the same
            // lot can't both succeed with more volume than remains.
            foreach ($items->where('type', 'lot') as $item) {
                $lot = Lot::whereKey($item['lot_id'])->lockForUpdate()->first();

                if (! $lot || $lot->remaining_volume_ml < $item['volume_ml']) {
                    throw ValidationException::withMessages([
                        'items' => "«{$item['product_name']}» — в лоте больше нет столько мл. Обнови корзину.",
                    ]);
                }
            }

            $order = Order::create([
                ...$validated,
                'user_id' => $request->user()->id,
                'total' => $items->sum('subtotal'),
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'type' => $item['type'],
                    'product_variant_id' => $item['product_variant_id'],
                    'lot_id' => $item['lot_id'],
                    'brand_name' => $item['brand_name'],
                    'product_name' => $item['product_name'],
                    'detail' => $item['detail'],
                    'subtotal' => $item['subtotal'],
                ]);

                if ($item['type'] === 'lot') {
                    Lot::whereKey($item['lot_id'])->decrement('remaining_volume_ml', $item['volume_ml']);
                }
            }

            return $order;
        });

        Cart::clear();

        return redirect()->route('orders.show', $order);
    }
}
