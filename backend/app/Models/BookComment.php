<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User as UserModel;
use App\Models\Books;

class BookComment extends Model
{
    protected $table = 'book_comment';
    protected $fillable = [
        'content',
        'rating',
        'comment_book_id',
        'is_admin',
        'user_id',
        'book_id'
    ];
    public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id');
    }

    public function book()
    {
        return $this->belongsTo(Books::class, 'book_id');
    }

    public function parentComment()
    {
        return $this->belongsTo(self::class, 'comment_book_id');
    }

    public function replies()
    {
        return $this->hasMany(self::class, 'comment_book_id');
    }
}
