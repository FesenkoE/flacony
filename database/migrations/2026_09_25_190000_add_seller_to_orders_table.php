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
        Schema::table('orders', function (Blueprint $table) {
            // null = shipped by Flacony (catalog); otherwise the decant seller.
            $table->foreignId('seller_id')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
            // Orders split out of one cart share it, so the buyer sees them together.
            $table->uuid('checkout_id')->nullable()->after('seller_id')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('seller_id');
            $table->dropColumn('checkout_id');
        });
    }
};
