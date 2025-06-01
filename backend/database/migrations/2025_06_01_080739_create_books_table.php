<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('author', 255);
            $table->text('description')->nullable();
            $table->integer('publication_year')->nullable();
            $table->foreignId('book_type_id')->constrained('book_types')->onDelete('cascade');
            $table->string('file_path', 255)->nullable();
            $table->enum('access_type', ['free', 'membership', 'sale'])->default('free');
            $table->decimal('price', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('books');
    }
};
