<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Books;
use App\Models\ListeningProgress;

class ListeningProgressController extends Controller
{
    /**
     * Lấy danh sách lịch sử nghe gần đây của user.
     */
    public function recentlyListened(Request $request)
    {
        $user = Auth::user();
        $bookId = $request->get('book_id');
        $limit = $request->get('limit', 10);

        if ($bookId) {
            // Lấy bản ghi gần nhất theo book_id
            $progress = ListeningProgress::where('user_id', $user->id)
                ->where('book_id', $bookId)
                ->orderByDesc('last_accessed_at')
                ->first();
            return response()->json(['data' => $progress]);
        }

        $progress = ListeningProgress::with(['book', 'book.authors', 'book.categories', 'chapter'])
            ->where('user_id', $user->id)
            ->orderByDesc('last_accessed_at')
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $progress
        ]);
    }

    /**
     * Lấy tiến độ nghe của user cho một chương cụ thể.
     */
    public function getProgress($chapterId)
    {
        $user = Auth::user();

        $progress = ListeningProgress::with(['book', 'chapter'])
            ->where('user_id', $user->id)
            ->where('chapter_id', $chapterId)
            ->first();

        if (!$progress) {
            return response()->json(['message' => 'Chưa có lịch sử nghe cho chương này'], 404);
        }

        return response()->json($progress);
    }

    // Lưu tiến độ nghe (chỉ lưu nếu chưa có)
    public function save(Request $request)
    {
        $user = Auth::user();
        $validated = $request->validate([
            'book_id' => 'required|integer',
            'chapter_id' => 'required|integer',
            'current_time' => 'required|numeric',
            'duration' => 'nullable|numeric',
            'progress_percentage' => 'nullable|numeric',
            'is_completed' => 'nullable|boolean',
        ]);
        // Kiểm tra đã có bản ghi chưa
        $exists = ListeningProgress::where('user_id', $user->id)
            ->where('chapter_id', $validated['chapter_id'])
            ->exists();
        if ($exists) {
            return response()->json(['message' => 'Đã lưu tiến độ chương này trước đó.'], 200);
        }
        $progress = ListeningProgress::create([
            'user_id' => $user->id,
            'book_id' => $validated['book_id'],
            'chapter_id' => $validated['chapter_id'],
            'current_time' => $validated['current_time'],
            'duration' => $validated['duration'] ?? null,
            'progress_percentage' => $validated['progress_percentage'] ?? 0,
            'is_completed' => $validated['is_completed'] ?? false,
            'last_accessed_at' => now(),
        ]);
        return response()->json(['message' => 'Đã lưu tiến độ nghe.', 'data' => $progress]);
    }
}
