<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('packages')->insert([
            [
                'name' => 'MAIKA 3 THÁNG',
                'duration_months' => 3,
                'original_price' => 207000,
                'discounted_price' => 199000,
                'discount_percent' => 3,
                'highlight_label' => 'TIẾT KIỆM 3%',
                'is_best_offer' => false,
            ],
            [
                'name' => 'MAIKA 6 THÁNG',
                'duration_months' => 6,
                'original_price' => 444000,
                'discounted_price' => 399000,
                'discount_percent' => 10,
                'highlight_label' => 'TIẾT KIỆM 10%',
                'is_best_offer' => false,
            ],
            [
                'name' => 'MAIKA 12 THÁNG',
                'duration_months' => 12,
                'original_price' => 820000,
                'discounted_price' => 499000,
                'discount_percent' => 40,
                'highlight_label' => 'ƯU ĐÃI NHẤT 40%',
                'is_best_offer' => true,
            ],
        ]);
    }
}
