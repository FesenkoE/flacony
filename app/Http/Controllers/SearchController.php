<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
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
        ]);
    }
}
