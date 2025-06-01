<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('book_format_mappings', function (Blueprint $table) {
            $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
            $table->foreignId('format_id')->constrained('book_formats')->onDelete('cascade');
            $table->primary(['book_id', 'format_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('book_format_mappings');
    }
};
