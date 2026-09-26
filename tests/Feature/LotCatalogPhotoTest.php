<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Lot;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LotCatalogPhotoTest extends TestCase
{
    use RefreshDatabase;

    private function product(string $brand, string $name): Product
    {
        return Product::create([
            'brand_id' => Brand::firstOrCreate(['slug' => str($brand)->slug()], ['name' => $brand])->id,
            'category_id' => Category::firstOrCreate(['slug' => 'unisex'], ['name' => 'unisex'])->id,
            'name' => $name, 'slug' => str("$brand $name")->slug(), 'is_active' => true,
            'image_path' => 'products/aventus.png',
        ]);
    }

    private function lot(string $brand, string $name): Lot
    {
        return Lot::create([
            'user_id' => User::factory()->create()->id, 'brand_name' => $brand, 'product_name' => $name,
            'photo_sprayer_path' => 'lots/s.jpg', 'photo_batch_code_path' => 'lots/b.jpg',
            'total_volume_ml' => 100, 'remaining_volume_ml' => 100, 'price_per_ml' => 30,
            'status' => Lot::STATUS_APPROVED,
        ]);
    }

    public function test_seller_listing_a_catalog_perfume_is_linked_to_it()
    {
        Storage::fake('public');
        $aventus = $this->product('Creed', 'Aventus');

        $this->actingAs(User::factory()->create())->post('/sellers/lots', [
            'brand_name' => 'creed', 'product_name' => 'aventus',   // case doesn't matter
            'total_volume_ml' => 100, 'price_per_ml' => 30,
            'photo_sprayer' => UploadedFile::fake()->image('s.jpg'),
            'photo_batch_code' => UploadedFile::fake()->image('b.jpg'),
        ]);

        $this->assertSame($aventus->id, Lot::sole()->product_id);
    }

    public function test_perfume_outside_the_catalog_stays_unlinked_until_it_is_added()
    {
        $lot = $this->lot('Kilian', "Angels' Share");
        $this->assertNull($lot->product_id);

        $product = $this->product('Kilian', "Angels' Share");

        $this->assertSame($product->id, $lot->fresh()->product_id);
    }

    public function test_admin_pick_is_not_overwritten_by_name_matching()
    {
        $this->product('Creed', 'Aventus');
        $other = $this->product('Creed', 'Green Irish Tweed');
        $lot = $this->lot('Creed', 'Aventus');

        $lot->update(['product_id' => $other->id, 'product_name' => 'Aventus ']);

        $this->assertSame($other->id, $lot->fresh()->product_id);
    }

    public function test_lot_page_gets_catalog_photo_and_seller_photos()
    {
        $this->product('Creed', 'Aventus');
        $lot = $this->lot('Creed', 'Aventus');

        $this->get("/sellers/lots/{$lot->id}")->assertInertia(fn ($page) => $page
            ->where('lot.product.image_path', 'products/aventus.png')
            ->where('lot.photo_sprayer_path', 'lots/s.jpg')
            ->where('lot.photo_batch_code_path', 'lots/b.jpg'));
    }

    public function test_admin_lot_form_offers_catalog_product()
    {
        $this->product('Creed', 'Aventus');
        $lot = $this->lot('Creed', 'Aventus');

        $this->actingAs(User::factory()->create(['is_admin' => true]))
            ->get("/admin/lots/{$lot->id}/edit")
            ->assertOk()
            ->assertSee('Товар каталога')
            ->assertSee('Creed — Aventus');
    }
}
