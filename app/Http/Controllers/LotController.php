<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LotController extends Controller
{
    public function index(Request $request): Response
    {
        $lots = Lot::query()
            ->with('seller:id,name')
            ->where('remaining_volume_ml', '>', 0)
            ->when($request->string('brand')->toString(), fn ($query, $brand) => $query->where('brand_name', $brand))
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('lots/index', [
            'lots' => $lots,
            'brands' => Lot::where('remaining_volume_ml', '>', 0)
                ->distinct()
                ->orderBy('brand_name')
                ->pluck('brand_name'),
            'filters' => [
                'brand' => $request->string('brand')->toString() ?: null,
            ],
        ]);
    }

    public function show(Request $request, Lot $lot): Response
    {
        $lot->load('seller:id,name');

        return Inertia::render('sellers/lots/show', [
            'lot' => $lot,
            'isOwn' => $request->user()?->id === $lot->user_id,
            'sellerLotsCount' => Lot::where('user_id', $lot->user_id)
                ->where('remaining_volume_ml', '>', 0)
                ->count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('sellers/lots/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $request->user()->lots()->create([
            ...$validated,
            'remaining_volume_ml' => $validated['total_volume_ml'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Лот выставлен на витрину'),
        ]);

        return to_route('sellers.show', $request->user());
    }

    public function edit(Request $request, Lot $lot): Response
    {
        $this->authorizeOwner($request, $lot);

        return Inertia::render('sellers/lots/edit', [
            'lot' => $lot,
        ]);
    }

    public function update(Request $request, Lot $lot): RedirectResponse
    {
        $this->authorizeOwner($request, $lot);

        $validated = $request->validate($this->rules());

        $lot->update([
            ...$validated,
            'remaining_volume_ml' => min($lot->remaining_volume_ml, $validated['total_volume_ml']),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Лот обновлён'),
        ]);

        return to_route('dashboard');
    }

    public function destroy(Request $request, Lot $lot): RedirectResponse
    {
        $this->authorizeOwner($request, $lot);

        $lot->delete();

        return to_route('dashboard');
    }

    private function rules(): array
    {
        return [
            'brand_name' => ['required', 'string', 'max:255'],
            'product_name' => ['required', 'string', 'max:255'],
            'total_volume_ml' => ['required', 'integer', 'min:1'],
            'price_per_ml' => ['required', 'numeric', 'min:0.01'],
            'bulk_threshold_ml' => ['nullable', 'integer', 'min:1', 'lt:total_volume_ml'],
            'bulk_price_per_ml' => ['nullable', 'numeric', 'min:0.01', 'required_with:bulk_threshold_ml'],
        ];
    }

    private function authorizeOwner(Request $request, Lot $lot): void
    {
        if ($lot->user_id !== $request->user()->id) {
            throw new AuthorizationException;
        }
    }
}
