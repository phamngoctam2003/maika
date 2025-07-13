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
    public function getEbook(string $slug): ?Books
    {
        return Books::with('categories', 'formats', 'authors')
            ->where('slug', $slug)->first();
    }
    public function getEbookReader(string $slug): ?Books
    {
        return Books::with('chapters', 'authors')->where('slug', $slug)->first();
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

    // Lấy sách đề xuất (có thể random hoặc theo thuật toán)
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
}
