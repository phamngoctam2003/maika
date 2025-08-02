<?php

namespace App\Http\Controllers\User;

use App\Models\Books;
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

    public function getBookFree()
    {
        $filters = request()->only(['per_page', 'sortorder', 'format', 'filter_category']);
        $Books = Books::where('access_type', 'free')
        ->whereHas('formats', function ($query) use ($filters) {
            $query->where('name', $filters['format'] ?? 'Sách điện tử');
        })
            ->filterCategory($filters['filter_category'] ?? null)
            ->applyFilters($filters);
        return response()->json($Books);
    }

    public function getBookMember()
    {
        $filters = request()->only(['per_page', 'sortorder', 'format', 'filter_category']);
        $Books = Books::where('access_type', 'member')
        ->whereHas('formats', function ($query) use ($filters) {
            $query->where('name', $filters['format'] ?? 'Sách điện tử');
        })
            ->filterCategory($filters['filter_category'] ?? null)
            ->applyFilters($filters);
        return response()->json($Books);
    }
}
