<?php

namespace App\Services;

use App\Services\UserService;
use App\Models\Books;

/**
 * Home Book Service - Handles all book types
 * Used for Home section to display both ebooks and audiobooks
 * No format filtering applied - shows all available books
 */
class HomeBookService
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
     * Get latest books from all formats (ebooks + audiobooks)
     * @return mixed
     */
    public function getLatest()
    {
        // Get all books without format filtering
        return $this->userService->getLatest();
    }

    /**
     * Increase view count for any book type
     * @param string $slug
     * @return mixed
     */
    public function increaseView($slug)
    {
        return $this->userService->increaseView($slug);
    }

    /**
     * Get ranking books from all formats
     * @return mixed
     */
    public function getRanking()
    {
        return $this->userService->getRanking();
    }

    /**
     * Get proposed books from all formats
     * @return mixed
     */
    public function getProposed()
    {
        return $this->userService->getProposed();
    }

    /**
     * Get books by category from all formats
     * @param string $categorySlug
     * @return mixed
     */
    public function getBooksByCategory($categorySlug)
    {
        return $this->userService->getBooksByCategory($categorySlug);
    }

    
}
