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
            $table->string('email')->after('name');
            $table->string('delivery_method')->after('address');
            $table->string('payment_method')->after('delivery_method');
            $table->string('promo_code')->nullable()->after('payment_method');
            $table->text('comment')->nullable()->after('promo_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['email', 'delivery_method', 'payment_method', 'promo_code', 'comment']);
        });
    }
};
