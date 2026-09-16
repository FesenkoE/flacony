<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Lot;
use App\Models\Product;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LotController extends Controller
{
    public function index(Request $request): Response
    {
        $brands = $request->array('brand');

        $lots = Lot::query()
            ->with('seller:id,name')
            ->where('remaining_volume_ml', '>', 0)
            ->where('status', Lot::STATUS_APPROVED)
            ->when($brands, fn ($query) => $query->whereIn('brand_name', $brands))
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('lots/index', [
            'lots' => $lots,
            'brands' => Lot::where('remaining_volume_ml', '>', 0)
                ->where('status', Lot::STATUS_APPROVED)
                ->distinct()
                ->orderBy('brand_name')
                ->pluck('brand_name'),
            'filters' => [
                'brand' => $brands,
            ],
        ]);
    }

    public function show(Request $request, Lot $lot): Response
    {
        $isOwn = $request->user()?->id === $lot->user_id;

        if (! $isOwn && $lot->status !== Lot::STATUS_APPROVED) {
            abort(404);
        }

        $lot->load('seller:id,name');

        return Inertia::render('sellers/lots/show', [
            'lot' => $lot,
            'isOwn' => $isOwn,
            'sellerLotsCount' => Lot::where('user_id', $lot->user_id)
                ->where('remaining_volume_ml', '>', 0)
                ->where('status', Lot::STATUS_APPROVED)
                ->count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('sellers/lots/create', [
            'brands' => $this->brandOptions(),
            'productNames' => $this->productNameOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            ...$this->rules(),
            'photo_sprayer' => ['required', 'image', 'max:5120'],
            'photo_batch_code' => ['required', 'image', 'max:5120'],
        ]);

        $request->user()->lots()->create([
            ...$validated,
            'photo_sprayer_path' => $request->file('photo_sprayer')->store('lots', 'public'),
            'photo_batch_code_path' => $request->file('photo_batch_code')->store('lots', 'public'),
            'remaining_volume_ml' => $validated['total_volume_ml'],
            'status' => Lot::STATUS_PENDING,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Лот отправлен на модерацию'),
        ]);

        return to_route('sellers.show', $request->user());
    }

    public function edit(Request $request, Lot $lot): Response
    {
        $this->authorizeOwner($request, $lot);

        return Inertia::render('sellers/lots/edit', [
            'lot' => $lot,
            'brands' => $this->brandOptions(),
            'productNames' => $this->productNameOptions(),
        ]);
    }

    public function update(Request $request, Lot $lot): RedirectResponse
    {
        $this->authorizeOwner($request, $lot);

        $validated = $request->validate([
            ...$this->rules(),
            'photo_sprayer' => ['nullable', 'image', 'max:5120'],
            'photo_batch_code' => ['nullable', 'image', 'max:5120'],
        ]);

        $photoFields = [
            'photo_sprayer' => 'photo_sprayer_path',
            'photo_batch_code' => 'photo_batch_code_path',
        ];

        $oldPaths = [];
        $newPhotoPaths = [];

        foreach ($photoFields as $inputName => $column) {
            if ($request->hasFile($inputName)) {
                $oldPaths[] = $lot->{$column};
                $newPhotoPaths[$column] = $request->file($inputName)->store('lots', 'public');
            }
        }

        $lot->update([
            ...$validated,
            'remaining_volume_ml' => min($lot->remaining_volume_ml, $validated['total_volume_ml']),
            ...$newPhotoPaths,
            ...($newPhotoPaths ? ['status' => Lot::STATUS_PENDING, 'rejection_reason' => null] : []),
        ]);

        foreach ($oldPaths as $path) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Лот обновлён'),
        ]);

        return to_route('dashboard');
    }

    public function destroy(Request $request, Lot $lot): RedirectResponse
    {
        $this->authorizeOwner($request, $lot);

        foreach ([$lot->photo_sprayer_path, $lot->photo_batch_code_path] as $path) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
        }

        $lot->delete();

        return to_route('dashboard');
    }

    private function rules(): array
    {
        return [
            'brand_name' => ['required', 'string', 'max:255'],
            'product_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
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

    private function brandOptions(): array
    {
        return Brand::pluck('name')
            ->merge(Lot::distinct()->pluck('brand_name'))
            ->unique()
            ->sort()
            ->values()
            ->all();
    }

    private function productNameOptions(): array
    {
        return Product::pluck('name')
            ->merge(Lot::distinct()->pluck('product_name'))
            ->unique()
            ->sort()
            ->values()
            ->all();
    }
}
