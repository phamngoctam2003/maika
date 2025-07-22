<?php

namespace App\Services;

use App\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Books;
// use App\Models\Chapters;

class UserService {
    protected UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository) {
        $this->userRepository = $userRepository;
    }

    public function getLatest () {
        return $this->userRepository->getLatest ();
    }
    public function getEbook (string $slug): ?Books {
        return $this->userRepository->getBookSlug ($slug);
    }
    public function getAudiobook (string $slug): ?Books {
        return $this->userRepository->getBookSlug ($slug);
    }
    public function getEbookReader (string $slug): ?Books {
        return $this->userRepository->getEbookReader ($slug);
    }
    public function increaseView($slug) {
        return $this->userRepository->increaseView($slug);
    }

    public function getRanking() {
        return $this->userRepository->getRanking();
    }

    public function getProposed() {
        return $this->userRepository->getProposed();
    }
    public function getBooksByCategory(string $categorySlug, int $limit = 12) {
        return $this->userRepository->getBooksByCategory($categorySlug, $limit);
    }

    /**
     * Get latest books filtered by format
     * @param string $format - Book format ("Sách điện tử" or "Sách nói")
     * @return mixed
     */
    public function getLatestByFormat(string $format) {
        return $this->userRepository->getLatestByFormat($format);
    }

    /**
     * Get ranking books filtered by format
     * @param string $format - Book format ("Sách điện tử" or "Sách nói")
     * @return mixed
     */
    public function getRankingByFormat(string $format) {
        return $this->userRepository->getRankingByFormat($format);
    }

    /**
     * Get proposed books filtered by format
     * @param string $format - Book format ("Sách điện tử" or "Sách nói")
     * @return mixed
     */
    public function getProposedByFormat(string $format) {
        return $this->userRepository->getProposedByFormat($format);
    }

    /**
     * Get books by category and format
     * @param string $categorySlug - Category slug
     * @param string $format - Book format ("Sách điện tử" or "Sách nói")
     * @param int $limit - Number of books to return
     * @return mixed
     */
    public function getBooksByCategoryAndFormat(string $categorySlug, string $format, int $limit = 12) {
        return $this->userRepository->getBooksByCategoryAndFormat($categorySlug, $format, $limit);
    }
}
