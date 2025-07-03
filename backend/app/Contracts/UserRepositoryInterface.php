<?php

namespace App\Contracts;

interface UserRepositoryInterface
{
    public function getLatest ();
    public function getEbook (string $slug);
    public function getEbookReader (string $slug);
    public function increaseView($slug);
}
