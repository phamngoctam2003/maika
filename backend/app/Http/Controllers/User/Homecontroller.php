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
    public function getLatest ()
    {
        try {
            $users = $this->userService->getLatest();
            if ($users->isEmpty()) {
                return response()->json(['message' => 'Không có người dùng nào.'], 404);
            }
            return response()->json($users, 200);
        }catch( \Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy dữ liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
}