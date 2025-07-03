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
        Schema::create('book_comment', function (Blueprint $table) {
            $table->id();
            $table->text('content'); // Nội dung bình luận
            $table->unsignedTinyInteger('rating')->nullable();
            $table->unsignedBigInteger('comment_book_id')->nullable();
            $table->boolean('is_admin')->default(false);
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade'); // ID người dùng bình luận
            $table->foreignId('book_id')->references('id')->on('books')->onDelete('cascade'); // ID sách được bình luận
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_comment');
    }
};
