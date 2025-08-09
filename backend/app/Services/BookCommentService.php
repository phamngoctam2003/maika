<?php 
namespace App\Services;
use App\Models\BookComment; 
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BookCommentService {
    /**
     * Get all book comments with pagination and optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getComment(array $filters = []): LengthAwarePaginator
    {
        $query = BookComment::with('user');

        if (isset($filters['book_id'])) {
            $query->where('book_id', $filters['book_id']);
        }

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        // Sort
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy('created_at', $sortOrder);

        // Paginate
        $perPage = $filters['per_page'] ?? 10;

        return $query->paginate($perPage);
    }

    /**
     * Create a new book comment.
     *
     * @param array $data
     * @return BookComment
     */
    public function createComment(array $data): BookComment
    {
        $userId = auth('api')->id();
        if (!$userId) {
            throw new \Exception('Chưa đăng nhập.');
        }
        return BookComment::create([
            'content' => $data['content'],
            'rating' => $data['rating'] ?? null,
            'book_id' => $data['book_id'],
            'user_id' => $userId,
            'comment_book_id' => $data['comment_book_id'] ?? null,
            'is_admin' => $data['is_admin'] ?? false,
        ]);
    }

    /**
     * Update a book comment.
     *
     * @param int $id
     * @param array $data
     * @return BookComment
     */
    public function updateComment(int $id, array $data): BookComment
    {
        $comment = BookComment::findOrFail($id);
        $comment->update($data);
        return $comment->fresh();
    }

    /**
     * Delete a book comment.
     *
     * @param int $id
     * @return bool
     */
    public function deleteComment(int $id): bool
    {
        $comment = BookComment::findOrFail($id);
        return $comment->delete();
    }

    /**
     * Get comments for a specific book.
     *
     * @param int $bookId
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getCommentsByBook(int $bookId, array $filters = []): LengthAwarePaginator
    {
        $filters['book_id'] = $bookId;
        return $this->getComment($filters);
    }

    /**
     * Get comment replies.
     *
     * @param int $commentId
     * @return Collection
     */
    public function getCommentReplies(int $commentId): Collection
    {
        return BookComment::with('user')
            ->where('comment_book_id', $commentId)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Check if user has already commented on a book.
     *
     * @param int $bookId
     * @param int $userId
     * @return BookComment|null
     */
    public function getUserCommentForBook(int $bookId, int $userId): ?BookComment
    {
        return BookComment::where('book_id', $bookId)
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Check if user has already commented on a book and return boolean.
     *
     * @param int $bookId
     * @param int $userId
     * @return bool
     */
    public function hasUserCommented(int $bookId, int $userId): bool
    {
        return BookComment::where('book_id', $bookId)
            ->where('user_id', $userId)
            ->exists();
    }

    /**
     * Lấy trung bình rating của một sách.
     *
     * @param int $bookId
     * @return float|null
     */
    public function getAverageRatingByBook(int $bookId): ?float
    {
        return BookComment::where('book_id', $bookId)->avg('rating');
    }
}