<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        // Tạo 10 danh mục mẫu
        Category::factory()->count(10)->create();
    }
}