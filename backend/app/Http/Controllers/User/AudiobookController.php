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

        public function stream(Request $request, $path)
    {
        $fullPath = storage_path('app/public/' . $path);

        if (!file_exists($fullPath)) {
            abort(401);
        }

        $size = filesize($fullPath);
        $file = fopen($fullPath, 'rb');
        $start = 0;
        $end = $size - 1;

        if ($request->headers->has('Range')) {
            preg_match('/bytes=(\d+)-(\d+)?/', $request->header('Range'), $matches);
            $start = intval($matches[1]);
            if (isset($matches[2])) {
                $end = intval($matches[2]);
            }
            fseek($file, $start);
            $status = 206;
        } else {
            $status = 200;
        }

        $length = $end - $start + 1;

        $headers = [
            'Content-Type' => mime_content_type($fullPath),
            'Accept-Ranges' => 'bytes',
            'Content-Range' => "bytes $start-$end/$size",
            'Content-Length' => $length,
            'Content-Disposition' => 'inline; filename="' . basename($fullPath) . '"',
        ];

        return response()->stream(function () use ($file, $length) {
            $buffer = 1024 * 8;
            while (!feof($file) && $length > 0) {
                echo fread($file, min($buffer, $length));
                $length -= $buffer;
                ob_flush();
                flush();
            }
            fclose($file);
        }, $status, $headers);
    }

    public function getAudiobooksByCategory($categorySlug, Request $request)
    {
        try {
            $limit = $request->get('limit', 12);
            $books = $this->bookService->getAudiobooksByCategory($categorySlug, $limit);
            return response()->json($books, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy sách theo danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
