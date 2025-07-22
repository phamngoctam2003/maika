<?php

namespace App\Http\Controllers\User;

use App\Services\HomeBookService;

/**
 * Home Controller - Handles home page book operations
 * Extends BaseBookController with HomeBookService for all book formats
 * Used for /users/home/* routes - displays both ebooks and audiobooks
 */
class HomeController extends BaseBookController
{
    /**
     * Constructor - inject HomeBookService for all book types
     * @param HomeBookService $homeBookService
     */
    public function __construct(HomeBookService $homeBookService)
    {
        parent::__construct($homeBookService);
    }
}
