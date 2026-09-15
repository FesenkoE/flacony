<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    private const SORTS = ['newest', 'price_asc', 'price_desc', 'rating'];

    public function index(Request $request): Response
    {
        $minPrice = $request->integer('min_price') ?: null;
        $maxPrice = $request->integer('max_price') ?: null;
        $brands = $request->array('brand');
        $categories = $request->array('category');
        $concentrations = $request->array('concentration');
        $accords = $request->array('accord');
        $volumes = $request->array('volume');
        $sort = in_array($request->string('sort')->toString(), self::SORTS, true)
            ? $request->string('sort')->toString()
            : 'newest';

        $products = Product::query()
            ->with(['brand', 'variants'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->withMin('variants', 'price')
            ->when($brands, fn ($query) => $query->whereRelation('brand', fn ($q) => $q->whereIn('slug', $brands)))
            ->when($categories, fn ($query) => $query->whereRelation('category', fn ($q) => $q->whereIn('slug', $categories)))
            ->when($concentrations, fn ($query) => $query->whereIn('concentration', $concentrations))
            ->when($accords, function ($query) use ($accords) {
                $query->where(function ($q) use ($accords) {
                    foreach ($accords as $accord) {
                        $q->orWhereJsonContains('accords', ['name' => $accord]);
                    }
                });
            })
            ->when($volumes, fn ($query) => $query->whereHas('variants', fn ($q) => $q->whereIn('volume_ml', $volumes)))
            ->when($minPrice || $maxPrice, function ($query) use ($minPrice, $maxPrice) {
                $query->whereHas('variants', function ($q) use ($minPrice, $maxPrice) {
                    $q->when($minPrice, fn ($q) => $q->where('price', '>=', $minPrice))
                        ->when($maxPrice, fn ($q) => $q->where('price', '<=', $maxPrice));
                });
            })
            ->when($sort === 'price_asc', fn ($query) => $query->orderBy('variants_min_price'))
            ->when($sort === 'price_desc', fn ($query) => $query->orderByDesc('variants_min_price'))
            ->when($sort === 'rating', fn ($query) => $query->orderByDesc('reviews_avg_rating'))
            ->when($sort === 'newest', fn ($query) => $query->latest())
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('products/index', [
            'products' => $products,
            'brands' => Brand::orderBy('name')->get(),
            'categories' => Category::orderBy('name')->get(),
            'concentrations' => Product::query()
                ->whereNotNull('concentration')
                ->distinct()
                ->orderBy('concentration')
                ->pluck('concentration'),
            'volumes' => ProductVariant::query()
                ->distinct()
                ->orderBy('volume_ml')
                ->pluck('volume_ml'),
            // ponytail: full scan + PHP-side flatten of every product's accords JSON to build the facet
            // option list. Fine while the catalog is small; once it's in the thousands, replace with a
            // normalized accords table (or a DB-level json aggregation) so this stops scaling with row count.
            'accords' => Product::query()
                ->whereNotNull('accords')
                ->pluck('accords')
                ->flatten(1)
                ->pluck('name')
                ->unique()
                ->sort()
                ->values(),
            'filters' => [
                'brand' => $brands,
                'category' => $categories,
                'concentration' => $concentrations,
                'accord' => $accords,
                'volume' => $volumes,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'sort' => $sort,
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
