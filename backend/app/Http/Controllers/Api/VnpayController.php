<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VnpayService;
use App\Models\Package;
use App\Models\UserPackage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VnpayController extends Controller
{
    private VnpayService $vnpayService;

    public function __construct(VnpayService $vnpayService)
    {
        $this->vnpayService = $vnpayService;
    }

    /**
     * Tạo payment URL cho package
     */
    public function createPayment(Request $request): JsonResponse
    {
        try {
            // Kiểm tra có phải package payment hay direct payment
            if ($request->has('package_id')) {
                return $this->createPackagePayment($request);
            } else {
                return $this->createDirectPayment($request);
            }
        } catch (\Exception $e) {
            Log::error('VNPay Controller Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tạo payment URL cho package
     */
    private function createPackagePayment(Request $request): JsonResponse
    {
        $request->validate([
            'package_id' => 'required|integer|exists:packages,id',
            'return_url' => 'nullable|url',
        ]);

        return DB::transaction(function () use ($request) {
            try {
                // Lấy thông tin user và package
                $user = auth('api')->user();
                $package = Package::findOrFail($request->package_id);
                Log::info('VNPay Package Payment Creation', [
                    'user_id' => $user->id,
                    'package_id' => $request->package_id,
                    'package_name' => $package->name,
                    'package_price' => $package->discounted_price
                ]);
                if ($this->hasActivePackage($user->id)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Bạn đã có gói cước đang hoạt động. Vui lòng đợi gói hiện tại hết hạn.',
                        'error_code' => 'ACTIVE_PACKAGE_EXISTS'
                    ], 422);
                }
                // Tạo package_id unique cho payment
                $packagePaymentId = 'PKG_' . $request->package_id . '_' . time() . '_' . rand(100, 999);

                // Tạo user_package record với status pending
                $userPackage = UserPackage::create([
                    'user_id' => $user->id,
                    'package_id' => $request->package_id,
                    'order_id' => $packagePaymentId, // Vẫn lưu vào order_id field cho tương thích
                    'amount' => $package->discounted_price,
                    'payment_method' => 'vnpay',
                    'payment_status' => 'pending',
                    'status' => 'pending',
                ]);

                // Tạo payment URL
                $paymentUrl = $this->vnpayService->createPaymentUrlForOrder(
                    $packagePaymentId,
                    $package->discounted_price,
                    "Thanh toan goi {$package->name}"
                );

                return response()->json([
                    'success' => true,
                    'payment_url' => $paymentUrl,
                    'message' => 'Tạo payment URL thành công',
                    'data' => [
                        'package_payment_id' => $packagePaymentId,
                        'package_id' => $request->package_id,
                        'amount' => $package->discounted_price,
                        'package_name' => $package->name,
                        'user_package_id' => $userPackage->id
                    ]
                ]);
            } catch (\Exception $e) {
                Log::error('VNPay Package Payment Error', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'request' => $request->all()
                ]);
                throw $e;
            }
        });
    }

    /**
     * Tạo payment URL trực tiếp
     */
    private function createDirectPayment(Request $request): JsonResponse
    {
        $request->validate([
            'package_id' => 'required|integer',
            'amount' => 'required|numeric|min:1000', // Tối thiểu 1000 VND
            'order_info' => 'nullable|string|max:255',
        ]);

        $packagePaymentId = 'PKG_' . $request->package_id . '_' . time() . '_' . rand(100, 999);

        $paymentUrl = $this->vnpayService->createPaymentUrlForOrder(
            $packagePaymentId,
            $request->amount,
            $request->order_info
        );

        return response()->json([
            'success' => true,
            'payment_url' => $paymentUrl,
            'message' => 'Tạo payment URL thành công'
        ]);
    }

    // kiểm tra người dùng có gói đang hoạt động hay không
    public function hasActivePackage(int $userId): bool
    {
        return UserPackage::query()
            ->where('user_id', $userId)
            ->where('status', 'active') // Chỉ tính gói đã active
            ->where('payment_status', 'completed') // Chỉ tính gói đã thanh toán thành công
            ->where('ends_at', '>', now()) // Gói chưa hết hạn
            ->exists();
    }
    /**
     * Xử lý callback từ VNPay
     */
    public function handleReturn(Request $request): JsonResponse
    {
        try {
            $result = $this->vnpayService->handlePaymentResult($request->all());

            if ($result['success']) {
                // Cập nhật trạng thái đơn hàng trong database - chỉ khi có data hợp lệ
                if (!empty($result['data']) && isset($result['data']['order_id'])) {
                    $this->updatePackageStatus($result['data']);

                    return response()->json([
                        'success' => true,
                        'message' => 'Thanh toán thành công',
                        'data' => $result['data']
                    ]);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Thanh toán thành công nhưng thiếu thông tin gói hội viên',
                        'debug_info' => [
                            'callback_data' => $request->all(),
                            'service_result' => $result
                        ]
                    ], 400);
                }
            } else {
                // Thanh toán thất bại - chỉ cập nhật status khi có data hợp lệ
                if (!empty($result['data']) && isset($result['data']['order_id'])) {
                    $this->updatePackageStatus($result['data'], false, $result['message']);
                } else {
                    Log::warning('VNPay Failed and no valid data to update', [
                        'message' => $result['message'],
                        'callback_data' => $request->all()
                    ]);
                }

                return response()->json([
                    'success' => false,
                    'message' => $result['message'],
                    'data' => $result['data'],
                    'debug_info' => [
                        'callback_data' => $request->all(),
                        'reason' => 'Payment failed or signature verification failed'
                    ]
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('VNPay Callback Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'callback_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Lỗi xử lý callback: ' . $e->getMessage(),
                'debug_info' => [
                    'callback_data' => $request->all(),
                    'error_message' => $e->getMessage()
                ]
            ], 500);
        }
    }

    /**
     * Cập nhật trạng thái gói hội viên
     */
    private function updatePackageStatus(?array $data, bool $success = true, string $failureReason = ''): void
    {
        if (empty($data)) {
            Log::warning('VNPay updatePackageStatus: Empty data provided', [
                'success' => $success,
                'failure_reason' => $failureReason
            ]);
            return;
        }

        $packagePaymentId = $data['order_id'] ?? ''; // Vẫn dùng order_id field để tương thích

        if (!$packagePaymentId) {
            Log::warning('VNPay updatePackageStatus: Missing package_payment_id', ['data' => $data]);
            return;
        }

        $userPackage = UserPackage::where('order_id', $packagePaymentId)->first();

        if (!$userPackage) {
            Log::warning("UserPackage not found for package_payment_id: {$packagePaymentId}");
            return;
        }

        if ($success) {
            // Thanh toán thành công
            $userPackage->update([
                'payment_status' => 'completed',
                'status' => 'active',
                'transaction_id' => $data['transaction_id'] ?? null,
                'payment_at' => now(),
                'payment_data' => json_encode($data['raw_data'] ?? []),
                'starts_at' => now(),
                'ends_at' => $this->calculateEndDate($userPackage->package_id),
            ]);

            Log::info('VNPay Package Payment Success - Package Updated', [
                'package_payment_id' => $packagePaymentId,
                'user_package_id' => $userPackage->id,
                'package_id' => $userPackage->package_id,
                'transaction_id' => $data['transaction_id'] ?? null
            ]);
        } else {
            // Thanh toán thất bại
            $userPackage->update([
                'payment_status' => 'failed',
                'status' => 'cancelled',
                'payment_data' => json_encode([
                    'error' => $failureReason,
                    'raw_data' => $data['raw_data'] ?? []
                ]),
            ]);

            Log::warning('VNPay Package Payment Failed - Package Updated', [
                'package_payment_id' => $packagePaymentId,
                'user_package_id' => $userPackage->id,
                'package_id' => $userPackage->package_id,
                'failure_reason' => $failureReason
            ]);
        }
    }

    /**
     * Tính toán ngày kết thúc package
     */
    private function calculateEndDate(int $packageId): \Carbon\Carbon
    {
        $package = Package::find($packageId);

        if (!$package || !$package->duration_months) {
            return now()->addMonths(1); // Default 1 month
        }

        return now()->addMonths($package->duration_months);
    }
}
