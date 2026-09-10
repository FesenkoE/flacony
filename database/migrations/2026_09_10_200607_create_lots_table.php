<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('brand_name');
            $table->string('product_name');
            $table->unsignedInteger('total_volume_ml');
            $table->unsignedInteger('remaining_volume_ml');
            $table->decimal('price_per_ml', 10, 2);
            $table->unsignedInteger('bulk_threshold_ml')->nullable();
            $table->decimal('bulk_price_per_ml', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lots');
    }
};
