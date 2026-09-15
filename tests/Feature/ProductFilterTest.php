<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_multi_select_brand_and_concentration_filters_narrow_results()
    {
        $brandA = Brand::create(['name' => 'Dior', 'slug' => 'dior']);
        $brandB = Brand::create(['name' => 'Byredo', 'slug' => 'byredo']);
        $category = Category::create(['name' => 'unisex', 'slug' => 'unisex']);

        $sauvage = Product::create([
            'brand_id' => $brandA->id, 'category_id' => $category->id,
            'name' => 'Sauvage', 'slug' => 'sauvage', 'is_active' => true,
            'concentration' => 'EDT', 'accords' => [['name' => 'Свежий', 'percent' => 100]],
        ]);
        $gypsy = Product::create([
            'brand_id' => $brandB->id, 'category_id' => $category->id,
            'name' => 'Gypsy Water', 'slug' => 'gypsy-water', 'is_active' => true,
            'concentration' => 'EDP', 'accords' => [['name' => 'Древесный', 'percent' => 100]],
        ]);
        ProductVariant::create(['product_id' => $sauvage->id, 'volume_ml' => 100, 'price' => 450, 'stock_quantity' => 5]);
        ProductVariant::create(['product_id' => $gypsy->id, 'volume_ml' => 50, 'price' => 500, 'stock_quantity' => 5]);

        $response = $this->get('/products?'.http_build_query(['brand' => ['dior', 'byredo'], 'concentration' => ['EDT']]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Sauvage')
        );
    }

    public function test_price_sort_orders_by_cheapest_variant()
    {
        $brand = Brand::create(['name' => 'Dior', 'slug' => 'dior']);
        $category = Category::create(['name' => 'unisex', 'slug' => 'unisex']);

        $cheap = Product::create(['brand_id' => $brand->id, 'category_id' => $category->id, 'name' => 'Cheap', 'slug' => 'cheap', 'is_active' => true]);
        $pricey = Product::create(['brand_id' => $brand->id, 'category_id' => $category->id, 'name' => 'Pricey', 'slug' => 'pricey', 'is_active' => true]);
        ProductVariant::create(['product_id' => $cheap->id, 'volume_ml' => 50, 'price' => 100, 'stock_quantity' => 5]);
        ProductVariant::create(['product_id' => $pricey->id, 'volume_ml' => 50, 'price' => 900, 'stock_quantity' => 5]);

        $response = $this->get('/products?sort=price_asc');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->where('products.data.0.name', 'Cheap'));
    }
}
