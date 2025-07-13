<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserPackagesTable extends Migration
{
    public function up(): void
    {
        Schema::create('user_packages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('package_id')->constrained('packages')->onDelete('cascade');

            $table->timestamp('starts_at')->nullable(); // thời điểm bắt đầu kích hoạt gói
            $table->timestamp('ends_at')->nullable();   // thời điểm kết thúc (dựa vào duration_months)

            $table->enum('status', ['active', 'expired', 'cancelled', 'pending'])->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_packages');
    }
}
