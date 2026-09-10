<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('home', [
            'featuredProducts' => Product::with(['brand', 'variants'])
                ->orderBy('id')
                ->take(4)
                ->get(),
            'newArrivals' => Product::with(['brand', 'variants'])
                ->orderByDesc('id')
                ->take(4)
                ->get(),
            'brands' => Brand::orderBy('name')->get(),
        ]);
    }
}
