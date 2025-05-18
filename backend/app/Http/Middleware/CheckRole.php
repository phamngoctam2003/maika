<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = auth('api')->user();
        if (!$user) {
            return response()->json(['message' => 'Tài khoản không tồn tại!, vui lòng đăng nhập lại'], 401);
        }
        $freshUser = User::find($user->id);
        // kiểm tra role hiện tại có trong danh sách role cho phép không
        if(!in_array($freshUser->role, $roles)){
            return response()->json(['message' => 'Bạn không có quyền truy cập!'], 403);
        }
        return $next($request);
    }
}
