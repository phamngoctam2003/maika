<?php

namespace App\Contracts;

interface AccountRepositoryInterface extends BaseRepositoryInterface
{
    public function getAccountByEmail(string $email): ?array;
}
