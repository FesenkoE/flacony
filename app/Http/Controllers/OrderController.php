<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        return Inertia::render('orders/show', [
            'order' => $order->load('items'),
            'deliveryMethodLabel' => CheckoutController::DELIVERY_METHODS[$order->delivery_method] ?? $order->delivery_method,
            'paymentMethodLabel' => CheckoutController::PAYMENT_METHODS[$order->payment_method] ?? $order->payment_method,
        ]);
    }
}
