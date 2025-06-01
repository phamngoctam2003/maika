<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('fullName', 50);
            $table->string('password', 250);
            $table->string('gender', 250)->nullable();
            $table->string('email', 100)->unique();
            $table->string('phone', 15)->nullable();
            $table->text('image')->nullable();
            $table->date('birthDay')->nullable();
            $table->integer('is_verify')->default(0);
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('users');
    }
};
