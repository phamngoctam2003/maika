<?php

// Script để kiểm tra dữ liệu user_packages
require_once 'bootstrap/app.php';

use App\Models\UserPackage;
use App\Models\User;

$app = \Illuminate\Foundation\Application::configure()
    ->withRouting()
    ->withMiddleware()
    ->withExceptions()
    ->create();

$app->boot();

echo "=== KIỂM TRA DỮ LIỆU USER_PACKAGES ===\n\n";

// Lấy tất cả user_packages
$userPackages = UserPackage::with(['user', 'package'])
    ->orderBy('created_at', 'desc')
    ->get();

if ($userPackages->count() === 0) {
    echo "❌ Không có dữ liệu user_packages nào.\n";
} else {
    echo "📊 Tổng số gói hội viên: " . $userPackages->count() . "\n\n";
    
    foreach ($userPackages as $up) {
        echo "--- Gói ID: {$up->id} ---\n";
        echo "User: {$up->user->name} (ID: {$up->user_id})\n";
        echo "Package: {$up->package->name} (ID: {$up->package_id})\n";
        echo "Status: {$up->status}\n";
        echo "Payment Status: {$up->payment_status}\n";
        echo "Starts At: {$up->starts_at}\n";
        echo "Ends At: {$up->ends_at}\n";
        echo "Created: {$up->created_at}\n";
        
        // Kiểm tra còn hạn hay không
        $isActive = $up->status === 'active' && 
                   $up->payment_status === 'completed' && 
                   $up->ends_at && 
                   now() < $up->ends_at;
        
        echo "Còn hạn: " . ($isActive ? "✅ CÒN HẠN" : "❌ HẾT HẠN/KHÔNG ACTIVE") . "\n";
        
        if ($up->ends_at) {
            $daysRemaining = now()->diffInDays($up->ends_at, false);
            echo "Số ngày còn lại: " . ($daysRemaining > 0 ? $daysRemaining : 'Đã hết hạn') . "\n";
        }
        
        echo "\n";
    }
}

echo "\n=== KIỂM TRA CÁC USER CÓ HỘI VIÊN ACTIVE ===\n\n";

$users = User::with(['activePackages' => function($query) {
    $query->withPivot(['starts_at', 'ends_at', 'status', 'payment_status']);
}])->get();

foreach ($users as $user) {
    $activePackages = $user->activePackages;
    if ($activePackages->count() > 0) {
        echo "👤 User: {$user->name} (ID: {$user->id})\n";
        echo "Has Membership: " . ($user->hasMembership() ? "✅ CÓ" : "❌ KHÔNG") . "\n";
        
        foreach ($activePackages as $package) {
            echo "  📦 Package: {$package->name}\n";
            echo "    Status: {$package->pivot->status}\n";
            echo "    Ends At: {$package->pivot->ends_at}\n";
        }
        echo "\n";
    }
}

echo "\n=== KIỂM TRA SÁCH CÓ ACCESS_TYPE = 'member' ===\n\n";

$memberBooks = \App\Models\Books::where('access_type', 'member')->get();
echo "📚 Số sách yêu cầu hội viên: " . $memberBooks->count() . "\n";

foreach ($memberBooks->take(5) as $book) {
    echo "  - {$book->title} (slug: {$book->slug}, access_type: {$book->access_type})\n";
}

echo "\nHoàn tất kiểm tra!\n";
