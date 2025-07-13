<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Services\VnpayService;
use Illuminate\Support\Facades\Log; 

Route::get('/', function () {
    return view('welcome');
});


// Thêm vào routes/web.php
Route::get('/vnpay-test', function () {
    $testData = [
        "vnp_Amount" => "19900000",
        "vnp_Command" => "pay",
        "vnp_CreateDate" => "20250709082735",
        "vnp_CurrCode" => "VND",
        "vnp_ExpireDate" => "20250709092735",
        "vnp_IpAddr" => "127.0.0.1",
        "vnp_Locale" => "vn",
        "vnp_OrderInfo" => "Thanh toan goi MAIKA 3 THANG",
        "vnp_OrderType" => "billpayment",
        "vnp_ReturnUrl" => "http://localhost:8000/api/payment/vnpay/return",
        "vnp_TmnCode" => "9X8DT76J",
        "vnp_TxnRef" => "PKG_1_1752024455_358",
        "vnp_Version" => "2.1.0"
    ];
    
    $testSecretKey = "RCSELFG6QRAXWMM76GSD3TXF75DBGCCX"; 
    
    // Sắp xếp dữ liệu
    ksort($testData);
    
    // Tạo chuỗi query
    $hashData = http_build_query($testData);
    
    // Tạo secure hash
    $secureHash = hash_hmac('sha512', $hashData, $testSecretKey);
    
    // Log debug
    Log::debug('VNPay Test Hash', [
        'original_data' => $testData,
        'hash_data' => $hashData,
        'secure_hash' => $secureHash
    ]);
    
    // Tạo URL hoàn chỉnh
    $vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    $paymentUrl = $vnpUrl . '?' . $hashData . '&vnp_SecureHash=' . $secureHash;
    
    // Log URL cuối cùng
    Log::info('VNPay Test URL', [
        'payment_url' => $paymentUrl
    ]);
    
    // Hiển thị kết quả
    return response()->json([
        'success' => true,
        'hash_data' => $hashData,
        'secure_hash' => $secureHash,
        'payment_url' => $paymentUrl,
        'test_link' => '<a href="' . $paymentUrl . '" target="_blank">Test Payment Link</a>'
    ]);
});

