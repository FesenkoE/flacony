<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Lot;
use App\Models\Product;
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
            'topAccords' => $this->topAccords(),
        ]);
    }

    private function topAccords(): array
    {
        $counts = [];

        foreach (Product::pluck('accords') as $accords) {
            foreach ($accords ?? [] as $accord) {
                $counts[$accord['name']] = ($counts[$accord['name']] ?? 0) + 1;
            }
        }

        arsort($counts);

        return collect($counts)
            ->take(10)
            ->map(fn ($count, $name) => ['name' => $name, 'count' => $count])
            ->values()
            ->all();
    }
}
