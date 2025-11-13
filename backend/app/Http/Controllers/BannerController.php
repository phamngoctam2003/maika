<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\BannerService;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    protected BannerService $bannerService;
    public function __construct(BannerService $bannerService)
    {
        $this->bannerService = $bannerService;
    }
     public function index(Request $request)
    {
        try {
            $filters = $request->only(['page', 'keyword', 'sort_order', 'per_page']);
            $banners = $this->bannerService->getAllBanners($filters);
            return response()->json($banners);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách banners.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'required|file',
            'link' => 'nullable|url',
            'sort_order' => 'nullable|integer',
            'status' => 'required|boolean',
        ]);
        try {
            $this->bannerService->createBanner($validatedData);
            return response()->json([
                'message' => 'Banner đã được tạo thành công.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi tạo banner.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            $this->bannerService->deleteBanner($id);
            return response()->json([
                'message' => 'Banner đã được xóa thành công.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi xóa banner.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
