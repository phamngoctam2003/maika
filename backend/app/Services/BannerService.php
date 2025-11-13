<?php 
namespace App\Services;
use App\Models\Banner; 
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class BannerService {
    /**
     * Get all banners with pagination and optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAllBanners(array $filters = []): LengthAwarePaginator
    {
        $query = Banner::query();

        if (isset($filters['id'])) {
            $query->where('id', $filters['id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        // Sort
        $sortOrder = $filters['sort_order'] ?? 'asc';
        $query->orderBy('sort_order', $sortOrder);

        // Paginate
        $perPage = $filters['per_page'] ?? 10;

        return $query->paginate($perPage);
    }

    /**
     * Create a new book comment.
     *
     * @param array $data
     * @return Banner
     */
    public function createBanner(array $data): Banner
    {
        $userId = auth('api')->id();
        if (!$userId) {
            throw new \Exception('Chưa đăng nhập.');
        }
        return DB::transaction(function () use ($data, $userId) {
            $data['user_id'] = $userId;
            $data['title'] = $data['title'] ?? '';
            $data['status'] = $data['status'] ?? false;
            $data['sort_order'] = $data['sort_order'] ?? 0;
            $path = $data['image_url']->storePublicly('banners', 'public');
            $data['image_url'] = $path;
            return Banner::create($data);
        });
    }

    /**
     * Update a book comment.
     *
     * @param int $id
     * @param array $data
     * @return Banner
     */
    public function updateBanner(int $id, array $data): Banner
    {
        $banner = Banner::findOrFail($id);
        $banner->update($data);
        return $banner->fresh();
    }

    /**
     * Delete a banner.
     *
     * @param int $id
     * @return bool
     */
    public function deleteBanner(int $id): bool
    {
        $banner = Banner::findOrFail($id);
        return $banner->delete();
    }
}