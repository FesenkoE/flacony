<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\Order;
use App\Models\PromoCode;
use App\Support\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * @return array<string, string>
     */
    public static function deliveryMethods(): array
    {
        return [
            'np_branch' => __('Новая Почта — отделение'),
            'np_courier' => __('Новая Почта — курьер'),
            'courier' => __('Курьер по городу'),
            'pickup' => __('Самовывоз'),
        ];
    }

    /**
     * Decant sellers ship themselves, so only Nova Poshta works once the cart has lots.
     *
     * @return array<string, string>
     */
    public static function deliveryMethodsFor(Collection $items): array
    {
        $methods = self::deliveryMethods();

        return $items->contains('type', 'lot')
            ? array_intersect_key($methods, array_flip(['np_branch', 'np_courier']))
            : $methods;
    }

    /**
     * @return array<string, string>
     */
    public static function paymentMethods(): array
    {
        return [
            'cod' => __('Оплата при получении'),
            'card' => __('Банковской картой (скоро)'),
        ];
    }

    public function index(Request $request): Response|RedirectResponse
    {
        $items = Cart::items();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index');
        }

        return Inertia::render('checkout/index', [
            'items' => $items,
            'total' => $items->sum('subtotal'),
            'deliveryMethods' => self::deliveryMethodsFor($items),
            'paymentMethods' => self::paymentMethods(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $items = Cart::items();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index');
        }

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'city' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'delivery_method' => ['required', Rule::in(array_keys(self::deliveryMethodsFor($items)))],
            'payment_method' => ['required', Rule::in(array_keys(self::paymentMethods()))],
            'promo_code' => ['nullable', 'string', 'max:64'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $orderData = [
            ...$validated,
            'name' => "{$validated['first_name']} {$validated['last_name']}",
        ];
        unset($orderData['first_name'], $orderData['last_name']);

        $orders = DB::transaction(function () use ($request, $orderData, $items) {
            // ponytail: lock lot rows so two concurrent checkouts of the same
            // lot can't both succeed with more volume than remains.
            foreach ($items->where('type', 'lot') as $item) {
                $lot = Lot::whereKey($item['lot_id'])->lockForUpdate()->first();

                if (! $lot || $lot->remaining_volume_ml < $item['volume_ml']) {
                    throw ValidationException::withMessages([
                        'items' => __('«:name» — в лоте больше нет столько мл. Обнови корзину.', [
                            'name' => $item['product_name'],
                        ]),
                    ]);
                }
            }

            // One order per shipper: Flacony (catalog, seller_id null) first,
            // then one per decant seller — each gets its own status and TTN.
            $groups = $items->groupBy(fn (array $item) => $item['seller_id'] ?? 0)->sortKeys();
            $checkoutId = (string) Str::uuid();
            $promoCode = $orderData['promo_code'] ?? null;
            unset($orderData['promo_code']);

            if (filled($promoCode) && ! $groups->has(0)) {
                throw ValidationException::withMessages(['promo_code' => __('Промокод действует только на товары каталога Flacony.')]);
            }

            return $groups->map(function (Collection $groupItems, int $sellerId) use ($request, $orderData, $checkoutId, $promoCode) {
                $subtotal = $groupItems->sum('subtotal');
                $discount = 0;

                // The promo is Flacony's, so it only discounts Flacony's order.
                if ($sellerId === 0 && filled($promoCode)) {
                    $promo = PromoCode::findByCode($promoCode, lock: true);

                    if (! $promo) {
                        throw ValidationException::withMessages(['promo_code' => __('Промокод не найден.')]);
                    }

                    $promo->assertUsableFor($subtotal);
                    $discount = $promo->discountFor($subtotal);
                    $promo->increment('used_count');
                }

                $order = Order::create([
                    ...$orderData,
                    'user_id' => $request->user()?->id,
                    'seller_id' => $sellerId ?: null,
                    'checkout_id' => $checkoutId,
                    'promo_code' => $discount > 0 ? $promoCode : null,
                    'locale' => app()->getLocale(),
                    'total' => $subtotal - $discount,
                    'discount_amount' => $discount,
                ]);

                foreach ($groupItems as $item) {
                    $order->items()->create([
                        'type' => $item['type'],
                        'product_variant_id' => $item['product_variant_id'],
                        'lot_id' => $item['lot_id'],
                        'volume_ml' => $item['type'] === 'lot' ? $item['volume_ml'] : null,
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
            })->values();
        });

        Cart::clear();

        foreach ($orders as $order) {
            $order->notifyCustomer();
            $order->notifySeller();
        }

        return redirect($orders->first()->viewUrl());
    }
}
