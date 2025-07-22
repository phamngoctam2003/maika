<?php

namespace App\Contracts;

interface UserRepositoryInterface
{
    public function getLatest ();
    public function getBookSlug (string $slug);
    public function getEbookReader (string $slug);
    public function increaseView($slug);
    public function getRanking();
    public function getProposed();
    public function getBooksByCategory(string $categorySlug, int $limit = 12);
    
    /**
     * Get latest books filtered by format
     * @param string $format
     * @return mixed
     */
    public function getLatestByFormat(string $format);
    
    /**
     * Get ranking books filtered by format
     * @param string $format
     * @return mixed
     */
    public function getRankingByFormat(string $format);
    
    /**
     * Get proposed books filtered by format
     * @param string $format
     * @return mixed
     */
    public function getProposedByFormat(string $format);
     /**
     * Get books by category and format
     * @param string $categorySlug
     * @param string $format
     * @param int $limit
     * @return mixed
     */
    public function getBooksByCategoryAndFormat(string $categorySlug, string $format, int $limit = 12);
}
