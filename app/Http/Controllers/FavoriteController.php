<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with(['brand', 'variants'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->whereHas('favorites', fn ($q) => $q->where('user_id', $request->user()->id))
            ->get();

        return Inertia::render('favorites/index', [
            'products' => $products,
        ]);
    }

    public function toggle(Request $request, Product $product): RedirectResponse
    {
        $favorite = Favorite::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
        } else {
            Favorite::create(['user_id' => $request->user()->id, 'product_id' => $product->id]);
        }

        return back();
    }
}
