<?php

namespace Tests\Feature;

use App\Http\Controllers\CheckoutController;
use App\Models\PromoCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class BackendLocalizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_method_labels_are_translated_per_locale()
    {
        app()->setLocale('uk');
        $this->assertSame('Нова Пошта — відділення', CheckoutController::deliveryMethods()['np_branch']);
        $this->assertSame('Оплата при отриманні', CheckoutController::paymentMethods()['cod']);

        app()->setLocale('ru');
        $this->assertSame('Новая Почта — отделение', CheckoutController::deliveryMethods()['np_branch']);
        $this->assertSame('Оплата при получении', CheckoutController::paymentMethods()['cod']);
    }

    public function test_promo_code_validation_message_is_translated_per_locale()
    {
        $promo = PromoCode::create([
            'code' => 'INACTIVE',
            'type' => 'fixed',
            'value' => 10,
            'active' => false,
        ]);

        app()->setLocale('uk');
        try {
            $promo->assertUsableFor(100);
            $this->fail('Expected a ValidationException.');
        } catch (ValidationException $e) {
            $this->assertSame('Промокод не знайдено.', $e->validator->errors()->first('promo_code'));
        }

        app()->setLocale('ru');
        try {
            $promo->assertUsableFor(100);
            $this->fail('Expected a ValidationException.');
        } catch (ValidationException $e) {
            $this->assertSame('Промокод не найден.', $e->validator->errors()->first('promo_code'));
        }
    }
}
