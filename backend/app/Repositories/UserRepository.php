<?php

namespace App\Repositories;

use App\Contracts\UserRepositoryInterface;
use App\Models\Books;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

class UserRepository implements UserRepositoryInterface
{
    public function getLatest()
    {
        return Books::latest()->take(12)->get();
    }

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return Books::paginate(10);
    }

    // public function getById(int $id): ?User
    // {
    //     return Books::find($id);
    // }
    public function getBookSlug(string $slug): ?Books
    {
        return Books::with('categories', 'formats', 'authors')
            ->where('slug', $slug)->first();
    }
    public function getEbookReader(string $slug): ?Books
    {
        return Books::with([
            'chapters' => function ($query) {
                $query->whereHas('bookFormatMapping', function ($q) {
                    $q->where('format_id', 1);
                });
            },
            'authors'
        ])->where('slug', $slug)->first();
    }

    public function increaseView($slug)
    {
        $book = Books::where('slug', $slug)->firstOrFail();
        $book->increment('views');
        return response()->json(['success' => true]);
    }

    // Lấy sách theo ranking (sắp xếp theo views)
    public function getRanking()
    {
        return Books::orderBy('views', 'desc')->take(10)->get();
    }

    public function getProposed()
    {
        return Books::inRandomOrder()->take(12)->get();
    }

    // Lấy sách theo danh mục
    public function getBooksByCategory(string $categorySlug, int $limit = 12)
    {
        return Books::with('categories', 'formats', 'authors')
            ->whereHas('categories', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->latest()
            ->take($limit)
            ->get();
    }

    /**
     * Get latest books filtered by format
     * @param string $format - Book format ("Sách điện tử" or "Sách nói")
     * @return Collection
     */
    public function getLatestByFormat(string $format)
    {
        return Books::whereHas('formats', function ($query) use ($format) {
            $query->where('name', $format);
        })
            ->latest()
            ->take(12)
            ->get();
    }

    /**
     * Get ranking books filtered by format
     * @param string $format - Book format ("Sách điện tử" or "Sách nói")
     * @return Collection
     */
    public function getRankingByFormat(string $format)
    {
        return Books::with('categories', 'formats', 'authors')
            ->whereHas('formats', function ($query) use ($format) {
                $query->where('name', $format);
            })
            ->orderBy('views', 'desc')
            ->take(10)
            ->get();
    }

    /**
     * Get proposed books filtered by format
     * @param string $format - Book format ("Sách điện tử" or "Sách nói")
     * @return Collection
     */
    public function getProposedByFormat(string $format)
    {
        try {
            $books =  Books::with('categories', 'formats', 'authors')
                ->whereHas('formats', function ($query) use ($format) {
                    $query->where('name', $format);
                })
                ->inRandomOrder()
                ->take(12)
                ->get();
            /** @var \App\Models\User|null $user */
            $user = auth('api')->user();
            if ($user) {
                foreach ($books as $book) {
                    $isSaved = $user->bookCase()->where('book_id', $book->id)->exists();
                    $book->is_saved_in_bookcase = $isSaved;
                }
            } else {
                foreach ($books as $book) {
                    $book->is_saved_in_bookcase = false;
                }
            }
            // Trả về collection, nếu lỗi trả về Collection rỗng để đúng kiểu trả về
            return $books->values();
        } catch (\Exception $e) {
            // Nếu có lỗi, trả về Collection rỗng thay vì JsonResponse để đúng kiểu trả về
            return collect([]);
        }
    }
    /**
     * Get books by category and format
     * @param string $categorySlug
     * @param string $format
     * @param int $limit
     * @return Collection
     */
    public function getBooksByCategoryAndFormat(string $categorySlug, string $format, int $limit = 12)
    {
        return Books::with('categories', 'formats', 'authors')
            ->whereHas('categories', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->whereHas('formats', function ($query) use ($format) {
                $query->where('name', $format);
            })
            ->latest()
            ->take($limit)
            ->get();
    }
}

