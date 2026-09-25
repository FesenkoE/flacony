<?php

namespace App\Http\Controllers;

use App\Models\PromoCode;
use App\Support\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PromoCodeController extends Controller
{
    public function validate(Request $request): JsonResponse
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:64']]);

        $promo = PromoCode::findByCode($data['code']);

        if (! $promo) {
            return response()->json(['message' => __('Промокод не найден.')], 422);
        }

        // Promo codes are Flacony's: they only discount catalog items, not decants.
        $subtotal = Cart::items()->where('type', 'variant')->sum('subtotal');

        if ($subtotal <= 0) {
            return response()->json(['message' => __('Промокод действует только на товары каталога Flacony.')], 422);
        }

        try {
            $promo->assertUsableFor($subtotal);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->validator->errors()->first()], 422);
        }

        return response()->json(['discount' => $promo->discountFor($subtotal)]);
    }
}
