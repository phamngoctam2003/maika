<?php

namespace App\Services;

use App\Contracts\ChapterRepositoryInterface;
use App\Models\Chapter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ChapterService
{
    protected ChapterRepositoryInterface $chapterRepository;

    public function __construct(ChapterRepositoryInterface $chapterRepository)
    {
        $this->chapterRepository = $chapterRepository;
    }

    public function getAllChapters(array $filters = []): LengthAwarePaginator
    {
        return $this->chapterRepository->getAll($filters);
    }

    public function getBookById(int $id): ?Chapter
    {
        return $this->chapterRepository->getById($id);
    }

    public function createBook(array $data): Chapter
    {
        return $this->chapterRepository->create($data);
    }
    public function updateBook(int $id, array $data): ?Chapter
    {
        return $this->chapterRepository->update($id, $data);
    }

}
