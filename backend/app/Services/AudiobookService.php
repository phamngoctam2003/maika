<?php

namespace App\Services;

use App\Models\Books;
use App\Services\UserService;

/**
 * Audiobook Service - Handles only audio books
 * Used for Audiobook section to display only books with format "Sách nói"
 * Filters books by book_formats field
 */
class AudiobookService
{
    protected $userService;

    /**
     * Constructor - inject UserService for data operations
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get latest audiobooks only (format: "Sách nói")
     * @return mixed
     */
    public function getLatest()
    {
        // Get books filtered by ebook format
        return $this->userService->getLatestByFormat('Sách nói');
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
        return $this->userService->getRankingByFormat('Sách nói');
    }

    /**
     * Get proposed ebooks only
     * @return mixed
     */
    public function getProposed()
    {
        return $this->userService->getProposedByFormat('Sách nói');
    }

    /**
     * Get ebooks by category
     * @param string $categorySlug
     * @param int $limit
     * @return mixed
     */
    public function getEbooksByCategory($categorySlug, $limit = 12)
    {
        // Lấy sách thuộc category và có format là "Sách nói"
        return Books::with('categories', 'formats', 'authors')
            ->whereHas('categories', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->whereHas('formats', function ($query) {
                $query->where('name', 'Sách nói');
            })
            ->latest()
            ->take($limit)
            ->get();
    }

    /**
     * Get specific ebook details
     * @param string $slug
     * @return mixed
     */
    public function getAudiobook($slug)
    {
        return $this->userService->getAudiobook($slug);
    }
    public function getAudiobooksCategorySlug(string $slug, int $page = 1, int $limit = 12)
    {
        $offset = ($page - 1) * $limit;

        return Books::with('categories', 'formats', 'authors')
            ->whereHas('categories', function ($query) use ($slug) {
                $query->where('slug', $slug);
            })
            ->whereHas('formats', function ($query) {
                $query->where('name', 'Sách nói');
            })
            ->latest()
            ->skip($offset)
            ->take($limit)
            ->get();
    }

    public function getAudiobooksByCategory($categorySlug, $limit = 12)
    {
        // Lấy sách thuộc category và có format là "Sách nói"
        return Books::with('categories', 'formats', 'authors')
            ->whereHas('categories', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->whereHas('formats', function ($query) {
                $query->where('name', 'Sách nói');
            })
            ->latest()
            ->take($limit)
            ->get();
    }
}
