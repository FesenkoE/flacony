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
        Schema::table('lots', function (Blueprint $table) {
            $table->renameColumn('image_path', 'photo_sprayer_path');
            $table->string('photo_barcode_path')->nullable()->after('photo_sprayer_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lots', function (Blueprint $table) {
            $table->dropColumn('photo_barcode_path');
            $table->renameColumn('photo_sprayer_path', 'image_path');
        });
    }
};
