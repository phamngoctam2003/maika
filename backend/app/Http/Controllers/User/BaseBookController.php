<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Books;

abstract class BaseBookController extends Controller
{
    protected $bookService;

    public function __construct($bookService)
    {
        $this->bookService = $bookService;
    }

    public function getLatest()
    {
        try {
            $books = $this->bookService->getLatest();
            return response()->json($books, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy dữ liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function increaseView($slug)
    {
        try {
            $this->bookService->increaseView($slug);
            return response()->json(['message' => 'View sách đã được ghi nhận.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi ghi nhận view.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRanking()
    {
        try {
            $books = $this->bookService->getRanking();
            return response()->json($books, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy bảng xếp hạng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProposed()
    {
        try {
            $books = $this->bookService->getProposed();
            return response()->json($books, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy sách đề xuất.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    

}
