<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\BookCommentService;

class BookCommentController extends Controller
{
    protected $bookCommentService;
    public function __construct(BookCommentService $bookCommentService)
    {
        $this->bookCommentService = $bookCommentService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['per_page', 'book_id', 'page']);
        $comments = $this->bookCommentService->getComment($filters);
        return response()->json($comments);
    }

    public function create(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'book_id' => 'required|integer',
            'comment_book_id' => 'nullable|integer',
            'is_admin' => 'boolean',
        ]);

        $userId = auth('api')->id();
        if (!$userId) {
            return response()->json(['error' => 'Chưa đăng nhập',
            'message' => 'Bạn cần đăng nhập để bình luận',
            'status' => 'error'
        ],401);
        }

        // Check if user has already commented on this book
        $existingComment = $this->bookCommentService->getUserCommentForBook($data['book_id'], $userId);
        
        if ($existingComment) {
            // Update existing comment
            $comment = $this->bookCommentService->updateComment($existingComment->id, [
                'content' => $data['content'],
                'rating' => $data['rating'] ?? $existingComment->rating,
            ]);
            $comment->load('user');
            return response()->json([
                'comment' => $comment,
                'isUpdate' => true,
                'message' => 'Đã cập nhật đánh giá của bạn'
            ], 200);
        } else {
            // Create new comment
            $comment = $this->bookCommentService->createComment($data);
            $comment->load('user');
            return response()->json([
                'comment' => $comment,
                'isUpdate' => false,
                'message' => 'Đã thêm đánh giá mới'
            ], 201);
        }
    }

    /**
     * Check if user has commented on a book
     */
    public function checkUserComment(Request $request)
    {
        $request->validate([
            'book_id' => 'required|integer',
        ]);

        $userId = auth('api')->id();
        if (!$userId) {
            return response()->json(['hasCommented' => false, 'comment' => null]);
        }

        $existingComment = $this->bookCommentService->getUserCommentForBook($request->book_id, $userId);
        
        return response()->json([
            'hasCommented' => !is_null($existingComment),
            'comment' => $existingComment ? $existingComment->load('user') : null
        ]);
    }
}
