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

    public function create(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'duration_months' => 'required|numeric',
            'original_price' => 'required|numeric',
            'discounted_price' => 'nullable|numeric',
            'discount_percent' => 'nullable|numeric',
            'highlight_label' => 'nullable|string',
            'is_best_offer' => 'nullable|boolean'
        ]);

        $package = $this->packageService->createPackage($data);

        return response()->json([
            'success' => true,
            'data' => $package,
            'message' => 'Package created successfully'
        ]);
    }
    public function update($id, Request $request){
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'duration_months' => 'required|numeric',
            'original_price' => 'required|numeric',
            'discounted_price' => 'nullable|numeric',
            'discount_percent' => 'nullable|numeric',
            'highlight_label' => 'nullable|string',
            'is_best_offer' => 'nullable|boolean'
        ]);

        $package = $this->packageService->updatePackage($id, $data);

        if (!$package) {
            return response()->json(['message' => 'Gói không tồn tại.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $package,
            'message' => 'Package updated successfully'
        ]);
    }
     public function delete(Request $request)
    {
        $ids = $request->ids;
        try {
            foreach ($ids as $id) {
                $package = $this->packageService->getPackageById($id);
                if ($package->users()->exists()) {
                    return response()->json([
                        'message' => "Không thể xóa gói '{$package->name}' vì đang có người dùng đăng ký.",
                        'error' => 'Gói có người dùng liên kết'
                    ], 400);
                }
                if (!$package) {
                    return response()->json(['message' => 'Gói không tồn tại.'], 404);
                }
            }
            $result = $this->packageService->deletePackages($ids);
            if ($result) {
                return response()->json(['message' => 'Xóa thành công', 'status' => 200]);
            } else {
                return response()->json(['message' => 'Xóa thất bại', 'status' => 'error'], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi xóa gói cước.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id){
        $package = $this->packageService->getPackageById($id);
        if (!$package) {
            return response()->json(['message' => 'Gói không tồn tại.'], 404);
        }
        return response()->json( $package);
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
