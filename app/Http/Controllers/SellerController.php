<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller
{
    public function index(): Response
    {
        $sellers = User::query()
            ->whereHas('lots', fn ($query) => $query->where('remaining_volume_ml', '>', 0)->where('status', Lot::STATUS_APPROVED))
            ->withCount(['lots' => fn ($query) => $query->where('remaining_volume_ml', '>', 0)->where('status', Lot::STATUS_APPROVED)])
            ->get(['id', 'name']);

        return Inertia::render('sellers/index', [
            'sellers' => $sellers,
        ]);
    }

    public function show(Request $request, User $user): Response
    {
        $isOwn = $request->user()?->id === $user->id;

        $lots = $user->lots()
            ->where('remaining_volume_ml', '>', 0)
            ->when(! $isOwn, fn ($query) => $query->where('status', Lot::STATUS_APPROVED))
            ->latest()
            ->get();

        return Inertia::render('sellers/show', [
            'seller' => $user->only(['id', 'name']),
            'lots' => $lots,
        ]);
    }
}
