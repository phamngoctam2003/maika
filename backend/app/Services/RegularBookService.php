<?php

namespace App\Services;

class RegularBookService
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getLatest()
    {
        // Delegate to UserService for regular books
        return $this->userService->getLatest();
    }

    public function increaseView($slug)
    {
        return $this->userService->increaseView($slug);
    }

    public function getRanking()
    {
        return $this->userService->getRanking();
    }

    public function getProposed()
    {
        return $this->userService->getProposed();
    }

    public function getBooksByCategory($categorySlug, $limit = 12)
    {
        return $this->userService->getBooksByCategory($categorySlug, $limit);
    }

    public function getBook($slug)
    {
        return $this->userService->getEbook($slug); // Sử dụng method hiện tại
    }
}
