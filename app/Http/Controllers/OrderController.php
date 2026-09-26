<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function show(Request $request, Order $order): Response
    {
        // The signed route already rejected bad signatures, so holding the link means buyer.
        $viaLink = $request->routeIs('orders.view');
        $userId = $request->user()?->id;
        $isBuyer = $viaLink || $order->user_id === $userId;
        $isSeller = ! $viaLink && $userId && $order->seller_id === $userId;

        abort_unless($isBuyer || $isSeller, 403);

        return Inertia::render('orders/show', [
            'order' => $order->load(['items', 'seller:id,name']),
            'isSeller' => $isSeller,
            // The other orders the same cart was split into — only the buyer sees them.
            'siblingOrders' => $isBuyer && $order->checkout_id
                ? Order::where('checkout_id', $order->checkout_id)
                    ->whereKeyNot($order->id)
                    ->with('seller:id,name')
                    ->get(['id', 'user_id', 'seller_id', 'status', 'total'])
                    ->map(fn (Order $sibling) => [...$sibling->only(['id', 'status', 'total', 'seller']), 'url' => $sibling->viewUrl()])
                : [],
            'deliveryMethodLabel' => CheckoutController::deliveryMethods()[$order->delivery_method] ?? $order->delivery_method,
            'paymentMethodLabel' => CheckoutController::paymentMethods()[$order->payment_method] ?? $order->payment_method,
        ]);
    }

    // Decant sellers move their own orders along; Flacony's go through the admin.
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->seller_id === $request->user()->id, 403);

        $validated = $request->validate([
            'status' => ['required', Rule::in([Order::STATUS_CONFIRMED, Order::STATUS_SHIPPED, Order::STATUS_DELIVERED, Order::STATUS_CANCELLED])],
            'tracking_number' => ['nullable', 'string', 'max:32'],
        ]);

        abort_unless($order->canTransitionTo($validated['status']), 422);

        $order->transitionTo($validated['status'], $validated['tracking_number'] ?? null);

        return back();
    }
}
