<?php

namespace App\Services;

use App\Models\ReadingHistory;
use Illuminate\Support\Facades\Auth;
use App\Models\Books;
use PhpParser\Node\Stmt\Return_;
use Illuminate\Support\Facades\Log;

class ReadingHistoryService
{
    // Lưu tiến độ đọc
    public function saveProgress($data)
    {
        // Kiểm tra book tồn tại
        $book = Books::where('slug', $data['book_slug'])->first();
        if (!$book) {
            throw new \Exception("Book với slug '{$data['book_slug']}' không tồn tại");
        }

        // Kiểm tra user authenticated
        $user = auth('api')->user();
        if (!$user) {
            throw new \Exception("User chưa đăng nhập");
        }
        $userId = $user->id;

        return ReadingHistory::updateOrCreate(
            [
                'user_id' => $userId,
                'book_id' => $book->id
            ],
            [
                'chapter_id' => $data['chapter_id'] ?? null, // Handle null
                'chapter_index' => $data['chapter_index'],
                'character_position' => $data['character_position'],
                'chapter_progress' => $data['chapter_progress'],
                'last_read_at' => now()
            ]
        );
    }

    // Lấy tiến độ đọc
    public function getProgress($slug)
    {
        $user = auth('api')->user();
        if (!$user) {
            throw new \Exception("User chưa đăng nhập");
        }
        $userId = $user->id;
        
        $book = Books::where('slug', $slug)->firstOrFail();
        return ReadingHistory::where('user_id', $userId)
            ->where('book_id', $book->id)
            ->first();
    }

    // Lấy sách đọc gần đây

    public function getRecentlyRead($limit = 10)
    {
        $user = auth('api')->user();
        if (!$user) {
            throw new \Exception("User chưa đăng nhập");
        }
        
        return ReadingHistory::with('book')
            ->where('user_id', $user->id)
            ->orderBy('last_read_at', 'desc')
            ->limit($limit)
            ->get();
    }

    // Kiểm tra user đã đọc chưa
    public function hasReadBook($slug)
    {
        $user = auth('api')->user();
        if (!$user) {
            return false;
        }
        
        $book = Books::where('slug', $slug)->first();
        if (!$book) return false;

        return ReadingHistory::where('user_id', $user->id)
            ->where('book_id', $book->id)
            ->exists();
    }
}
