<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Models\UserPackage;

// Load Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Kiểm tra dữ liệu gói hội viên ===\n\n";

// Lấy tất cả user packages
$userPackages = UserPackage::with(['user', 'package'])->get();

echo "Tất cả User Packages:\n";
echo str_repeat('-', 100) . "\n";
printf("%-5s %-10s %-15s %-10s %-15s %-20s %-20s\n", 
    'ID', 'User ID', 'Package', 'Status', 'Payment', 'Starts At', 'Ends At');
echo str_repeat('-', 100) . "\n";

foreach ($userPackages as $up) {
    $packageName = $up->package ? $up->package->name : 'N/A';
    $startsAt = $up->starts_at ? $up->starts_at->format('Y-m-d H:i') : 'N/A';
    $endsAt = $up->ends_at ? $up->ends_at->format('Y-m-d H:i') : 'N/A';
    
    printf("%-5s %-10s %-15s %-10s %-15s %-20s %-20s\n",
        $up->id,
        $up->user_id,
        substr($packageName, 0, 14),
        $up->status,
        $up->payment_status,
        $startsAt,
        $endsAt
    );
}

echo "\n" . str_repeat('=', 100) . "\n\n";

// Kiểm tra từng user có active package không
$users = User::all();

echo "Kiểm tra hội viên của từng user:\n";
echo str_repeat('-', 80) . "\n";
printf("%-5s %-20s %-15s %-30s\n", 'ID', 'Email', 'Has Membership', 'Active Package');
echo str_repeat('-', 80) . "\n";

foreach ($users as $user) {
    $hasMembership = $user->hasMembership();
    $activePackage = $user->getActivePackage();
    $activePackageName = $activePackage ? $activePackage->name : 'None';
    
    printf("%-5s %-20s %-15s %-30s\n",
        $user->id,
        substr($user->email, 0, 19),
        $hasMembership ? 'Yes' : 'No',
        substr($activePackageName, 0, 29)
    );
}

echo "\n" . str_repeat('=', 100) . "\n\n";

// Kiểm tra các gói hội viên có vấn đề
echo "Các gói có vấn đề (active nhưng payment không completed):\n";
echo str_repeat('-', 80) . "\n";

$problematicPackages = UserPackage::where('status', 'active')
    ->where('payment_status', '!=', 'completed')
    ->with(['user', 'package'])
    ->get();

if ($problematicPackages->count() > 0) {
    printf("%-5s %-10s %-15s %-10s %-15s %-20s\n", 
        'ID', 'User ID', 'Package', 'Status', 'Payment', 'Ends At');
    echo str_repeat('-', 80) . "\n";
    
    foreach ($problematicPackages as $up) {
        $packageName = $up->package ? $up->package->name : 'N/A';
        $endsAt = $up->ends_at ? $up->ends_at->format('Y-m-d H:i') : 'N/A';
        
        printf("%-5s %-10s %-15s %-10s %-15s %-20s\n",
            $up->id,
            $up->user_id,
            substr($packageName, 0, 14),
            $up->status,
            $up->payment_status,
            $endsAt
        );
    }
} else {
    echo "Không có gói nào có vấn đề.\n";
}

echo "\n" . str_repeat('=', 100) . "\n";
echo "Hoàn thành kiểm tra!\n";
