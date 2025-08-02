<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use Google\Service\AnalyticsReporting\ReportRequest;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        try {
            $filters = $request->only(['page', 'keyword', 'sort_order', 'per_page']);
            $categories = $this->categoryService->getAllCategories($filters);
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);
        try {
            $category = $this->categoryService->createCategory($validatedData);
            return response()->json([
                'message' => 'Danh mục đã được tạo thành công.',
                'category' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi tạo danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        try {
            $category = $this->categoryService->updateCategory($id, $validatedData);
            if (!$category) {
                return response()->json(['message' => 'Danh mục không tồn tại.'], 404);
            }
            return response()->json([
                'message' => 'Danh mục đã được cập nhật thành công.',
                'category' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi cập nhật danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $category = $this->categoryService->getCategoryById($id);
            if (!$category) {
                return response()->json(['message' => 'Danh mục không tồn tại.'], 404);
            }
            return response()->json($category);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy thông tin danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy categories với formats tối ưu
     */
    public function getCategoriesWithFormats()
    {
        try {
            $categories = $this->categoryService->getAllCategoriesWithFormats();
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy categories cho sách điện tử với limit
     */
    public function getEbookCategories(Request $request)
    {
        try {
            $limit = $request->get('limit', 1);

            $categories = $this->categoryService->getEbookCategories();
            $limitedCategories = $categories->take($limit);

            return response()->json([
                'data' => $limitedCategories->values(),
                'total' => $categories->count(),
                'limit' => $limit,
                'has_more' => $categories->count() > $limit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách danh mục sách điện tử.',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function getAllEbookCategories()
    {
        try {
            $categories = $this->categoryService->getEbookCategories();
            return response()->json(['data' => $categories]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách danh mục sách điện tử.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getAllAudiobookCategories()
    {
        try {
            $categories = $this->categoryService->getAudiobookCategories();
            return response()->json(['data' => $categories]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách danh mục sách nói.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

      public function getBookCategories(Request $request)
    {
        try {
            $limit = $request->get('limit', 1);
            $categories = $this->categoryService->getBookCategories();
            $limitedCategories = $categories->take($limit);

            return response()->json([
                'data' => $limitedCategories->values(),
                'total' => $categories->count(),
                'limit' => $limit,
                'has_more' => $categories->count() > $limit,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách danh mục sách nói.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy categories cho sách nói
     */
    public function getAudiobookCategories(Request $request)
    {
        try {
            $limit = $request->get('limit', 1);
            $categories = $this->categoryService->getAudiobookCategories();
            $limitedCategories = $categories->take($limit);

            return response()->json([
                'data' => $limitedCategories->values(),
                'total' => $categories->count(),
                'limit' => $limit,
                'has_more' => $categories->count() > $limit,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách danh mục sách nói.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
