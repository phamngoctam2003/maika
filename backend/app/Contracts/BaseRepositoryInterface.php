<?php

namespace App\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BaseRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator;
    public function getById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $ids): bool;
    // public function getByIds(array $ids): Collection;
    public function search(string $query): LengthAwarePaginator;
}
