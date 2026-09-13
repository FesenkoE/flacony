<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Lot;
use App\Models\Product;
use App\Models\PromoCode;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('home', [
            'featuredProducts' => Product::with(['brand', 'variants'])
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->orderBy('id')
                ->take(5)
                ->get(),
            'newArrivals' => Product::with(['brand', 'variants'])
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->orderByDesc('id')
                ->take(5)
                ->get(),
            'brands' => Brand::orderBy('name')->get(),
            'lots' => Lot::with('seller:id,name')
                ->where('remaining_volume_ml', '>', 0)
                ->latest()
                ->take(4)
                ->get(),
            'promoCode' => PromoCode::where('active', true)->first(['code', 'type', 'value']),
            'activeLotsCount' => Lot::where('remaining_volume_ml', '>', 0)->count(),
        ]);
    }
}
