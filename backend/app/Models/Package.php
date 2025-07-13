<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    //
    protected $fillable = [
        'name',
        'duration_months',
        'original_price',
        'discounted_price',
        'discount_percent',
        'highlight_label',
        'is_best_offer',
    ];

    protected $casts = [
        'original_price' => 'decimal:2',
        'discounted_price' => 'decimal:2',
        'discount_percent' => 'integer',
        'is_best_offer' => 'boolean',
    ];

    // Accessor để có thể sử dụng price như trước
    public function getPriceAttribute()
    {
        return $this->discounted_price;
    }

public function users()
{
    return $this->belongsToMany(User::class, 'user_packages');
}
}
