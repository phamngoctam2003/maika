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
        Schema::create('reading_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->foreignId('chapter_id')->nullable()->constrained()->onDelete('cascade');
            
            // Thông tin vị trí đọc không phụ thuộc thiết bị
            $table->unsignedInteger('chapter_index'); // Thứ tự chapter trong sách (0-based)
            $table->unsignedBigInteger('character_position'); // Vị trí ký tự trong chapter
            $table->decimal('chapter_progress', 5, 2)->default(0); // % hoàn thành chapter (0-100)
            
            // Metadata không cần thiết - bỏ device_info
            // $table->json('device_info')->nullable(); 
            
            // Thông tin bổ sung
            $table->timestamp('last_read_at')->useCurrent(); // Lần đọc cuối
            $table->timestamps();

            $table->unique(['user_id', 'book_id']); // Mỗi người chỉ có 1 bản ghi/sách
            $table->index(['user_id', 'last_read_at']); // Index cho truy vấn recent reads
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reading_histories');
    }
};
