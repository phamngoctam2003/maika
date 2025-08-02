<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

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
        return $this->respondWithToken($token, $user);
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
                'message' => 'Tài khoản của bạn đã bị khóa',
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
        /** @var \Tymon\JWTAuth\JWTGuard $guard */
        $guard = auth('api');
        $token = $guard->login($user);
        return $this->respondWithToken($token, $user);
    }

    public function register(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'string|size:10|nullable',
            'password' => 'required|string|min:6|confirmed',
        ]);
        try {
            $user = User::create([
                'fullName' => $request->fullName,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
            ]);
            $user->assignRole('user');
            $token = auth('api')->login($user);
            return $this->respondWithToken($token, $user);
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
            // Load thông tin packages cùng với pivot data
            $user->load(['packages' => function($query) {
                $query->withPivot([
                    'id',
                    'starts_at', 
                    'ends_at', 
                    'status', 
                    'payment_method', 
                    'payment_status',
                    'amount',
                    'created_at',
                    'updated_at'
                ]);
            }]);

            // Lấy gói active đầu tiên (nếu có)
            $activePackage = $user->getActivePackage();
            
            // Format thông tin gói hội viên để gửi về frontend
            $membershipInfo = null;
            if ($activePackage) {
                $membershipInfo = [
                    'package_id' => $activePackage->id,
                    'package_name' => $activePackage->name,
                    'starts_at' => $activePackage->pivot->starts_at,
                    'ends_at' => $activePackage->pivot->ends_at,
                    'status' => $activePackage->pivot->status,
                    'payment_method' => $activePackage->pivot->payment_method,
                    'amount' => $activePackage->pivot->amount,
                    'is_expiring_soon' => $user->isMembershipExpiringSoon(),
                    'has_membership' => true
                ];
            }

            return response()->json([
                'status' => true,
                'user' => $user,
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'roles' => $user->getRoleNames(),
                // Thông tin gói hội viên
                'membership' => $membershipInfo,
                'has_membership' => $user->hasMembership(),
                // Tất cả packages của user (để debug hoặc hiển thị lịch sử)
                'user_packages' => $user->packages->map(function($package) {
                    return [
                        'id' => $package->pivot->id,
                        'package_id' => $package->id,
                        'package_name' => $package->name,
                        'starts_at' => $package->pivot->starts_at,
                        'ends_at' => $package->pivot->ends_at,
                        'status' => $package->pivot->status,
                        'payment_method' => $package->pivot->payment_method,
                        'amount' => $package->pivot->amount,
                        'created_at' => $package->pivot->created_at,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Lỗi khi xử lý dữ liệu người dùng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function respondWithToken($token, $user = null)
    {
        $expires_in = JWTAuth::factory()->getTTL() * 60;
        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Không tìm thấy thông tin người dùng'
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
                    'id' => $user->id,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'fullName' => $user->fullName,
                    'image' => $user->image,
                    'gender' => $user->gender,
                    'birthDay' => $user->birthDay,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
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
            // The refresh method will automatically invalidate the old token and return a new one.
            $token = JWTAuth::refresh();
            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
            ]);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Token không hợp lệ!'], 401);
        } catch (JWTException $e) {
            // This can happen if the token is blacklisted, expired and cannot be refreshed, etc.
            return response()->json(['message' => 'Không thể làm mới token. ' . $e->getMessage()], 401);
        }
    }

    /**
     * Cập nhật thông tin cá nhân của người dùng đã xác thực.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 401);
        }

        // Xác thực dữ liệu đầu vào. 'sometimes' có nghĩa là chỉ validate nếu trường đó tồn tại trong request.
        $validatedData = $request->validate([
            'fullName' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|size:10',
            'birthDay' => 'nullable|date_format:Y-m-d',
            'gender' => 'nullable|string|in:Nam,Nữ,Khác',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Giới hạn ảnh 2MB
        ]);

        // Xử lý tải lên file ảnh đại diện
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ nếu nó tồn tại để tránh rác server
            if ($user->image && Storage::disk('public')->exists($user->image)) {
                Storage::disk('public')->delete($user->image);
            }
            // Lưu ảnh mới vào thư mục 'avatars' trong storage/app/public
            $path = $request->file('image')->store('avatars', 'public');
            $user->image = $path;
        }

        // Cập nhật các trường khác nếu chúng được gửi lên
        // Sử dụng $request->has() để đảm bảo chỉ cập nhật những gì người dùng gửi
        if ($request->has('fullName')) {
            $user->fullName = $validatedData['fullName'];
        }
        // Cập nhật các trường khác tương tự...
        $user->fill($request->only(['phone', 'birthDay', 'gender']));

        $user->save();

        // Trả về thông báo thành công và dữ liệu người dùng mới nhất
        return response()->json([
            'message' => 'Cập nhật thông tin thành công!',
            'user' => $user->fresh() // Dùng fresh() để lấy dữ liệu mới nhất từ DB
        ], 200);
    }

    /**
     * Đổi mật khẩu cho user đã đăng nhập.
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Mật khẩu hiện tại không đúng.'
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Đổi mật khẩu thành công!'
        ]);
    }

    /**
     * Lấy lịch sử giao dịch của user (bảng user_packages).
     */
    public function transactionHistories(Request $request)
    {
        $user = $request->user();

        // Lấy tất cả các bản ghi user_packages của user, join với bảng packages để lấy tên gói
        $histories = $user->packages()
            ->withPivot([
                'id',
                'starts_at',
                'ends_at',
                'status',
                'payment_method',
                'payment_status',
                'amount',
                'created_at',
                'updated_at'
            ])
            ->get()
            ->map(function($package) {
                return [
                    'id' => $package->pivot->id,
                    'package_id' => $package->id,
                    'package_name' => $package->name,
                    'amount' => $package->pivot->amount,
                    'payment_method' => $package->pivot->payment_method,
                    'payment_status' => $package->pivot->payment_status, // status thanh toán: success/failed
                    'status' => $package->pivot->status,
                    'starts_at' => $package->pivot->starts_at,
                    'ends_at' => $package->pivot->ends_at,
                    'created_at' => $package->pivot->created_at,
                ];
            });

        return response()->json($histories);
    }
}
