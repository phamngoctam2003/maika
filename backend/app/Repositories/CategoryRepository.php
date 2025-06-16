<?php

namespace App\Repositories;

use App\Contracts\CategoryRepositoryInterface;
use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Category::query();

        if (isset($filters['keyword'])) {
            $query->where('name', 'like', '%' . $filters['keyword'] . '%');
        }

        // Sort
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy('created_at', $sortOrder);

        // Paginate
        $perPage = $filters['per_page'] ?? 10;

        return $query->paginate($perPage);
    }


    public function getById(int $id): ?Category
    {
        return Category::where('id', $id)->first();
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function update(int $id, array $data): ?Category
    {
        $category = $this->getById($id);
        if ($category) {
            $category->update($data);
            return $category;
        }
        return null;
    }

    public function delete(int $ids): bool
    {
        $category = $this->getById($ids);
        if ($category) {
            return $category->delete();
        }
        return false;
    }

    public function getParentId(int $parentId): Collection
    {
        return Category::where('parent_id', $parentId)->get();
    }

    public function getCategoryTree(): array
    {
        // Implementation for category tree retrieval
        // This is a placeholder; actual implementation may vary.
        return [];
    }

    public function search(string $query): LengthAwarePaginator
    {
        return Category::where('name', 'like', '%' . $query . '%')->paginate(10);
    }

    // public function getCategoriesWithProducts(): LengthAwarePaginator
    // {
    //     return Category::with('products')->paginate(10);
    // }

    public function getByIds(array $ids): Collection
    {
        return Category::whereIn('id', $ids)->get();
    }
}
