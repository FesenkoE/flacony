<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Lot;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    // ponytail: separate lightweight JSON endpoint for the header's live
    // dropdown (a handful of rows, no relations beyond what's rendered) —
    // keeps it fast to debounce on every keystroke, distinct from index()'s
    // full paginated grid with reviews/variants for the /search page.
    public function live(Request $request): JsonResponse
    {
        $query = $request->string('q')->toString();

        if ($query === '') {
            return response()->json(['products' => [], 'lots' => []]);
        }

        $products = Product::search($query)
            ->query(fn ($q) => $q->with('brand', 'variants'))
            ->take(5)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'brand' => $product->brand->name,
                'image_path' => $product->image_path,
                'price' => $product->variants->min('price'),
            ]);

        $lots = Lot::search($query)
            ->take(4)
            ->get()
            ->map(fn (Lot $lot) => [
                'id' => $lot->id,
                'brand_name' => $lot->brand_name,
                'product_name' => $lot->product_name,
                'price_per_ml' => $lot->price_per_ml,
            ]);

        return response()->json(['products' => $products, 'lots' => $lots]);
    }

    public function index(Request $request): Response
    {
        $query = $request->string('q')->toString();

        $products = [];
        $lots = [];

        if ($query !== '') {
            $products = Product::search($query)
                ->query(fn ($q) => $q->with(['brand', 'variants'])
                    ->withAvg('reviews', 'rating')
                    ->withCount('reviews'))
                ->take(12)
                ->get();

            $lots = Lot::search($query)->take(12)->get();
        }

        return Inertia::render('search/index', [
            'query' => $query,
            'products' => $products,
            'lots' => $lots,
            'brands' => Brand::orderBy('name')->pluck('name'),
        ]);
    }
}
