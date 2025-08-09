<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookFormatMapping extends Model
{
    protected $table = 'book_format_mappings';
    protected $fillable = [
        'book_id',
        'format_id',
    ];

    // Mapping thuộc về 1 book
    public function book()
    {
        return $this->belongsTo(Books::class, 'book_id');
    }

    // Mapping có nhiều chapter
    public function chapters()
    {
        return $this->hasMany(Chapter::class, 'book_format_mapping_id');
    }
}
