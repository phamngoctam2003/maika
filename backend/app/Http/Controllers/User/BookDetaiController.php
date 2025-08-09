<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Models\User;

class BookDetaiController extends Controller
{

    protected UserService $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    public function getBook($slug)
    {
        try {
            $ebook = $this->userService->getBook($slug);
            if (!$ebook) {
                return response()->json(['message' => 'Book không tồn tại.'], 404);
            }

            // Mặc định sách chưa được lưu
            $ebook->is_saved_in_bookcase = false;

            /** @var \App\Models\User|null $user */
            $user = auth('api')->user();

            // Nếu người dùng đã đăng nhập, kiểm tra xem sách đã có trong tủ sách chưa
            if ($user) {
                $isSaved = $user->bookCase()->where('book_id', $ebook->id)->exists();
                $ebook->is_saved_in_bookcase = $isSaved;
            }
            $averageRating = app(\App\Services\BookCommentService::class)->getAverageRatingByBook($ebook->id);
            $ebook->average_rating = $averageRating;
            return response()->json($ebook, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy sách.',
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

            // Kiểm tra quyền truy cập nếu sách yêu cầu hội viên
            if ($ebook->access_type === 'member') {
                /** @var \App\Models\User|null $user */
                $user = auth('api')->user();

                if (!$user) {
                    return response()->json([
                        'message' => 'Sách này dành cho hội viên. Vui lòng đăng nhập để tiếp tục.',
                        'error_code' => 'LOGIN_REQUIRED',
                        'access_type' => $ebook->access_type
                    ], 401);
                }

                // Kiểm tra user có gói hội viên active không
                if (!$user->hasMembership()) {
                    return response()->json([
                        'message' => 'Sách này dành cho hội viên. Vui lòng nâng cấp tài khoản để đọc.',
                        'error_code' => 'MEMBERSHIP_REQUIRED',
                        'access_type' => $ebook->access_type,
                        'user_membership' => [
                            'has_membership' => false,
                            'active_package' => null
                        ]
                    ], 403);
                }

                // Log successful access for member book
                \Illuminate\Support\Facades\Log::info('Member book access granted', [
                    'user_id' => $user->id,
                    'book_slug' => $slug,
                    'book_id' => $ebook->id,
                    'access_type' => $ebook->access_type
                ]);
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
