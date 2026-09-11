<?php

namespace App\Http\Controllers;

use App\Services\NovaPoshta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NovaPoshtaController extends Controller
{
    public function cities(Request $request, NovaPoshta $novaPoshta): JsonResponse
    {
        $query = $request->string('q')->toString();

        return response()->json($novaPoshta->searchCities($query));
    }

    public function warehouses(Request $request, NovaPoshta $novaPoshta): JsonResponse
    {
        $validated = $request->validate([
            'city_ref' => ['required', 'string'],
        ]);

        return response()->json($novaPoshta->warehouses($validated['city_ref']));
    }
}
