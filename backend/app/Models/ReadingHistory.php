<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReadingHistory extends Model
{
    protected $fillable = [
        'user_id',
        'book_id',
        'chapter_id',
        'chapter_index',
        'character_position',
        'chapter_progress',
        'last_read_at',
    ];

    protected $casts = [
        'chapter_progress' => 'decimal:2',
        'last_read_at' => 'datetime',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Books::class, 'book_id');
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }
}
