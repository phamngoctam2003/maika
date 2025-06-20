<?php

namespace App\Repositories;

use App\Contracts\ClientRepositoryInterface;
use App\Models\Books;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

class ClientRepository implements ClientRepositoryInterface
{
    public function getLatest ()
    {
        return Books::latest()->take(12)->get();
    }

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return Books::paginate(10);
    }

    public function getById(int $id): ?User
    {
        return Books::find($id);
    }
}
