<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $minPrice = $request->integer('min_price') ?: null;
        $maxPrice = $request->integer('max_price') ?: null;

        $products = Product::query()
            ->with(['brand', 'variants'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->when($request->string('brand')->toString(), function ($query, $brand) {
                $query->whereRelation('brand', 'slug', $brand);
            })
            ->when($request->string('category')->toString(), function ($query, $category) {
                $query->whereRelation('category', 'slug', $category);
            })
            ->when($minPrice || $maxPrice, function ($query) use ($minPrice, $maxPrice) {
                $query->whereHas('variants', function ($q) use ($minPrice, $maxPrice) {
                    $q->when($minPrice, fn ($q) => $q->where('price', '>=', $minPrice))
                        ->when($maxPrice, fn ($q) => $q->where('price', '<=', $maxPrice));
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('products/index', [
            'products' => $products,
            'brands' => Brand::orderBy('name')->get(),
            'categories' => Category::orderBy('name')->get(),
            'filters' => [
                'brand' => $request->string('brand')->toString() ?: null,
                'category' => $request->string('category')->toString() ?: null,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
            ],
        ]);
    }

    public function show(Request $request, Product $product): Response
    {
        $product->load(['brand', 'category', 'variants']);
        $product->loadAvg('reviews', 'rating');
        $product->load(['reviews' => fn ($q) => $q->with('user')->latest()]);

        return Inertia::render('products/show', [
            'product' => $product,
            'myReview' => $request->user()
                ? $product->reviews->firstWhere('user_id', $request->user()->id)
                : null,
        ]);
    }
}
