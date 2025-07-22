<?php

namespace App\Http\Controllers\User;

use App\Services\AudiobookService;
use Illuminate\Http\Request;
use App\Models\Books;

/**
 * Audiobook Controller - Handles audiobook-specific operations
 * Extends BaseBookController with AudiobookService for "Sách nói" format only
 * Used for /users/audiobook/* routes
 */
class AudiobookController extends BaseBookController
{
    /**
     * Constructor - inject AudiobookService for audiobook operations
     * @param AudiobookService $audiobookService
     */
    public function __construct(AudiobookService $audiobookService)
    {
        parent::__construct($audiobookService);
    }

    public function getAudiobooksCategorySlug(Request $request, $slug)
    {
        try {
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 12);
            
            // Lấy sách theo category slug với pagination
            $books = $this->bookService->getAudiobooksCategorySlug($slug, $page, $limit);
            
            // Tính tổng số sách để xác định has_more  
            $totalCount = Books::whereHas('categories', function ($query) use ($slug) {
                $query->where('slug', $slug);
            })
            ->whereHas('formats', function ($query) {
                $query->where('name', 'Sách nói');
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
}
