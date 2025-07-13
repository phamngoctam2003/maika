<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\VnpayService;

class TestVnpaySignature extends Command
{
    protected $signature = 'vnpay:test-signature {--callback-data= : VNPay callback data in JSON format}';
    protected $description = 'Test VNPay signature với callback data thực';

    public function handle()
    {
        $this->info('🔍 Test VNPay Signature...');
        
        $callbackData = $this->option('callback-data');
        
        if (!$callbackData) {
            $this->error('❌ Vui lòng cung cấp callback data');
            $this->info('Cách sử dụng:');
            $this->line('php artisan vnpay:test-signature --callback-data=\'{"vnp_Amount":"10000000","vnp_BankCode":"NCB","vnp_SecureHash":"abc123..."}\'');
            return;
        }
        
        try {
            $data = json_decode($callbackData, true);
            
            if (!$data) {
                $this->error('❌ Callback data không hợp lệ (không phải JSON)');
                return;
            }
            
            $vnpayService = app(VnpayService::class);
            
            // Kiểm tra config trước
            $validation = $vnpayService->validateConfig();
            if (!$validation['is_valid']) {
                $this->error('❌ Config VNPay không hợp lệ:');
                foreach ($validation['errors'] as $error) {
                    $this->error('  - ' . $error);
                }
                return;
            }
            
            // Test signature
            $this->info('📋 Callback data nhận được:');
            foreach ($data as $key => $value) {
                if (str_starts_with($key, 'vnp_')) {
                    $displayValue = $key === 'vnp_SecureHash' ? substr($value, 0, 16) . '...' : $value;
                    $this->line("  $key: $displayValue");
                }
            }
            
            // Debug hash generation
            $debugInfo = $vnpayService->debugHashGeneration($data);
            
            $this->info('🧪 Kết quả test signature:');
            $this->table(
                ['Method', 'Hash Data', 'Generated Hash', 'Matches'],
                [
                    [
                        'Method 1 (Old)',
                        substr($debugInfo['method1']['hash_data'], 0, 50) . '...',
                        substr($debugInfo['method1']['hash'], 0, 16) . '...',
                        $debugInfo['method1']['matches'] ? '✅ YES' : '❌ NO'
                    ],
                    [
                        'Method 2 (New)',
                        substr($debugInfo['method2']['hash_data'], 0, 50) . '...',
                        substr($debugInfo['method2']['hash'], 0, 16) . '...',
                        $debugInfo['method2']['matches'] ? '✅ YES' : '❌ NO'
                    ]
                ]
            );
            
            $this->info('🔑 VNPay Hash: ' . substr($debugInfo['vnpay_hash'], 0, 16) . '...');
            
            // Kết luận
            if ($debugInfo['method2']['matches']) {
                $this->info('✅ Hash Secret chính xác! Signature verification thành công.');
            } elseif ($debugInfo['method1']['matches']) {
                $this->warn('⚠️ Hash Secret chính xác nhưng đang dùng thuật toán cũ. Cần update code.');
            } else {
                $this->error('❌ Hash Secret không chính xác hoặc có lỗi trong thuật toán.');
                $this->error('Vui lòng kiểm tra:');
                $this->error('  1. VNP_HASH_SECRET trong .env');
                $this->error('  2. VNP_TMN_CODE có đúng không');
                $this->error('  3. Callback data có đầy đủ không');
            }
            
        } catch (\Exception $e) {
            $this->error('❌ Lỗi: ' . $e->getMessage());
        }
    }
}
