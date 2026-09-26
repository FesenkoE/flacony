<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // The storefront shows our catalog photo for a lot; the seller's own photos
    // stay on the lot page as proof of the actual bottle.
    public function up(): void
    {
        Schema::table('lots', function (Blueprint $table) {
            $table->foreignId('product_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });

        // Link existing lots whose brand + name match a catalog product.
        DB::table('lots')
            ->join('products', 'products.name', '=', 'lots.product_name')
            ->join('brands', function ($join) {
                $join->on('brands.id', '=', 'products.brand_id')->on('brands.name', '=', 'lots.brand_name');
            })
            ->update(['lots.product_id' => DB::raw('products.id')]);
    }

    public function down(): void
    {
        Schema::table('lots', function (Blueprint $table) {
            $table->dropConstrainedForeignId('product_id');
        });
    }
};
