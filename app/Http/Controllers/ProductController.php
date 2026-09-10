<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with(['brand', 'variants'])
            ->when($request->string('brand')->toString(), function ($query, $brand) {
                $query->whereRelation('brand', 'slug', $brand);
            })
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('products/index', [
            'products' => $products,
            'brands' => Brand::orderBy('name')->get(),
            'filters' => [
                'brand' => $request->string('brand')->toString() ?: null,
            ],
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load(['brand', 'category', 'variants']);

        return Inertia::render('products/show', [
            'product' => $product,
        ]);
    }
}
