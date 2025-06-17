<?php

namespace App\Repositories;

use App\Contracts\ChapterRepositoryInterface;
use App\Models\Chapter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ChapterRepository implements ChapterRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Chapter::with('book', 'user')->where('book_id', $filters['book_id'] ?? null);

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


    public function getById(int $id): ?Chapter
    {
        return Chapter::where('id', $id)->first();
    }

    public function create(array $data): Chapter
    {
        $user = auth('api')->user();
        if (!$user) {
            throw new \Exception('User not authenticated');
        }
        $data['user_id'] = $user->id;
        $path = $data['audio_path']->storePublicly('audio', 'public');
        $data['audio_path'] = $path;
        return Chapter::create($data);
    }

    public function update(int $id, array $data): ?Chapter
    {
        $Chapter = $this->getById($id);
        if ($Chapter) {
            $Chapter->update($data);
            return $Chapter;
        }
        return null;
    }

    public function delete(array $ids): ?bool
    {
        if (is_array($ids) && !empty($ids)) {
            foreach ($ids as $id) {
                $chapter = Chapter::find($id);
                if ($chapter && $chapter->comment()->count() > 0) {
                    return false; 
                }
            }
            Chapter::whereIn('id', $ids)->delete();
            return true;
        }
        return false; 
    }


    public function search(string $query): LengthAwarePaginator
    {
        return Chapter::where('name', 'like', '%' . $query . '%')->paginate(10);
    }

    // public function getCategoriesWithProducts(): LengthAwarePaginator
    // {
    //     return Category::with('products')->paginate(10);
    // }



}
