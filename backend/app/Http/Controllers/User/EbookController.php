<?php

namespace App\Http\Controllers\User;

use App\Services\EbookService;
use Illuminate\Http\Request;
use App\Models\Books;

/**
 * Ebook Controller - Handles ebook-specific operations
 * Extends BaseBookController with EbookService for "Sách điện tử" format only
 * Used for /users/ebook/* routes
 */
class EbookController extends BaseBookController
{
    /**
     * Constructor - inject EbookService for ebook operations
     * @param EbookService $ebookService
     */
    public function __construct(EbookService $ebookService)
    {
        parent::__construct($ebookService);
    }

    public function getEbooksCategorySlug(Request $request, $slug)
    {
        try {
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 12);

            // Lấy sách theo category slug với pagination
            $books = $this->bookService->getEbookCategorySlug($slug, $page, $limit);

            // Tính tổng số sách để xác định has_more
            $totalCount = Books::whereHas('categories', function ($query) use ($slug) {
                $query->where('slug', $slug);
            })
                ->whereHas('formats', function ($query) {
                    $query->where('name', 'Sách điện tử');
                })
                ->count();

            return response()->json([
                'data' => $books,
                'total' => $totalCount,
                'page' => $page,
                'limit' => $limit,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách sách theo danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getEbooksByCategory($categorySlug, Request $request)
    {
        try {
            $limit = $request->get('limit', 12);
            $books = $this->bookService->getEbooksByCategory($categorySlug, $limit);
            return response()->json($books, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy sách theo danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
