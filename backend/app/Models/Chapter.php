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
        'status'
    ];

    public function book()
    {
        return $this->belongsTo(Books::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
