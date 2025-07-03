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
        return $this->userRepository->getEbook ($slug);
    }
    public function getEbookReader (string $slug): ?Books {
        return $this->userRepository->getEbookReader ($slug);
    }
    public function increaseView($slug) {
        return $this->userRepository->increaseView($slug);
    }
}
