<?php

namespace App\Services;

use App\Models\Package;
use App\Models\UserPackage;
use App\Contracts\PackageRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PackageService
{
    protected PackageRepositoryInterface $packageRepository;

    public function __construct(PackageRepositoryInterface $packageRepository)
    {
        $this->packageRepository = $packageRepository;
    }
    public function getAllPackages(array $filters = []): LengthAwarePaginator
    {
        return $this->packageRepository->getAll($filters);
    }
    public function getAllPackagesWithUserPurchaseStatus(?int $userId = null): \Illuminate\Support\Collection
    {
        return $this->packageRepository->getAllPackagesWithUserPurchaseStatus($userId);
    }

    public function setUserPackage(int $packageId): UserPackage
    {
        return $this->packageRepository->setUserPackage($packageId);
    }

}
