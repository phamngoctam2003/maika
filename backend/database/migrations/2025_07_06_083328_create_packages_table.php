<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePackagesTable extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();

            $table->string('name'); // VD: MAIKA 3 THÁNG
            $table->unsignedInteger('duration_months'); // VD: 3, 6, 12

            $table->unsignedInteger('original_price');   // VD: 207000
            $table->unsignedInteger('discounted_price'); // VD: 199000
            $table->unsignedTinyInteger('discount_percent')->nullable(); // VD: 3, 10, 40

            $table->string('highlight_label')->nullable(); // VD: 'TIẾT KIỆM 10%', 'HOT'
            $table->boolean('is_best_offer')->default(false); // đánh dấu gói nổi bật

            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
}
