<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListeningProgress extends Model
{
    use HasFactory;

    protected $table = 'listening_progress';

    protected $fillable = [
        'user_id',
        'book_id',
        'chapter_id',
        'current_time',
        'duration',
        'progress_percentage',
        'is_completed',
        'last_accessed_at'
    ];

    protected $casts = [
        'current_time' => 'decimal:2',
        'duration' => 'decimal:2',
        'progress_percentage' => 'decimal:2',
        'is_completed' => 'boolean',
        'last_accessed_at' => 'datetime'
    ];

    /**
     * Relationship với User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship với Book
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Books::class, 'book_id');
    }

    /**
     * Relationship với Chapter
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    /**
     * Cập nhật tiến độ nghe
     */
    public static function updateProgress($userId, $bookId, $chapterId, $data)
    {
        return self::updateOrCreate(
            [
                'user_id' => $userId,
                'chapter_id' => $chapterId
            ],
            [
                'book_id' => $bookId,
                'current_time' => $data['current_time'] ?? 0,
                'duration' => $data['duration'] ?? null,
                'progress_percentage' => $data['progress_percentage'] ?? 0,
                'is_completed' => ($data['progress_percentage'] ?? 0) >= 95, // Coi như hoàn thành nếu >= 95%
                'last_accessed_at' => now()
            ]
        );
    }

    /**
     * Lấy tiến độ của user cho một chương
     */
    public static function getProgress($userId, $chapterId)
    {
        return self::where('user_id', $userId)
                   ->where('chapter_id', $chapterId)
                   ->first();
    }

    /**
     * Lấy tất cả tiến độ của user cho một cuốn sách
     */
    public static function getBookProgress($userId, $bookId)
    {
        return self::where('user_id', $userId)
                   ->where('book_id', $bookId)
                   ->with('chapter')
                   ->orderBy('last_accessed_at', 'desc')
                   ->get();
    }

    /**
     * Tính % hoàn thành của toàn bộ sách
     */
    public static function getBookCompletionPercentage($userId, $bookId)
    {
        $totalChapters = Chapter::where('book_id', $bookId)->count();
        
        if ($totalChapters === 0) {
            return 0;
        }

        $completedChapters = self::where('user_id', $userId)
                                ->where('book_id', $bookId)
                                ->where('is_completed', true)
                                ->count();

        return round(($completedChapters / $totalChapters) * 100, 2);
    }
}
