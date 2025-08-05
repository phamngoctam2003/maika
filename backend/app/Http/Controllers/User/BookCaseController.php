<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Books;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookCaseController extends Controller
{
    /**
     * Đảm bảo tất cả các route trong controller này đều yêu cầu xác thực.
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Thêm một sách vào tủ sách của người dùng.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|integer|exists:books,id',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $bookId = $validated['book_id'];

        // Sử dụng syncWithoutDetaching để thêm mà không tạo bản ghi trùng lặp.
        // Phương thức này sẽ không báo lỗi nếu sách đã có trong tủ.
        $syncResult = $user->bookCase()->syncWithoutDetaching([$bookId]);

        // Kiểm tra xem có bản ghi nào được "attach" (thêm mới) không
        if (!empty($syncResult['attached'])) {
            return response()->json(['message' => 'Đã thêm sách vào tủ sách thành công!'], 201); // 201 Created
        }

        // Nếu không có gì được thêm mới, nghĩa là sách đã tồn tại
        return response()->json(['message' => 'Sách này đã có trong tủ sách của bạn.'], 200); // 200 OK
    }

    /**
     * Xóa một sách khỏi tủ sách của người dùng.
     *
     * @param Books $book
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Books $book)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Sử dụng detach để xóa bản ghi khỏi bảng trung gian.
        // detach() trả về số lượng bản ghi đã được xóa.
        $detachedCount = $user->bookCase()->detach($book->id);

        if ($detachedCount > 0) {
            return response()->json(['message' => 'Đã xóa sách khỏi tủ sách thành công!'], 200);
        }

        return response()->json(['message' => 'Sách không có trong tủ sách của bạn.'], 404);
    }

    public function getBookCase() {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Lấy tất cả sách trong tủ sách của người dùng
        $books = $user->bookCase()->with('categories')->get();

        if ($books->isEmpty()) {
            return response()->json(['message' => 'Tủ sách yêu thích của bạn hiện tại trống'], 404);
        }

        return response()->json($books, 200);
    }
}
