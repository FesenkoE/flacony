<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Lot;
use App\Models\Post;
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
            return response()->json(['products' => [], 'lots' => [], 'posts' => []]);
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
                'image_path_light' => $product->image_path_light,
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

        $posts = Post::search($query)
            ->query(fn ($q) => $q->with('category:id,name,slug'))
            ->take(3)
            ->get()
            ->map(fn (Post $post) => [
                'id' => $post->id,
                'slug' => $post->slug,
                'title' => $post->title,
                'title_uk' => $post->title_uk,
                'category' => $post->category?->name,
                'cover_path' => $post->cover_path,
                'cover_path_light' => $post->cover_path_light,
            ]);

        return response()->json(['products' => $products, 'lots' => $lots, 'posts' => $posts]);
    }

    public function index(Request $request): Response
    {
        $query = $request->string('q')->toString();

        $products = [];
        $lots = [];
        $posts = [];

        if ($query !== '') {
            $products = Product::search($query)
                ->query(fn ($q) => $q->with(['brand', 'variants'])
                    ->withAvg('reviews', 'rating')
                    ->withCount('reviews'))
                ->take(12)
                ->get();

            $lots = Lot::search($query)->take(12)->get();

            $posts = Post::search($query)
                ->query(fn ($q) => $q->with('category:id,name,slug'))
                ->take(12)
                ->get();
        }

        return Inertia::render('search/index', [
            'query' => $query,
            'products' => $products,
            'lots' => $lots,
            'posts' => $posts,
            'brands' => Brand::orderBy('name')->pluck('name'),
        ]);
    }
}
