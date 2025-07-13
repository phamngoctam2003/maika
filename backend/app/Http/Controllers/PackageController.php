<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PackageService;
use App\Http\Controllers\Controller;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PackageController extends Controller
{
    protected $packageService;
    public function __construct(PackageService $packageService)
    {
        $this->packageService = $packageService;
        $this->middleware('auth:api')->only(['setUserPackage']);
    }
    public function index(Request $request)
    {
        $filters = $request->only(['keyword', 'sort_order', 'per_page']);
        return $this->packageService->getAllPackages($filters);
    }
    public function getPackagesWithUser(Request $request)
    {
        // Lấy userId từ token authentication (có thể null nếu chưa đăng nhập)
        $userId = auth('api')->id();

        $packages = $this->packageService->getAllPackagesWithUserPurchaseStatus($userId);

        return response()->json([
            'success' => true,
            'data' => $packages,
            'message' => 'Packages retrieved successfully'
        ]);
    }



    public function setUserPackage(Request $request)
    {
        // Validate input
        $request->validate([
            'package_id' => 'required|integer|exists:packages,id'
        ]);

        $packageId = $request->input('package_id');
        
        try {
            $userPackage = $this->packageService->setUserPackage($packageId);
            return response()->json([
                'status' => true,
                'data' => $userPackage,
                'message' => 'Thành công đăng ký gói cước'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // payment

   
}
