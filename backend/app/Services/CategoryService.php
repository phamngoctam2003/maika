<?php 
namespace App\Services;

use App\Contracts\CategoryRepositoryInterface;
use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryService {
    protected CategoryRepositoryInterface $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository) {
        $this->categoryRepository = $categoryRepository;
    }

    public function getAllCategories(array $filters = []): LengthAwarePaginator {
        return $this->categoryRepository->getAll($filters);
    }

    public function getCategoryById(int $id): ?Category {
        return $this->categoryRepository->getById($id);
    }
    public function createCategory(array $data): Category {
        return $this->categoryRepository->create($data);
    }
    public function updateCategory(int $id, array $data): ?Category {
        return $this->categoryRepository->update($id, $data);
    }
}