<?php

namespace App\Services;

use App\Contracts\ChapterRepositoryInterface;
use App\Models\Chapter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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

    public function getChapterById(int $id): ?Chapter
    {
        return $this->chapterRepository->getById($id);
    }

    public function createChapterBook(array $data): Chapter
    {
        return $this->chapterRepository->create($data);
    }
    public function updateChapter(int $id, array $data): ?Chapter
    {
        return $this->chapterRepository->update($id, $data);
    }
    public function deleteChapters(array $ids): bool
    {
        return $this->chapterRepository->delete($ids);
    }
}
