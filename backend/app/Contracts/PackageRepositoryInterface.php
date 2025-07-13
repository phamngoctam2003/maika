<?php

namespace App\Contracts;

use Illuminate\Support\Collection;
use App\Models\UserPackage;
interface PackageRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Check if a user has purchased any package.
     *
     * @param int $userId
     * @return bool
     */
    public function hasUserPurchasedAnyPackage(int $userId): bool;
    public function getAllPackagesWithUserPurchaseStatus(?int $userId = null): Collection;
    public function canUserPurchasePackage(int $userId): bool;
    public function setUserPackage(int $packageId): UserPackage;
    public function purchasePackageWithVnpay(int $packageId, array $paymentData = []): array;
    public function handleVnpayCallback(array $callbackData): array;
    public function handleVnpayFailure(string $orderId, string $reason = ''): array;
    public function cleanupPendingPackages(): int;
    public function cancelPendingPackage(string $orderId): array;

    /**
     * Get the count of packages purchased by a user.
     *
     * @param int $userId
     * @return int
     */

}

