<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{

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
        $user = User::where('email', $request->email)->first();
        if ($user->status === 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tài khoản của bạn đã bị khóa'
            ], 401);
        }
        return $this->respondWithToken($token);
    }

    public function loginGoogle(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string'
        ]);

        $accessToken = $request->input('access_token');

        try {
            $client = new GoogleClient();
            $client->setAccessToken($accessToken);
            $oauth2 = new \Google\Service\Oauth2($client);
            $googleUser = $oauth2->userinfo->get();
        } catch (\Exception $e) {
            return response()->json([
                'status' => 401,
                'message' => 'Token Google không hợp lệ: ' . $e->getMessage()
            ], 401);
        }

        $user = User::where('email', $googleUser->email)->first();

        if ($user) {
            $user->update([
                'google_id' => $googleUser->id,
                'is_verify' => 1,
            ]);
        } else {
            $user = User::create([
                'fullName' => $googleUser->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'password' => Hash::make(Str::random(28)),
                'is_verify' => 1,
                'status' => 1,
            ]);
            $user->assignRole('user');
        }
        if ($user->status === 0) {
            return response()->json([
                'status' => 403,
                'message' => 'Tài khoản của bạn đã bị khóa'
            ], 403);
        }

        if ($user->image == null) {
            // Lấy ảnh từ link của Google
            try {
                $response = Http::get($googleUser->picture);
                if ($response->successful()) {
                    $extension = 'jpg';
                    $namefile = 'avatars/' . Str::uuid() . '.' . $extension;
                    Storage::disk('public')->put($namefile, $response->body());
                } else {
                    $namefile = null;
                }
            } catch (\Exception $e) {
                $namefile = null;
            }
            $user->image = $namefile;
            $user->save();
        }
        // Tạo JWT token (dùng tymon/jwt-auth)
        /** @var \Tymon\JWTAuth\JWTGuard $guard */
        $guard = auth('api');
        $token = $guard->login($user);
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
            $user->assignRole('user');
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

    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }

        if ($user->status === 0) {
            return response()->json([
                'status' => 401,
                'message' => 'Tài khoản của bạn đã bị khóa'
            ], 401);
        }

        try {
            return response()->json([
                'status' => true,
                'user' => $user,
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'roles' => $user->getRoleNames(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Lỗi khi xử lý dữ liệu người dùng'
            ], 500);
        }
    }

    public function respondWithToken($token)
    {
        $expires_in = JWTAuth::factory()->getTTL() * 60;
        $user = auth()->guard('api')->user();

        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }

        if ($user->status === 0) {
            return response()->json([
                'status' => 401,
                'message' => 'Tài khoản của bạn đã bị khóa'
            ], 401);
        }

        try {
            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => $expires_in,
                'user' => [
                    'status' => $user->status,
                    'fullName' => $user->fullName,
                    'image' => $user->image,
                    'roles' => $user->roles ? $user->roles->pluck('name') : null,
                    'permissions' => $user->permissions ? $user->permissions->pluck('name') : null,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Lỗi khi xử lý dữ liệu người dùng'
            ], 500);
        }
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Đã đăng xuất!']);
    }

    public function refresh()
    {
        try {
            $user = auth()->guard('api')->user();
            if (!$user) {
                return response()->json([
                    'message' => 'Unauthorized',
                    'user' => null
                ], 200);
            }

            // Refresh token
            $newToken = JWTAuth::parseToken()->refresh();

            return $this->respondWithToken($newToken);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Token không hợp lệ!',
                'token' => null
            ], 200);
        }
    }
}
