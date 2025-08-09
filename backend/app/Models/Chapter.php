<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    //
    protected $table = 'chapters';
    protected $fillable = [
        'title',
        'book_id',
        'user_id',
        'title',
        'content',
        'audio_path',
        'expected_chapters',
        'chapter_order',
        'status',
        'book_format_mapping_id',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookFormatMapping()
    {
        return $this->belongsTo(BookFormatMapping::class, 'book_format_mapping_id');
    }

    // Lấy book thông qua mapping
    public function book()
    {
        return $this->hasOneThrough(
            Books::class,
            BookFormatMapping::class,
            'id', // local key on book_format_mappings
            'id', // local key on books
            'book_format_mapping_id', // foreign key on chapters
            'book_id' // foreign key on book_format_mappings
        );
    }
}
