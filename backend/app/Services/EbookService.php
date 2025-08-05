<?php

namespace App\Services;
use App\Services\UserService;
use App\Models\Books;

/**
 * Ebook Service - Handles only electronic books
 * Used for Ebook section to display only books with format "Sách điện tử"
 * Filters books by book_formats field
 */
class EbookService
{
    protected UserService $userService;

    /**
     * Constructor - inject UserService for data operations
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get latest ebooks only (format: "Sách điện tử")
     * @return mixed
     */
    public function getLatest()
    {
        // Get books filtered by ebook format
        return $this->userService->getLatestByFormat('Sách điện tử');
    }

    /**
     * Increase view count for ebook
     * @param string $slug
     * @return mixed
     */
    public function increaseView($slug)
    {
        return $this->userService->increaseView($slug);
    }

    /**
     * Get ranking ebooks only
     * @return mixed
     */
    public function getRanking()
    {
        return $this->userService->getRankingByFormat('Sách điện tử');
    }

    /**
     * Get proposed ebooks only
     * @return mixed
     */
    public function getProposed()
    {
        return $this->userService->getProposedByFormat('Sách điện tử');
    }

    /**
     * Get ebooks by category
     * @param string $categorySlug
     * @param int $limit
     * @return mixed
     */


    /**
     * Get specific ebook details
     * @param string $slug
     * @return mixed
     */
    public function getEbook($slug)
    {
        return $this->userService->getEbook($slug);
    }
    public function getEbookCategorySlug(string $slug, int $page = 1, int $limit = 12)
    {
        $offset = ($page - 1) * $limit;
        
        return Books::with('categories', 'formats', 'authors')
            ->whereHas('categories', function ($query) use ($slug) {
                $query->where('slug', $slug);
            })
            ->latest()
            ->skip($offset)
            ->take($limit)
            ->get();
    }
    public function getEbooksByCategory($categorySlug, $limit = 12)
    {
        // Lấy sách thuộc category và có format là "Sách điện tử"
        return Books::with('categories', 'formats', 'authors')
            ->whereHas('categories', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->whereHas('formats', function ($query) {
                $query->where('name', 'Sách điện tử');
            })
            ->latest()
            ->take($limit)
            ->get();
    }
}
