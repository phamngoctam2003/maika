<?php 
namespace App\Services;

use App\Contracts\AccountRepositoryInterface;
use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AccountService {
    protected AccountRepositoryInterface $accountRepository;

    public function __construct(AccountRepositoryInterface $accountRepository) {
        $this->accountRepository = $accountRepository;
    }

    public function getAllAccount(array $filters = []): LengthAwarePaginator {
        return $this->accountRepository->getAll($filters);
    }

    public function getAccountById(int $id): ?User {
        return $this->accountRepository->getById($id);
    }
    public function createAccount(array $data): User {
        return $this->accountRepository->create($data);
    }

    public function showRoles(): Collection {
        return Role::orderBy('id', 'desc')->get();
    }

}