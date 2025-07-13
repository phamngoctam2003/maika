<?php

return [
    /*
    |--------------------------------------------------------------------------
    | VNPay Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for VNPay payment gateway integration
    |
    */

    'vnp_url' => env('VNP_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
    'vnp_tmn_code' => env('VNP_TMN_CODE'),
    'vnp_hash_secret' => env('VNP_HASH_SECRET'),
    'vnp_return_url' => env('VNP_RETURN_URL', env('APP_URL') . '/api/vnpay/return'),

    /*
    |--------------------------------------------------------------------------
    | VNPay API Configuration
    |--------------------------------------------------------------------------
    */
    'vnp_api_url' => env('VNP_API_URL', 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'),
    
    /*
    |--------------------------------------------------------------------------
    | Payment Settings
    |--------------------------------------------------------------------------
    */
    'timeout_minutes' => env('VNP_TIMEOUT_MINUTES', 60), // Tăng lên 60 phút
    'version' => '2.1.0',
    'currency' => 'VND',
    'locale' => 'vn',
    'order_type' => 'billpayment',
];
