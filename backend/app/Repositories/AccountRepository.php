<?php

namespace App\Repositories;

use App\Contracts\AccountRepositoryInterface;
use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class AccountRepository implements AccountRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = User::query();

        if (isset($filters['keyword'])) {
            $query->where('fullName', 'like', '%' . $filters['keyword'] . '%')
                ->orWhere('email', 'like', '%' . $filters['keyword'] . '%');
        }

        // Sort
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy('created_at', $sortOrder);

        // Paginate
        $perPage = $filters['per_page'] ?? 10;

        return $query->paginate($perPage);
    }

    public function rolelevel(int $id): ?array
    {
        return Role::where('id', $id)->first();
    }

    public function getById(int $id): ?User
    {
        return User::where('id', $id)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(int $id, array $data): ?User
    {
        $User = $this->getById($id);
        if ($User) {
            $User->update($data);
            return $User;
        }
        return null;
    }

    public function delete(int $ids): bool
    {
        $User = $this->getById($ids);
        if ($User) {
            return $User->delete();
        }
        return false;
    }

    public function getParentId(int $parentId): Collection
    {
        return User::where('parent_id', $parentId)->get();
    }

    public function getCategoryTree(): array
    {
        // Implementation for category tree retrieval
        // This is a placeholder; actual implementation may vary.
        return [];
    }

    public function search(string $query): LengthAwarePaginator
    {
        return User::where('name', 'like', '%' . $query . '%')->paginate(10);
    }

    // public function getCategoriesWithProducts(): LengthAwarePaginator
    // {
    //     return Category::with('products')->paginate(10);
    // }

    public function getByIds(array $ids): Collection
    {
        return User::whereIn('id', $ids)->get();
    }
    public function getAccountByEmail(string $email): ?array
    {
        return User::where('email', $email)->first();
    }
}
