<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;

class BookDetaiController extends Controller
{

    protected UserService $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    public function getEbook($slug)
    {
        try {
            $ebook = $this->userService->getEbook($slug);
            if (!$ebook) {
                return response()->json(['message' => 'Ebook không tồn tại.'], 404);
            }
            return response()->json($ebook, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy ebook.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getEbookReader($slug)
    {
        try {
            $ebook = $this->userService->getEbookReader($slug);
            if (!$ebook) {
                return response()->json(['message' => 'Ebook không tồn tại.'], 404);
            }
            return response()->json($ebook, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy ebook.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
