<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Books;

class Author extends Model
{
    protected $table = 'authors';
    protected $fillable = [
        'name',
    ];

    /**
     * Get the books written by the author.
     */

}
