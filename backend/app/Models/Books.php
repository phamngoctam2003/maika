<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Model;
use \App\Models\BookFormatMapping;
use \App\Models\Chapter;

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
    public function book_format_mappings()
    {
        return $this->hasMany(BookFormatMapping::class, 'book_id');
    }
    public function authors()
    {
        return $this->belongsToMany(Author::class, 'author_book', 'book_id', 'author_id');
    }
    public function chapters()
    {
        return $this->hasManyThrough(
            Chapter::class,              // Model cuối cùng muốn lấy: chương
            BookFormatMapping::class,    // Model trung gian: bản định dạng sách
            'book_id',                   // Khóa ngoại từ BookFormatMapping → Book
            'book_format_mapping_id',   // Khóa ngoại từ Chapter → BookFormatMapping
            'id',                        // Khóa chính của Book (model hiện tại)
            'id'                    // Khóa chính của BookFormatMapping
        );
    }
    /**
     * The users who have this book in their bookcase.
     */
    public function usersInBookCase()
    {
        return $this->belongsToMany(User::class, 'user_book_case', 'book_id', 'user_id')->withTimestamps();
    }


    public function scopePaginate($query, $perPage)
    {
        return $query->paginate($perPage);
    }
    public function scopeApplyFilters($query, $filters)
    {
        $query->when($filters['sortorder'] ?? 'desc', function ($query, $sort) {
            return $query->orderBy('created_at', $sort);
        });
        return $query->paginate($filters['per_page'] ?? 10);
    }
    public function scopeSearch($query, $keyword)
    {
        if (!empty($keyword)) {
            return $query->where('title', 'LIKE', '%' . $keyword . '%')
                ->orWhereHas('variants', function ($query) use ($keyword) {
                    $query->where('sku', 'LIKE', '%' . $keyword . '%');
                });
        }
        return $query;
    }
    public function scopeFilterCategory($query, $slug)
    {
        if (!empty($slug)) {
            return $query->whereHas('categories', function ($query) use ($slug) {
                $query->where('slug', $slug);
            });
        }
        return $query;
    }
}
