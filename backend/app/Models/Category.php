<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasSlug;

class Category extends Model
{
    use HasFactory;
    use HasSlug;
    
    protected $table = 'categories';
    protected $fillable = ['name', 'description', 'slug'];
    
    // Chỉ định cột nguồn để tạo slug
    protected $slugFrom = 'name';

    public function books()
    {
        return $this->belongsToMany(Books::class, 'book_category', 'category_id', 'book_id');
    }
}
