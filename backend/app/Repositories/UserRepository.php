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
}
