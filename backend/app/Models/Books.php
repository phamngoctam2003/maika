<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Model;

class Books extends Model
{
    use HasSlug;
    protected $table = 'books';
    protected $fillable = [
        'title',
        'publication_year',
        'description',
        'file_path',
        'access_type',
        'status',
        'slug',
    ];
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'book_category', 'book_id', 'category_id');
    }
    public function formats()
    {
        return $this->belongsToMany(BookFormat::class, 'book_format_mappings', 'book_id', 'format_id');
    }
    public function authors()
    {
        return $this->belongsToMany(Author::class, 'author_book', 'book_id', 'author_id');
    }
    public function chapters()
    {
        return $this->hasMany(Chapter::class, 'book_id', 'id');
    }
}
