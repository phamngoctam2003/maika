<?php

namespace App\Http\Controllers;

use App\Contracts\PackageRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $packageRepository;

    public function __construct(PackageRepositoryInterface $packageRepository)
    {
        $this->packageRepository = $packageRepository;
    }

    /**
     * Tạo thanh toán VNPay
     */
    public function createVnpayPayment(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'package_id' => 'required|integer|exists:packages,id',
                'return_url' => 'nullable|url',
            ]);

            $paymentData = [
                'return_url' => $request->return_url,
                'user_agent' => $request->userAgent(),
                'ip_address' => $request->ip(),
            ];

            $result = $this->packageRepository->purchasePackageWithVnpay(
                $request->package_id,
                $paymentData
            );

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('VNPay Payment Creation Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null
            ], 400);
        }
    }

    /**
     * Xử lý callback từ VNPay
     */
    public function vnpayCallback(Request $request): JsonResponse
    {
        try {
            $callbackData = $request->all();
            
            Log::info('VNPay Callback Data: ', $callbackData);
            
            $result = $this->packageRepository->handleVnpayCallback($callbackData);
            
            // Nếu thanh toán thất bại
            if (!$result['success']) {
                $orderId = $callbackData['vnp_TxnRef'] ?? '';
                $reason = $result['message'] ?? 'Unknown error';
                
                if ($orderId) {
                    $this->packageRepository->handleVnpayFailure($orderId, $reason);
                }
            }
            
            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('VNPay Callback Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Lỗi xử lý callback thanh toán',
                'data' => null
            ], 500);
        }
    }

    /**
     * Xử lý return URL từ VNPay (khi user quay lại từ VNPay)
     */
    public function vnpayReturn(Request $request)
    {
        try {
            $callbackData = $request->all();
            
            Log::info('VNPay Return Data: ', $callbackData);
            
            $result = $this->packageRepository->handleVnpayCallback($callbackData);
            
            if ($result['success']) {
                $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
                return redirect()->to($frontendUrl . '/payment-result?' . http_build_query([
                    'order_id' => $result['data']['order_id'],
                    'transaction_id' => $result['data']['transaction_id'],
                    'amount' => $result['data']['amount'],
                ]));
            } else {
                $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
                return redirect()->to($frontendUrl . '/payment-result?' . http_build_query([
                    'error' => $result['message'],
                    'order_id' => $callbackData['vnp_TxnRef'] ?? '',
                ]));
            }

        } catch (\Exception $e) {
            Log::error('VNPay Return Error: ' . $e->getMessage());
            
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect()->to($frontendUrl . '/payment-result?' . http_build_query([
                'error' => 'Lỗi xử lý kết quả thanh toán',
            ]));
        }
    }

    /**
     * Kiểm tra trạng thái thanh toán
     */
    public function checkPaymentStatus(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'order_id' => 'required|string',
            ]);

            $userPackage = \App\Models\UserPackage::where('order_id', $request->order_id)->first();

            if (!$userPackage) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng',
                    'data' => null
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Thông tin đơn hàng',
                'data' => [
                    'order_id' => $userPackage->order_id,
                    'payment_status' => $userPackage->payment_status,
                    'status' => $userPackage->status,
                    'amount' => $userPackage->amount,
                    'transaction_id' => $userPackage->transaction_id,
                    'payment_at' => $userPackage->payment_at,
                    'package' => $userPackage->package,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Payment Status Check Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Lỗi kiểm tra trạng thái thanh toán',
                'data' => null
            ], 500);
        }
    }

    /**
     * Hủy thanh toán
     */
    public function cancelPayment(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'order_id' => 'required|string',
            ]);

            $result = $this->packageRepository->cancelPendingPackage($request->order_id);
            
            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Payment Cancel Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null
            ], 400);
        }
    }

    /**
     * Dọn dẹp các thanh toán pending cũ
     */
    public function cleanupPendingPayments(): JsonResponse
    {
        try {
            $cleanedCount = $this->packageRepository->cleanupPendingPackages();
            
            return response()->json([
                'success' => true,
                'message' => "Đã dọn dẹp $cleanedCount đơn hàng pending",
                'data' => ['cleaned_count' => $cleanedCount]
            ]);

        } catch (\Exception $e) {
            Log::error('Payment Cleanup Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi dọn dẹp thanh toán',
                'data' => null
            ], 500);
        }
    }
}
