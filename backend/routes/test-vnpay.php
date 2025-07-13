<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Services\VnpayService;

Route::get('/test-vnpay-signature', function (Request $request) {
    try {
        $vnpayService = app(VnpayService::class);
        
        // Lấy tất cả params từ request
        $inputData = $request->all();
        
        if (empty($inputData)) {
            return response()->json([
                'message' => 'No VNPay data received',
                'usage' => 'Add VNPay callback params to URL'
            ]);
        }
        
        // Test signature verification
        $isValid = $vnpayService->verifyReturnUrl($inputData);
        
        return response()->json([
            'is_signature_valid' => $isValid,
            'vnpay_data' => $inputData,
            'config_check' => [
                'vnp_tmn_code' => config('vnpay.vnp_tmn_code'),
                'vnp_hash_secret_length' => strlen(config('vnpay.vnp_hash_secret')),
                'vnp_url' => config('vnpay.vnp_url'),
                'vnp_return_url' => config('vnpay.vnp_return_url'),
            ],
            'timestamp' => now()
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

Route::get('/test-create-payment-fixed', function (Request $request) {
    try {
        $vnpayService = app(VnpayService::class);
        
        // Dữ liệu test cố định
        $testData = [
            'amount' => 100000, // 100k VND
            'order_desc' => 'Test payment with fixed signature',
            'order_id' => 'TEST_' . time(),
            'user_id' => 1,
            'package_id' => 1
        ];
        
        // Tạo payment URL
        $paymentUrl = $vnpayService->createPaymentUrl($testData);
        
        // Parse URL để kiểm tra signature
        $urlParts = parse_url($paymentUrl);
        parse_str($urlParts['query'], $queryParams);
        
        // Tạo hash data để kiểm tra (như trong VnpayService)
        $vnpSecureHash = $queryParams['vnp_SecureHash'] ?? '';
        unset($queryParams['vnp_SecureHash']);
        ksort($queryParams);
        
        $hashDataArray = [];
        foreach ($queryParams as $key => $value) {
            if (strlen($value) > 0) {
                $hashDataArray[] = $key . '=' . $value;
            }
        }
        
        $hashData = implode('&', $hashDataArray);
        $expectedHash = hash_hmac('sha512', $hashData, config('vnpay.vnp_hash_secret'));
        
        return response()->json([
            'payment_url' => $paymentUrl,
            'test_data' => $testData,
            'signature_check' => [
                'hash_data' => $hashData,
                'vnpay_hash' => $vnpSecureHash,
                'expected_hash' => $expectedHash,
                'is_valid' => hash_equals($expectedHash, $vnpSecureHash)
            ],
            'query_params' => $queryParams,
            'timestamp' => now()
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

Route::get('/test-vnpay-config', function () {
    try {
        $vnpayService = app(VnpayService::class);
        
        $validation = $vnpayService->validateConfig();
        
        return response()->json([
            'config_validation' => $validation,
            'timestamp' => now()
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

Route::get('/test-vnpay-debug-hash', function (Request $request) {
    try {
        $vnpayService = app(VnpayService::class);
        
        $inputData = $request->all();
        
        if (empty($inputData)) {
            return response()->json([
                'message' => 'No VNPay data received',
                'usage' => 'Add VNPay callback params to URL'
            ]);
        }
        
        $debugInfo = $vnpayService->debugHashGeneration($inputData);
        
        return response()->json([
            'debug_info' => $debugInfo,
            'timestamp' => now()
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});
