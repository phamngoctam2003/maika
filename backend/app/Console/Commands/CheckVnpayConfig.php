<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\VnpayService;

class CheckVnpayConfig extends Command
{
    protected $signature = 'vnpay:check-config';
    protected $description = 'Kiểm tra cấu hình VNPay và Hash Secret';

    public function handle()
    {
        $this->info('🔍 Kiểm tra cấu hình VNPay...');
        
        try {
            $vnpayService = app(VnpayService::class);
            $validation = $vnpayService->validateConfig();
            
            // Hiển thị thông tin config
            $this->info('📋 Thông tin cấu hình:');
            $this->table(
                ['Tham số', 'Giá trị'],
                [
                    ['VNP_URL', config('vnpay.vnp_url')],
                    ['VNP_TMN_CODE', config('vnpay.vnp_tmn_code')],
                    ['VNP_HASH_SECRET', substr(config('vnpay.vnp_hash_secret'), 0, 8) . '...'],
                    ['VNP_HASH_SECRET_LENGTH', strlen(config('vnpay.vnp_hash_secret'))],
                    ['VNP_RETURN_URL', config('vnpay.vnp_return_url')],
                ]
            );
            
            // Kiểm tra validation
            if ($validation['is_valid']) {
                $this->info('✅ Cấu hình VNPay hợp lệ!');
                
                // Test tạo payment URL
                $this->info('🧪 Test tạo payment URL...');
                $testData = [
                    'amount' => 100000,
                    'order_info' => 'Test thanh toán',
                    'order_id' => 'TEST_' . date('YmdHis')
                ];
                
                $paymentUrl = $vnpayService->createPaymentUrl($testData);
                $this->info('Payment URL được tạo thành công!');
                $this->line('URL Length: ' . strlen($paymentUrl));
                
                // Hiển thị một phần URL để kiểm tra
                $urlParts = parse_url($paymentUrl);
                parse_str($urlParts['query'], $params);
                
                $this->info('📝 Các tham số quan trọng:');
                $this->table(
                    ['Tham số', 'Giá trị'],
                    [
                        ['vnp_TmnCode', $params['vnp_TmnCode'] ?? 'N/A'],
                        ['vnp_Amount', $params['vnp_Amount'] ?? 'N/A'],
                        ['vnp_ReturnUrl', $params['vnp_ReturnUrl'] ?? 'N/A'],
                        ['vnp_SecureHash', substr($params['vnp_SecureHash'] ?? '', 0, 16) . '...'],
                    ]
                );
                
            } else {
                $this->error('❌ Cấu hình VNPay không hợp lệ!');
                foreach ($validation['errors'] as $error) {
                    $this->error('  - ' . $error);
                }
            }
            
        } catch (\Exception $e) {
            $this->error('❌ Lỗi: ' . $e->getMessage());
            $this->error('Trace: ' . $e->getTraceAsString());
        }
    }
}
