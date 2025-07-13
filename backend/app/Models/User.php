<?php

/**
 * @method \Illuminate\Support\Collection getRoleNames()
 * @method \Illuminate\Support\Collection getAllPermissions()
 */

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasRoles;


    public $timestamps = false;
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role
        ];
    }
    protected $fillable = ['fullName', 'email', 'phone', 'password',];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function packages()
    {
        return $this->belongsToMany(Package::class, 'user_packages')
            ->withPivot([
                'id',
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
                'created_at',
                'updated_at'
            ])
            ->withTimestamps();
    }

    /**
     * Lấy gói hội viên đang active và chưa hết hạn
     */
    public function activePackages()
    {
        return $this->belongsToMany(Package::class, 'user_packages')
            ->withPivot([
                'id',
                'starts_at', 
                'ends_at', 
                'status', 
                'payment_method', 
                'payment_status',
                'amount'
            ])
            ->wherePivot('status', 'active')
            ->wherePivot('payment_status', 'completed') // Chỉ tính gói đã thanh toán thành công
            ->wherePivot('ends_at', '>', now())
            ->withTimestamps();
    }

    /**
     * Kiểm tra user có gói hội viên active không
     */
    public function hasMembership()
    {
        return $this->activePackages()->exists();
    }

    /**
     * Lấy gói hội viên active đầu tiên (nếu có)
     */
    public function getActivePackage()
    {
        return $this->activePackages()->first();
    }

    /**
     * Kiểm tra gói hội viên có sắp hết hạn không (trong 7 ngày)
     */
    public function isMembershipExpiringSoon()
    {
        $activePackage = $this->getActivePackage();
        if (!$activePackage) return false;

        $endsAt = \Carbon\Carbon::parse($activePackage->pivot->ends_at);
        $daysRemaining = $endsAt->diffInDays(now());
        
        return $daysRemaining <= 7 && $endsAt->isFuture();
    }
}
