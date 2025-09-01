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
        Schema::table('user_packages', function (Blueprint $table) {
            $table->string('payment_method')->nullable(); // vnpay, momo, etc
            $table->string('payment_status')->default('pending');
            $table->string('transaction_id')->nullable(); // VNPay transaction ID
            $table->string('order_id')->nullable(); // Internal order ID
            $table->decimal('amount', 10, 2)->nullable(); // Payment amount
            $table->text('payment_data')->nullable(); // JSON data from payment gateway
            $table->timestamp('payment_at')->nullable(); // When payment was completed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_packages', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'payment_status',
                'transaction_id',
                'order_id',
                'amount',
                'payment_data',
                'payment_at'
            ]);
        });
    }
};
