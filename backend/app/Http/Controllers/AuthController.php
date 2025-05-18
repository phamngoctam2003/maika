<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'refresh', 'me']]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        $credentials = $request->only('email', 'password');
        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Tài khoản không tồn tại hoặc mật khẩu không chính xác!'
            ]);
        }
        $user = auth('api')->user();
        if($user->status == 0){
            return response()->json([
                'message' => 'Tài khoản của bạn đã bị khóa!'
            ]);
        }
        return $this->respondWithToken($token);
    }

    public function register(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);
        try {
            $user = User::create([
                'fullName' => $request->fullName,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => hash::make($request->password),
            ]);
            auth('api')->login($user);
            $credentials = $request->only('email', 'password');
            $token = auth('api')->attempt($credentials);
            return $this->respondWithToken($token);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đăng ký tài khoản thất bại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function me()
    {
        $user = auth('api')->user();

        return response()->json([
            'user' => $user ? [
                'status' => $user->status ?? null,
                'fullName' => $user->fullName ?? null,
                'image' => $user->image ?? null,
                'role' => $user->role ?? null,
            ] : null,
            'message' => $user ? 'Tài khoản đã đăng nhập' : 'Chưa đăng nhập'
        ]);
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Đã đăng xuất!']);
    }

    public function refresh()
    {
        try {
            if (!auth('api')->user()) {
                return response()->json(['message' => 'Unauthorized', 'user' => null], 200);
            }
            return $this->respondWithToken(JWTAuth::refresh());
        } catch (\Exception $e) {
            return response()->json(['message' => 'token không hợp lệ!', 'token' => null], 200);
        }
    }

    public function respondWithToken($token)
    {
        $expires_in = JWTAuth::factory()->getTTL() * 60;
        $user = auth('api')->user();
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'status' => $user->status,
                'fullName' => $user->fullName,
                'imgae' => $user->imgae,
                'role' => $user->role,
            ],
            'expires_in' => $expires_in,
        ]);
    }
}
