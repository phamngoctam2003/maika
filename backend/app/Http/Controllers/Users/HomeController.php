<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Services\ClientService;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    //
    protected ClientService $clientService;
    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }
    public function getLatest ()
    {
        try {
            $users = $this->clientService->getLatest();
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
