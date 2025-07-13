<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    //
    protected UserService $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    public function getLatest()
    {
        try {
            $books = $this->userService->getLatest();
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
        $book = $this->userService->getEbook($slug);
        try {
            $this->userService->increaseView($slug);
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
            $books = $this->userService->getRanking();
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
            $books = $this->userService->getProposed();
            return response()->json($books, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy sách đề xuất.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getBooksByCategory($categorySlug, Request $request)
    {
        try {
            $limit = $request->get('limit', 12);
            $books = $this->userService->getBooksByCategory($categorySlug, $limit);
            return response()->json($books, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy sách theo danh mục.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
