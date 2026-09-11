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
        Schema::table('products', function (Blueprint $table) {
            $table->string('perfumer')->nullable();
            $table->unsignedSmallInteger('release_year')->nullable();
            $table->string('concentration')->nullable();
            $table->json('top_notes')->nullable();
            $table->json('heart_notes')->nullable();
            $table->json('base_notes')->nullable();
            $table->json('accords')->nullable();
            $table->string('longevity')->nullable();
            $table->string('sillage')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'perfumer',
                'release_year',
                'concentration',
                'top_notes',
                'heart_notes',
                'base_notes',
                'accords',
                'longevity',
                'sillage',
            ]);
        });
    }
};
