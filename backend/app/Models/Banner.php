<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $table = 'banners';
    protected $fillable = [
        'title',
        'status',
        'user_id',
        'image_url',
        'link',
        'sort_order'
    ];
        public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
