<?php

namespace App\Services;

use App\Contracts\BookRepositoryInterface;
use App\Models\BookFormat;
use App\Models\Author;
use App\Models\Books;
use App\Models\Chapter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;

class BookService
{
    protected BookRepositoryInterface $bookRepository;

    public function __construct(BookRepositoryInterface $bookRepository)
    {
        $this->bookRepository = $bookRepository;
    }

    public function getAllBooks(array $filters = []): LengthAwarePaginator
    {
        return $this->bookRepository->getAll($filters);
    }

    public function getBookById(int $id): ?Books
    {
        return $this->bookRepository->getById($id);
    }

    public function createBook(array $data): Books
    {
        return $this->bookRepository->create($data);
    }
    public function updateBook(int $id, array $data): ?Books
    {
        return $this->bookRepository->update($id, $data);
    }

    public function getAllFormats(): Collection
    {
        return BookFormat::all();
    }

    public function getAuthors(): Collection
    {
        return Author::all();
    }


    public function deleteBooks(array $ids): bool
    {
        return $this->bookRepository->delete($ids);
    }
}
