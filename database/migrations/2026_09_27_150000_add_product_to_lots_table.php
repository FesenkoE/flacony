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
        // Correlated subquery instead of UPDATE ... JOIN so it runs on MySQL and SQLite (CI).
        DB::table('lots')->update(['product_id' => DB::raw(
            '(select products.id from products
              join brands on brands.id = products.brand_id
              where products.name = lots.product_name and brands.name = lots.brand_name
              limit 1)'
        )]);
    }

    public function down(): void
    {
        Schema::table('lots', function (Blueprint $table) {
            $table->dropConstrainedForeignId('product_id');
        });
    }
};
