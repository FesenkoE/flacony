<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $sales = Order::where('seller_id', $request->user()->id)->latest()->get(['id', 'name', 'status', 'total', 'created_at']);
        $tab = $request->query('tab');
        $tabs = $sales->isEmpty() ? ['orders', 'lots'] : ['orders', 'sales', 'lots'];

        return Inertia::render('account/index', [
            'lots' => $request->user()->lots()->latest()->get(),
            'orders' => $request->user()->orders()->with('seller:id,name')->latest()->get(),
            'sales' => $sales,
            'activeTab' => in_array($tab, $tabs, true) ? $tab : 'orders',
        ]);
    }
}
