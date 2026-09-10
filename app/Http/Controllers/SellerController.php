<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller
{
    public function index(): Response
    {
        $sellers = User::query()
            ->whereHas('lots', fn ($query) => $query->where('remaining_volume_ml', '>', 0))
            ->withCount(['lots' => fn ($query) => $query->where('remaining_volume_ml', '>', 0)])
            ->get(['id', 'name']);

        return Inertia::render('sellers/index', [
            'sellers' => $sellers,
        ]);
    }

    public function show(User $user): Response
    {
        $lots = $user->lots()
            ->where('remaining_volume_ml', '>', 0)
            ->latest()
            ->get();

        return Inertia::render('sellers/show', [
            'seller' => $user->only(['id', 'name']),
            'lots' => $lots,
        ]);
    }
}
