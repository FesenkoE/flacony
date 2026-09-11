<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class NovaPoshta
{
    private const ENDPOINT = 'https://api.novaposhta.ua/v2.0/json/';

    /**
     * @return array<int, array{ref: string, name: string, area: string}>
     */
    public function searchCities(string $query): array
    {
        if (mb_strlen($query) < 2) {
            return [];
        }

        $cacheKey = 'nova_poshta:cities:'.mb_strtolower($query);

        return Cache::remember($cacheKey, now()->addDay(), function () use ($query) {
            $data = $this->call('Address', 'getCities', [
                'FindByString' => $query,
                'Limit' => 15,
            ]);

            return collect($data)
                ->map(fn (array $city) => [
                    'ref' => $city['Ref'],
                    'name' => $city['Description'],
                    'area' => $city['AreaDescription'] ?? '',
                ])
                ->all();
        });
    }

    /**
     * @return array<int, array{ref: string, description: string, number: string}>
     */
    public function warehouses(string $cityRef): array
    {
        $cacheKey = 'nova_poshta:warehouses:'.$cityRef;

        return Cache::remember($cacheKey, now()->addDay(), function () use ($cityRef) {
            $data = $this->call('AddressGeneral', 'getWarehouses', [
                'CityRef' => $cityRef,
                'Limit' => 200,
            ]);

            return collect($data)
                ->map(fn (array $warehouse) => [
                    'ref' => $warehouse['Ref'],
                    'description' => $warehouse['Description'],
                    'number' => $warehouse['Number'] ?? '',
                ])
                ->all();
        });
    }

    /**
     * @param  array<string, mixed>  $methodProperties
     * @return array<int, array<string, mixed>>
     */
    private function call(string $modelName, string $calledMethod, array $methodProperties): array
    {
        $response = Http::timeout(10)->post(self::ENDPOINT, [
            'apiKey' => config('services.nova_poshta.key'),
            'modelName' => $modelName,
            'calledMethod' => $calledMethod,
            'methodProperties' => $methodProperties,
        ]);

        if (! $response->successful()) {
            return [];
        }

        $json = $response->json();

        if (! ($json['success'] ?? false)) {
            return [];
        }

        return $json['data'] ?? [];
    }
}
