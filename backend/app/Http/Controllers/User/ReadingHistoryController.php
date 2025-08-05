<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ReadingHistory;
use App\Services\ReadingHistoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Books;

class ReadingHistoryController extends Controller
{

    protected ReadingHistoryService $service;
    public function __construct(ReadingHistoryService $service)
    {
        $this->service = $service;
    }
    public function save(Request $request)
    {
        $validated = $request->validate(
            [
                'book_slug' => 'required|string',
                'chapter_id' => 'nullable|integer',
                'chapter_index' => 'required|integer',
                'character_position' => 'required|integer',
                'chapter_progress' => 'required|numeric|min:0|max:100',
            ]
        );
        try {
            $this->service->saveProgress($validated);
            return response()->json(['message' => 'Save successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Lấy danh sách lịch sử đọc sách gần đây của user.
     */
    public function recentlyRead(Request $request)
    {
        $user = Auth::user();

        $limit = $request->get('limit', 10);

        $histories = ReadingHistory::with(['book', 'book.authors', 'book.categories'])
            ->where('user_id', $user->id)
            ->orderByDesc('last_read_at')
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $histories
        ]);
    }

    /**
     * Lấy tiến độ đọc của user cho một sách cụ thể.
     */
    public function getProgress($slug)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Chưa đăng nhập'], 401);
        }
        try {
            $progress = $this->service->getProgress($slug);
            if (!$progress) {
                return response()->json(['message' => 'not found'], 404);
            }
            return response()->json($progress, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
