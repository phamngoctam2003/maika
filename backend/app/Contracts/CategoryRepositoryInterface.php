<?php

namespace App\Contracts;

use App\Models\Category;
use App\Contracts\BaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface extends BaseRepositoryInterface{
    public function getCategoryTree(): array;
    public function getAllWithBooksAndFormats(): Collection;
    public function getCategoriesByFormat(array $formatNames): Collection;
    // public function getCategoryBySlug(string $slug): ?Category;
    // public function getCategoriesWithProducts(): LengthAwarePaginator;
    // public function getCategoryWithProductsById(int $id): ?Category;
}
