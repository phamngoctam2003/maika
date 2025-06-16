<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Books extends Model
{
    //
    protected $table = 'books';
    protected $fillable = [
        'title',
        'author',
        'publication_year',
        'description',
        'file_path',
        'access_type',
        'status',
    ];
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'book_category', 'book_id', 'category_id');
    }
    public function formats()
    {
        return $this->belongsToMany(BookFormat::class, 'book_format_mappings', 'book_id', 'format_id');
    }
}
