<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPackage extends Model
{
    protected $table = 'user_packages';
    protected $fillable = [
        'user_id',
        'package_id',
        'starts_at',
        'ends_at',
        'status',
        'payment_method',
        'payment_status',
        'transaction_id',
        'order_id',
        'amount',
        'payment_data',
        'payment_at',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'payment_at' => 'datetime',
        'payment_data' => 'json',
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
