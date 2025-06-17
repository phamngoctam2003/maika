<?php

namespace App\Repositories;

use App\Contracts\BookRepositoryInterface;
use App\Models\Role;
use App\Models\Books;
use App\Models\BookFormat;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BookRepository implements BookRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Books::with('categories', 'formats');

        if (isset($filters['keyword'])) {
            $query->where('title', 'like', '%' . $filters['keyword'] . '%');
        }

        // Sort
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy('created_at', $sortOrder);

        // Paginate
        $perPage = $filters['per_page'] ?? 10;

        return $query->paginate($perPage);
    }


    public function getById(int $id): ?Books
    {
        return Books::with('formats')->where('id', $id)->first();
    }

    public function create(array $data): Books
    {
        $path = $data['file_path']->storePublicly('books', 'public');
        $data['file_path'] = $path;
        $categoryIds = $data['category_id'] ?? [];
        $formatId = $data['format_id'] ?? [];
        unset($data['category_id'], $data['format_id']);
        $book = Books::create($data);
        $book->categories()->sync($categoryIds);
        $book->formats()->sync($formatId);
        return $book;
    }

    public function update(int $id, array $data): ?Books
    {
        $Books = $this->getById($id);
        if ($Books) {
            $Books->update($data);
            return $Books;
        }
        return null;
    }

    public function delete(array $ids): ?bool
    {
        if (is_array($ids) && !empty($ids)) {
            foreach ($ids as $id) {
                $books = Books::find($id);
                if ($books && $books->comment()->count() > 0) {
                    return false; 
                }
            }
            Books::whereIn('id', $ids)->delete();
            return true;
        }
        return false; 
    }



    public function search(string $query): LengthAwarePaginator
    {
        return Books::where('name', 'like', '%' . $query . '%')->paginate(10);
    }

    // public function getCategoriesWithProducts(): LengthAwarePaginator
    // {
    //     return Category::with('products')->paginate(10);
    // }



}
