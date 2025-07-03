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
            $users = $this->userService->getLatest();
            if ($users->isEmpty()) {
                return response()->json(['message' => 'Không có người dùng nào.'], 404);
            }
            return response()->json($users, 200);
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
        if (!$book) {
            return response()->json(['message' => 'Sách không tồn tại.'], 404);
        }
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
}
