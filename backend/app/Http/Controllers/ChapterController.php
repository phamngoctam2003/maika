<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ChapterService;
use App\Models\ListeningProgress;
use App\Models\Chapter;
use App\Models\Books;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ChapterController extends Controller
{
    protected ChapterService $chapterService;

    public function __construct(ChapterService $chapterService)
    {
        $this->chapterService = $chapterService;
    }

    public function index(Request $request)
    {
        try {
            $filters = $request->only(['book_id', 'page', 'keyword', 'sort_order', 'per_page']);
            $chapters = $this->chapterService->getAllChapters($filters);
            return response()->json($chapters);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách chapter.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'book_id' => 'required|exists:books,id',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'audio_path' => 'nullable',
            'chapter_order' => 'required|integer',
            'expected_chapters' => 'nullable|integer',
            'status' => 'nullable|integer',
        ]);
        try {
            $this->chapterService->createChapterBook($validatedData);
            return response()->json([
                'message' => 'Chương đã được tạo thành công.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi tạo chương.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $book = $this->chapterService->getBookById($id);
            if (!$book) {
                return response()->json(['message' => 'Sách không tồn tại.'], 404);
            }
            return response()->json($book);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy thông tin sách.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:book_types,name,' . $id,
            'category_id' => 'required|exists:categories,id',
        ]);
        try {
            $book = $this->chapterService->getBookById($id);
            if (!$book) {
                return response()->json(['message' => 'Sách không tồn tại.'], 404);
            }
            $updatedBook = $this->chapterService->updateBook($id, $validatedData);
            return response()->json([
                'message' => 'Sách đã được cập nhật thành công.',
                'book' => $updatedBook
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi cập nhật sách.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách chapters của một cuốn sách
     */
    public function getBookChapters($bookId)
    {
        try {
            $book = Books::find($bookId);
            if (!$book) {
                return response()->json(['message' => 'Sách không tồn tại.'], 404);
            }

            $chapters = Chapter::where('book_id', $bookId)
                ->where('status', 1) // Chỉ lấy chapters đã active
                ->orderBy('chapter_order', 'asc')
                ->select('id', 'title', 'chapter_order', 'audio_path', 'content')
                ->get();

            // Nếu user đã đăng nhập, lấy thêm tiến độ nghe
            $userId = Auth::id();
            if ($userId) {
                $chapters = $chapters->map(function ($chapter) use ($userId) {
                    $progress = ListeningProgress::getProgress($userId, $chapter->id);
                    $chapter->listening_progress = $progress ? [
                        'current_time' => $progress->current_time,
                        'progress_percentage' => $progress->progress_percentage,
                        'is_completed' => $progress->is_completed,
                        'last_accessed_at' => $progress->last_accessed_at
                    ] : null;
                    return $chapter;
                });
            }

            return response()->json([
                'success' => true,
                'data' => $chapters,
                'book_info' => [
                    'id' => $book->id,
                    'title' => $book->title,
                    'total_chapters' => $chapters->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy danh sách chương.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy thông tin audio của một chương
     */
    public function getChapterAudio($bookId, $chapterId)
    {
        try {
            $chapter = Chapter::where('id', $chapterId)
                ->where('book_id', $bookId)
                ->where('status', 1)
                ->first();

            if (!$chapter) {
                return response()->json(['message' => 'Chương không tồn tại.'], 404);
            }

            // Kiểm tra file audio có tồn tại không
            if (!$chapter->audio_path) {
                return response()->json(['message' => 'Chương này chưa có file audio.'], 404);
            }

            if (!$this->checkAudioFileExists($chapter->audio_path)) {
                return response()->json(['message' => 'File audio không tồn tại.'], 404);
            }

            // Lấy tiến độ nghe của user (nếu đã đăng nhập)
            $userId = Auth::id();
            $progress = null;
            if ($userId) {
                $progress = ListeningProgress::getProgress($userId, $chapterId);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'chapter_id' => $chapter->id,
                    'title' => $chapter->title,
                    'audio_path' => $chapter->audio_path,
                    'audioUrl' => url('api/users/books/stream-audio/' . $chapter->audio_path), 
                    'content' => $chapter->content,
                    'chapter_order' => $chapter->chapter_order,
                    'duration' => $this->getAudioDuration($chapter->audio_path), // Optional: get audio duration
                    'progress' => $progress ? [
                        'current_time' => $progress->current_time,
                        'progress_percentage' => $progress->progress_percentage,
                        'is_completed' => $progress->is_completed,
                        'last_accessed_at' => $progress->last_accessed_at
                    ] : null
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy thông tin audio.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật tiến độ nghe của user
     */
    public function updateListeningProgress(Request $request, $bookId, $chapterId)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Vui lòng đăng nhập.'], 401);
            }

            $validatedData = $request->validate([
                'current_time' => 'required|numeric|min:0',
                'duration' => 'nullable|numeric|min:0',
                'progress_percentage' => 'nullable|numeric|min:0|max:100'
            ]);

            // Kiểm tra chapter có tồn tại không
            $chapter = Chapter::where('id', $chapterId)
                ->where('book_id', $bookId)
                ->first();

            if (!$chapter) {
                return response()->json(['message' => 'Chương không tồn tại.'], 404);
            }

            // Tính progress_percentage nếu chưa có
            if (!isset($validatedData['progress_percentage']) && isset($validatedData['duration']) && $validatedData['duration'] > 0) {
                $validatedData['progress_percentage'] = round(($validatedData['current_time'] / $validatedData['duration']) * 100, 2);
            }

            // Cập nhật tiến độ
            $progress = ListeningProgress::updateProgress(
                $user->id,
                $bookId,
                $chapterId,
                $validatedData
            );

            return response()->json([
                'success' => true,
                'message' => 'Tiến độ đã được cập nhật.',
                'data' => [
                    'current_time' => $progress->current_time,
                    'progress_percentage' => $progress->progress_percentage,
                    'is_completed' => $progress->is_completed,
                    'book_completion' => ListeningProgress::getBookCompletionPercentage($user->id, $bookId)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật tiến độ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method để kiểm tra file audio có tồn tại không
     */
    private function checkAudioFileExists($audioPath)
    {
        if (!$audioPath) {
            return false;
        }

        // Kiểm tra trong storage/app/public
        if (Storage::disk('public')->exists($audioPath)) {
            return true;
        }

        // Kiểm tra trong public/storage (symlink)
        if (file_exists(public_path('storage/' . $audioPath))) {
            return true;
        }

        // Kiểm tra path tuyệt đối nếu audioPath bắt đầu bằng /
        if (str_starts_with($audioPath, '/') && file_exists($audioPath)) {
            return true;
        }

        return false;
    }

    /**
     * Helper method để lấy URL của audio file
     */
    private function getAudioUrl($audioPath)
    {
        if (!$audioPath) {
            return null;
        }

        // Nếu là URL đầy đủ
        if (str_starts_with($audioPath, 'http')) {
            return $audioPath;
        }

        // Nếu bắt đầu bằng / thì là path tuyệt đối
        if (str_starts_with($audioPath, '/')) {
            return $audioPath;
        }

        // Mặc định sử dụng storage
        return asset('storage/' . $audioPath);
    }

    /**
     * Helper method để lấy duration của audio file (optional)
     */
    private function getAudioDuration($audioPath)
    {
        try {
            // Có thể sử dụng thư viện như getid3 để lấy metadata
            // Tạm thời return null, có thể implement sau
            return null;
        } catch (\Exception $e) {
            return null;
        }
    }
}
