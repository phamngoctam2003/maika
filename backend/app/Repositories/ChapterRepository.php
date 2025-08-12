<?php

namespace App\Repositories;

use App\Contracts\ChapterRepositoryInterface;
use App\Models\Chapter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;


class ChapterRepository implements ChapterRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Chapter::with(['bookFormatMapping.book', 'user']);

        // Lọc theo format_id
        if (isset($filters['format_id'])) {
            $query->whereHas('bookFormatMapping', function ($q) use ($filters) {
                $q->where('format_id', $filters['format_id']);
            });
        }

        // Lọc theo book_id
        if (isset($filters['book_id'])) {
            $query->whereHas('bookFormatMapping', function ($q) use ($filters) {
                $q->where('book_id', $filters['book_id']);
            });
        }

        // Lọc theo từ khóa
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
        return Chapter::with(['bookFormatMapping.book', 'user'])->where('id', $id)->first();
    }

    public function create(array $data): Chapter
    {
        $user = auth('api')->user();
        if (!$user) {
            throw new \Exception('User not authenticated');
        }
        $data['user_id'] = $user->id;

        // Đảm bảo có book_format_mapping_id
        if (!isset($data['book_format_mapping_id'])) {
            throw new \Exception('book_format_mapping_id is required');
        }

        // Chỉ xử lý audio_path nếu nó tồn tại và là file upload
        if (isset($data['audio_path']) && $data['audio_path'] && is_object($data['audio_path'])) {
            $path = $data['audio_path']->storePublicly('audio', 'public');
            $data['audio_path'] = $path;
        } else {
            // Nếu không có file hoặc file rỗng, set null
            $data['audio_path'] = null;
        }

        return Chapter::create($data);
    }

    public function update(int $id, array $data): ?Chapter
    {
        $chapter = $this->getById($id);
        if ($chapter) {
            // Đảm bảo có book_format_mapping_id khi update nếu cần
            if (!isset($data['book_format_mapping_id'])) {
                throw new \Exception('book_format_mapping_id is required');
            }
            $chapter->update($data);
            return $chapter;
        }
        return null;
    }

    public function delete(array $ids): ?bool
    {
        if (is_array($ids) && !empty($ids)) {
            $chapters = Chapter::whereIn('id', $ids)->get();
            foreach ($chapters as $chapter) {
                if ($chapter->audio_path && Storage::disk('public')->exists($chapter->audio_path)) {
                    Storage::disk('public')->delete($chapter->audio_path);
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
