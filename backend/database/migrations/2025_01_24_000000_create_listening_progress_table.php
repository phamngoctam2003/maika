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
        Schema::create('listening_progress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('book_id');
            $table->unsignedBigInteger('chapter_id');
            $table->decimal('current_time', 8, 2)->default(0); // Thời điểm hiện tại (giây)
            $table->decimal('duration', 8, 2)->nullable(); // Tổng thời lượng chương (giây)
            $table->decimal('progress_percentage', 5, 2)->default(0); // % tiến độ (0-100)
            $table->boolean('is_completed')->default(false); // Đã nghe xong chương chưa
            $table->timestamp('last_accessed_at')->useCurrent(); // Lần cuối truy cập
            $table->timestamps();

            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');
            $table->foreign('chapter_id')->references('id')->on('chapters')->onDelete('cascade');

            // Unique constraint để tránh duplicate
            $table->unique(['user_id', 'chapter_id'], 'unique_user_chapter');

            // Indexes cho performance
            $table->index(['user_id', 'book_id']);
            $table->index('last_accessed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listening_progress');
    }
};
