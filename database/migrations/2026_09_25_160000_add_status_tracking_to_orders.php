<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('locale', 2)->default('uk')->after('status');
            $table->string('tracking_number')->nullable()->after('locale');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->unsignedInteger('volume_ml')->nullable()->after('lot_id');
        });

        // Lot items so far only kept the volume inside `detail` ("5 мл (распив)").
        DB::table('order_items')->where('type', 'lot')->orderBy('id')->each(function ($item) {
            if (preg_match('/^(\d+)/', $item->detail, $m)) {
                DB::table('order_items')->where('id', $item->id)->update(['volume_ml' => (int) $m[1]]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['locale', 'tracking_number']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('volume_ml');
        });
    }
};
