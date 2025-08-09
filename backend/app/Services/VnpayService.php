<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class VnpayService
{
    private string $vnpUrl;
    private string $vnpTmnCode;
    private string $vnpHashSecret;
    private string $vnpReturnUrl;

    public function __construct()
    {
        $this->vnpUrl = config('vnpay.vnp_url');
        $this->vnpTmnCode = config('vnpay.vnp_tmn_code');
        $this->vnpHashSecret = config('vnpay.vnp_hash_secret');
        $this->vnpReturnUrl = config('vnpay.vnp_return_url');
    }

    /**
     * Validate VNPay configuration
     */
    public function validateConfig(): array
    {
        $errors = [];

        if (empty($this->vnpUrl)) {
            $errors[] = 'VNP_URL không được để trống';
        }

        if (empty($this->vnpTmnCode)) {
            $errors[] = 'VNP_TMN_CODE không được để trống';
        }

        if (empty($this->vnpHashSecret)) {
            $errors[] = 'VNP_HASH_SECRET không được để trống';
        } elseif (strlen($this->vnpHashSecret) < 32) {
            $errors[] = 'VNP_HASH_SECRET phải có ít nhất 32 ký tự';
        }

        if (empty($this->vnpReturnUrl)) {
            $errors[] = 'VNP_RETURN_URL không được để trống';
        }

        return [
            'is_valid' => empty($errors),
            'errors' => $errors,
            'config' => [
                'vnp_url' => $this->vnpUrl,
                'vnp_tmn_code' => $this->vnpTmnCode,
                'vnp_hash_secret_length' => strlen($this->vnpHashSecret),
                'vnp_return_url' => $this->vnpReturnUrl,
            ]
        ];
    }

    /**
     * Tạo hash data chuẩn cho VNPay
     * Method này đảm bảo tính nhất quán giữa tạo payment và verify response
     */
    private function createHashData(array $data): string
    {
        // Loại bỏ các field không tham gia hash
        $dataToHash = $data;
        unset($dataToHash['vnp_SecureHash']);
        unset($dataToHash['vnp_SecureHashType']);

        // Chỉ giữ các field bắt đầu với vnp_ và có giá trị
        $filteredData = [];
        foreach ($dataToHash as $key => $value) {
            if (substr($key, 0, 4) == "vnp_" && strlen($value) > 0) {
                $filteredData[$key] = $value;
            }
        }

        // Sắp xếp theo thứ tự alphabet
        ksort($filteredData);

        // Tạo hash data theo format VNPay: key1=value1&key2=value2
        $hashData = '';
        $i = 0;
        foreach ($filteredData as $key => $value) {
            $hashData .= ($i ? '&' : '') . $key . "=" . $value;
            $i++;
        }

        return $hashData;
    }

    /**
     * Tạo secure hash cho VNPay
     */
    private function createSecureHash(array $data): string
    {
        // Loại bỏ các field không tham gia hash
        $dataToHash = $data;
        unset($dataToHash['vnp_SecureHash']);
        unset($dataToHash['vnp_SecureHashType']);

        // Chỉ giữ các field bắt đầu với vnp_ và có giá trị
        $filteredData = [];
        foreach ($dataToHash as $key => $value) {
            if (substr($key, 0, 4) == "vnp_" && strlen($value) > 0) {
                $filteredData[$key] = $value;
            }
        }

        // Sắp xếp theo thứ tự alphabet (QUAN TRỌNG!)
        ksort($filteredData);

        // Tạo hash data theo format VNPay: key1=value1&key2=value2
        $hashData = '';
        foreach ($filteredData as $key => $value) {
            $hashData .= urlencode($key) . "=" . urlencode($value) . '&';
        }
        $hashData = rtrim($hashData, '&');
        
        return hash_hmac('sha512', $hashData, $this->vnpHashSecret);
    }

public function createPaymentUrl(array $data): string
{
    try {
        // Validate config trước khi tạo payment URL
        $configValidation = $this->validateConfig();
        if (!$configValidation['is_valid']) {
            throw new \Exception('VNPay config không hợp lệ: ' . implode(', ', $configValidation['errors']));
        }

        // Validate required data
        $requiredFields = ['order_id', 'amount', 'order_info'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                throw new \Exception("Thiếu thông tin bắt buộc: {$field}");
            }
        }

        // Tạo thông tin thanh toán
        $vnp_TxnRef = $data['order_id'];
        $vnp_OrderInfo = $data['order_info'];
        $vnp_OrderType = $data['order_type'] ?? config('vnpay.order_type', 'billpayment');
        $timeoutMinutes = (int) config('vnpay.timeout_minutes', 15);
        $vnp_Amount = round($data['amount']) * 100; // VNPay yêu cầu số tiền x100
        $vnp_Locale = $data['locale'] ?? config('vnpay.locale', 'vn');
        $vnp_IpAddr = request()->header('X-Forwarded-For') ?? request()->ip();

        // Tạo thời gian với timezone Asia/Ho_Chi_Minh
        $now = now('Asia/Ho_Chi_Minh');
        $expireTime = $now->copy()->addMinutes($timeoutMinutes);
        $vnp_ExpireDate = $expireTime->format('YmdHis');

        // Tạo input data cho VNPay (KHÔNG bao gồm vnp_SecureHash)
        $inputData = [
            "vnp_Version" => config('vnpay.version', '2.1.0'),
            "vnp_TmnCode" => $this->vnpTmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => $now->format('YmdHis'),
            "vnp_CurrCode" => config('vnpay.currency', 'VND'),
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $this->vnpReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_ExpireDate" => $vnp_ExpireDate,
        ];

        // SẮP XẾP data trước khi tạo hash (QUAN TRỌNG!)
        ksort($inputData);

        // Tạo secure hash từ data đã sắp xếp (KHÔNG bao gồm vnp_SecureHash)
        $vnpSecureHash = $this->createSecureHash($inputData);

        // Tạo query string cho các tham số đã sắp xếp
        $queryString = '';
        foreach ($inputData as $key => $value) {
            $queryString .= urlencode($key) . "=" . urlencode($value) . '&';
        }
        
        // Thêm vnp_SecureHash vào CUỐI (QUAN TRỌNG: không sắp xếp lại!)
        $queryString .= 'vnp_SecureHash=' . $vnpSecureHash;

        // Tạo payment URL
        $paymentUrl = $this->vnpUrl . "?" . $queryString;
        return $paymentUrl;
        
    } catch (\Exception $e) {
        Log::error('VNPay Payment URL Creation Error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'data' => $data
        ]);
        throw $e;
    }
}

    /**
     * Xác thực phản hồi từ VNPay
     */
    public function verifyReturnUrl(array $inputData): bool
    {
        try {
            // Lấy hash từ VNPay
            $vnpSecureHash = $inputData['vnp_SecureHash'] ?? '';
            // Tạo hash từ data nhận được
            $calculatedHash = $this->createSecureHash($inputData);

            // So sánh hash
            $isValid = hash_equals($calculatedHash, $vnpSecureHash);
            return $isValid;
        } catch (\Exception $e) {
            Log::error('VNPay Verify Error', [
                'error' => $e->getMessage(),
                'data' => $inputData
            ]);
            return false;
        }
    }

    /**
     * Lấy dữ liệu VNPay đã được filter
     */
    private function getFilteredVnpData(array $data): array
    {
        $filtered = [];
        foreach ($data as $key => $value) {
            if (
                substr($key, 0, 4) == "vnp_" &&
                $key != 'vnp_SecureHash' &&
                $key != 'vnp_SecureHashType' &&
                strlen($value) > 0
            ) {
                $filtered[$key] = $value;
            }
        }
        ksort($filtered);
        return $filtered;
    }

    /**
     * Tạo mã đơn hàng duy nhất
     */
    private function generateOrderId(): string
    {
        return 'PKG_' . date('YmdHis') . '_' . Str::random(6);
    }

    /**
     * Kiểm tra trạng thái thanh toán
     */
    public function isPaymentSuccess(array $data): bool
    {
        return isset($data['vnp_ResponseCode']) && $data['vnp_ResponseCode'] === '00';
    }

    /**
     * Lấy thông tin giao dịch từ response
     */
    public function getTransactionInfo(array $data): array
    {
        return [
            'order_id' => $data['vnp_TxnRef'] ?? '',
            'amount' => isset($data['vnp_Amount']) ? $data['vnp_Amount'] / 100 : 0,
            'bank_code' => $data['vnp_BankCode'] ?? '',
            'card_type' => $data['vnp_CardType'] ?? '',
            'pay_date' => $data['vnp_PayDate'] ?? '',
            'response_code' => $data['vnp_ResponseCode'] ?? '',
            'transaction_no' => $data['vnp_TransactionNo'] ?? '',
            'bank_tran_no' => $data['vnp_BankTranNo'] ?? '',
            'transaction_status' => $data['vnp_TransactionStatus'] ?? '',
        ];
    }

    /**
     * Xử lý kết quả thanh toán từ VNPay callback
     */
    public function handlePaymentResult(array $callbackData): array
    {
        try {
            $configValidation = $this->validateConfig();
            if (!$configValidation['is_valid']) {
                Log::error('VNPay Config Invalid', $configValidation);
                return [
                    'success' => false,
                    'message' => 'VNPay config không hợp lệ: ' . implode(', ', $configValidation['errors']),
                    'data' => null
                ];
            }
                // Xác thực chữ ký từ VNPay
            if (!$this->verifyReturnUrl($callbackData)) {
                Log::error('VNPay Signature Verification Failed', [
                    'callback_data' => $callbackData
                ]);
                return [
                    'success' => false,
                    'message' => 'Chữ ký không hợp lệ - signature verification failed',
                    'data' => null
                ];
            }

                //  Lấy thông tin giao dịch
            $transactionInfo = $this->getTransactionInfo($callbackData);
            // Kiểm tra trạng thái thanh toán
            $isSuccess = $this->isPaymentSuccess($callbackData);

            //  Trả về kết quả
            $result = [
                'success' => $isSuccess,
                'message' => $this->getResponseMessage($transactionInfo['response_code']),
                'data' => [
                    'order_id' => $transactionInfo['order_id'],
                    'amount' => $transactionInfo['amount'],
                    'transaction_id' => $transactionInfo['transaction_no'],
                    'bank_code' => $transactionInfo['bank_code'],
                    'card_type' => $transactionInfo['card_type'],
                    'pay_date' => $transactionInfo['pay_date'],
                    'response_code' => $transactionInfo['response_code'],
                    'transaction_status' => $transactionInfo['transaction_status'],
                    'bank_tran_no' => $transactionInfo['bank_tran_no'],
                    'raw_data' => $callbackData
                ]
            ];

            return $result;
        } catch (\Exception $e) {

            return [
                'success' => false,
                'message' => 'Lỗi xử lý kết quả thanh toán: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }

    /**
     * Lấy thông báo lỗi theo mã response từ VNPay
     */
    private function getResponseMessage(string $code): string
    {
        $messages = [
            '00' => 'Giao dịch thành công',
            '07' => 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
            '09' => 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
            '10' => 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
            '11' => 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
            '12' => 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
            '13' => 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
            '24' => 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
            '51' => 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
            '65' => 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
            '75' => 'Ngân hàng thanh toán đang bảo trì.',
            '79' => 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
            '99' => 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
        ];

        return $messages[$code] ?? 'Lỗi không xác định';
    }

    /**
     * Debug method để kiểm tra hash generation
     */
    public function debugHashGeneration(array $data): array
    {
        $vnpSecureHash = $data['vnp_SecureHash'] ?? '';
        $hashData = $this->createHashData($data);
        $calculatedHash = $this->createSecureHash($data);
        $filteredData = $this->getFilteredVnpData($data);

        return [
            'vnpay_hash' => $vnpSecureHash,
            'calculated_hash' => $calculatedHash,
            'hash_data' => $hashData,
            'matches' => hash_equals($calculatedHash, $vnpSecureHash),
            'filtered_data' => $filteredData,
            'hash_secret_length' => strlen($this->vnpHashSecret),
            'tmn_code' => $this->vnpTmnCode
        ];
    }

    /**
     * Tạo payment URL cho một đơn hàng đơn giản
     */
    public function createPaymentUrlForOrder(string|int $orderId, float $amount, string $orderInfo = null): string
    {
        $data = [
            'order_id' => $orderId,
            'amount' => $amount,
            'order_info' => $orderInfo ?? "Thanh toan don hang #{$orderId}",
        ];

        return $this->createPaymentUrl($data);
    }

    /**
     * Tạo payment URL với thông tin chi tiết
     */
    public function createPaymentUrlWithDetails(array $options): string
    {
        $requiredFields = ['order_id', 'amount'];
        foreach ($requiredFields as $field) {
            if (!isset($options[$field])) {
                throw new \InvalidArgumentException("Thiếu thông tin bắt buộc: {$field}");
            }
        }

        $data = array_merge([
            'order_info' => "Thanh toan don hang #{$options['order_id']}",
            'order_type' => 'billpayment',
            'locale' => 'vn',
        ], $options);

        return $this->createPaymentUrl($data);
    }

}
