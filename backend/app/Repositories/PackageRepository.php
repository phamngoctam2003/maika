<?php

namespace App\Repositories;

use App\Contracts\PackageRepositoryInterface;
use App\Models\Package;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\UserPackage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class PackageRepository implements PackageRepositoryInterface
{

    public function getAll(array $filters = []): LengthAwarePaginator
    {

        $query = Package::with('users');

        if (isset($filters['keyword'])) {
            $query->where('name', 'like', '%' . $filters['keyword'] . '%');
        }

        // Sort
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy('created_at', $sortOrder);

        // Paginate
        $perPage = $filters['per_page'] ?? 10;

        return $query->paginate($perPage);
    }
    public function getById(int $id): ?Package
    {
        return Package::where('id', $id)->first();
    }
    public function create(array $data): Package
    {
        $user = auth('api')->user();
        if (!$user) {
            throw new \Exception('User not authenticated');
        }
        $data['user_id'] = $user->id;

        return Package::create($data);
    }
    public function update(int $id, array $data): ?Package
    {
        $package = $this->getById($id);
        if ($package) {
            $package->update($data);
            return $package;
        }
        return null;
    }
    public function delete(array $ids): ?bool
    {
        if (is_array($ids) && !empty($ids)) {
            Package::whereIn('id', $ids)->delete();
            return true;
        }
        return false;
    }

    public function search(string $query): LengthAwarePaginator
    {
        return Package::where('name', 'like', '%' . $query . '%')->paginate(10);
    }

    // user packages
    public function hasUserPurchasedAnyPackage(int $userId): bool
    {
        return Package::whereHas('users', function ($query) use ($userId) {
            $query->where('user_packages.user_id', $userId);
        })->exists();
    }

    public function getAllPackagesWithUserPurchaseStatus(?int $userId = null): Collection
    {
        // Nếu chưa đăng nhập, chỉ trả về packages mà không có thông tin purchase
        if (!$userId) {
            return Package::get()->map(function ($package) {
                $package->is_purchased = false;
                return $package;
            });
        }

        return Package::with(['users' => function ($query) use ($userId) {
            $query->where('user_packages.user_id', $userId)
                  ->where('user_packages.status', 'active')           // Chỉ lấy gói đang active
                  ->where('user_packages.payment_status', 'completed') // Chỉ lấy gói đã thanh toán thành công
                  ->where('user_packages.ends_at', '>', now());        // Chỉ lấy gói chưa hết hạn
        }])->get()->map(function ($package) {
            $package->is_purchased = $package->users->isNotEmpty();
            unset($package->users); // Remove users data, only keep is_purchased flag
            return $package;
        });
    }

    public function canUserPurchasePackage(int $userId): bool
    {
        // Kiểm tra user có gói đang active không
        return !$this->hasActivePackage($userId);
    }

    public function hasActivePackage(int $userId): bool
    {
        return UserPackage::query()
            ->where('user_id', $userId)
            ->where('status', 'active') // Chỉ tính gói đã active
            ->where('payment_status', 'completed') // Chỉ tính gói đã thanh toán thành công
            ->where('ends_at', '>', now()) // Gói chưa hết hạn
            ->exists();
    }

    public function setUserPackage(int $packageId): UserPackage
    {
        $userId = auth('api')->id();
        
        if (!$userId) {
            throw new \Exception('User not authenticated');
        }
        
        return DB::transaction(function () use ($userId, $packageId) {
            if ($this->hasActivePackage($userId)) {
                throw new \Exception('Bạn đã có gói cước đang hoạt động');
            }

            $package = Package::findOrFail($packageId);
            
            // Kiểm tra package có active không
            if (!isset($package->duration_months) || $package->duration_months <= 0) {
                throw new \Exception('Gói không hợp lệ');
            }
            
            $startsAt = now();
            $endsAt = now()->addMonths($package->duration_months);

            return UserPackage::create([
                'user_id' => $userId,
                'package_id' => $package->id,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'status' => 'active',
            ]);
        });
    }

    public function purchasePackageWithVnpay(int $packageId, array $paymentData = []): array
    {
        $userId = auth('api')->id();
        
        if (!$userId) {
            throw new \Exception('User not authenticated');
        }
        
        // Kiểm tra user có thể mua gói không
        if (!$this->canUserPurchasePackage($userId)) {
            throw new \Exception('Bạn đã có gói cước đang hoạt động');
        }
        
        $package = Package::findOrFail($packageId);
        
        // Validate amount
        if (!isset($package->discounted_price) || $package->discounted_price <= 0) {
            throw new \Exception('Giá gói không hợp lệ');
        }
        
        return DB::transaction(function () use ($userId, $package, $paymentData) {
            // Tạo order ID
            $orderId = 'PKG_' . now()->format('YmdHis') . '_' . $userId . '_' . $package->id;
            
            // Tạo UserPackage với trạng thái pending - KHÔNG active ngay
            $userPackage = UserPackage::create([
                'user_id' => $userId,
                'package_id' => $package->id,
                'starts_at' => null, // Sẽ set khi thanh toán thành công
                'ends_at' => null,
                'status' => 'pending', // Đặt pending, chỉ active khi thanh toán thành công
                'payment_method' => 'vnpay',
                'payment_status' => 'pending',
                'order_id' => $orderId,
                'amount' => $package->discounted_price, // Sử dụng discounted_price
                'payment_data' => json_encode($paymentData),
            ]);
            
            // Tạo VNPay payment URL
            $vnpayService = app(\App\Services\VnpayService::class);
            $paymentUrl = $vnpayService->createPaymentUrl([
                'order_id' => $orderId,
                'amount' => $package->discounted_price, // Sử dụng discounted_price
                'order_info' => 'Thanh toan goi cuoc: ' . $package->name,
                'order_type' => 'billpayment',
            ]);
            
            return [
                'success' => true,
                'payment_url' => $paymentUrl,
                'order_id' => $orderId,
                'amount' => $package->discounted_price,
                'package_id' => $package->id,
                'user_package_id' => $userPackage->id,
                'message' => 'Đã tạo link thanh toán thành công'
            ];
        });
    }

    /**
     * Xử lý kết quả thanh toán từ VNPay
     */
    public function handleVnpayCallback(array $callbackData): array
    {
        $vnpayService = app(\App\Services\VnpayService::class);
        $result = $vnpayService->handlePaymentResult($callbackData);
        
        if (!$result['success']) {
            return $result;
        }
        
        $orderId = $result['data']['order_id'];
        $transactionId = $result['data']['transaction_id'];
        $amount = $result['data']['amount'];
        
        return DB::transaction(function () use ($orderId, $transactionId, $amount, $result) {
            // Tìm UserPackage theo order_id
            $userPackage = UserPackage::where('order_id', $orderId)->first();
            
            if (!$userPackage) {
                throw new \Exception('Không tìm thấy đơn hàng');
            }
            
            // Cập nhật trạng thái thanh toán
            $startsAt = now();
            $endsAt = now()->addMonths($userPackage->package->duration_months);
            
            $userPackage->update([
                'payment_status' => 'completed',
                'status' => 'active',
                'transaction_id' => $transactionId,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'payment_at' => now(),
                'payment_data' => json_encode($result['data']),
            ]);
            
            return [
                'success' => true,
                'message' => 'Thanh toán thành công',
                'data' => [
                    'user_package' => $userPackage,
                    'order_id' => $orderId,
                    'transaction_id' => $transactionId,
                    'amount' => $amount,
                ]
            ];
        });
    }

    /**
     * Xử lý thanh toán thất bại
     */
    public function handleVnpayFailure(string $orderId, string $reason = ''): array
    {
        return DB::transaction(function () use ($orderId, $reason) {
            $userPackage = UserPackage::where('order_id', $orderId)->first();
            
            if (!$userPackage) {
                throw new \Exception('Không tìm thấy đơn hàng');
            }
            
            $userPackage->update([
                'payment_status' => 'failed',
                'status' => 'cancelled',
                'payment_data' => json_encode(['failure_reason' => $reason]),
            ]);
            
            return [
                'success' => true,
                'message' => 'Đã cập nhật trạng thái thanh toán thất bại',
                'data' => $userPackage
            ];
        });
    }

    /**
     * Dọn dẹp các UserPackage pending cũ (quá 30 phút)
     */
    public function cleanupPendingPackages(): int
    {
        $cleanedCount = UserPackage::where('status', 'pending')
            ->where('payment_status', 'pending')
            ->where('created_at', '<', now()->subMinutes(30))
            ->delete();

        return $cleanedCount;
    }

    /**
     * Hủy UserPackage pending theo order_id
     */
    public function cancelPendingPackage(string $orderId): array
    {
        return DB::transaction(function () use ($orderId) {
            $userPackage = UserPackage::where('order_id', $orderId)
                ->where('status', 'pending')
                ->first();
            
            if (!$userPackage) {
                throw new \Exception('Không tìm thấy đơn hàng hoặc đơn hàng đã được xử lý');
            }
            
            $userPackage->update([
                'status' => 'cancelled',
                'payment_status' => 'cancelled',
                'payment_data' => json_encode(['cancelled_at' => now()]),
            ]);
            
            return [
                'success' => true,
                'message' => 'Đã hủy đơn hàng thành công',
                'data' => $userPackage
            ];
        });
    }
}
