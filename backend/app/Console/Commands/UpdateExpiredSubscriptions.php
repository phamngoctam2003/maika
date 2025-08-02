<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\UserPackage; // Tùy model bạn lưu
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class UpdateExpiredSubscriptions extends Command
{
    protected $signature = 'subscriptions:update-expired';
    protected $description = 'Cập nhật trạng thái các gói đã hết hạn sang expired';

    public function handle()
    {
        Log::info('subscriptions:update-expired command is running!');
        $count = UserPackage::where('status', 'active')
            ->where('ends_at', '<', Carbon::now())
            ->update(['status' => 'expired']);

        $this->info("Đã cập nhật {$count} gói hết hạn.");
    }
}
