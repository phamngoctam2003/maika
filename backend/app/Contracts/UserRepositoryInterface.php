<?php

namespace App\Contracts;

interface UserRepositoryInterface
{
    public function getLatest ();
    public function getEbook (string $slug);
    public function getEbookReader (string $slug);
    public function increaseView($slug);
    public function getRanking();
    public function getProposed();
    public function getBooksByCategory(string $categorySlug, int $limit = 12);

}
