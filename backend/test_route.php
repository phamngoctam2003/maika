<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;

// Route test để kiểm tra hasMembership
Route::get('/test-membership/{userId}', function($userId) {
    $user = User::find($userId);
    
    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }
    
    return response()->json([
        'user_id' => $user->id,
        'user_name' => $user->name,
        'has_membership' => $user->hasMembership(),
        'active_packages' => $user->activePackages()->with('package')->get(),
        'active_package' => $user->getActivePackage(),
        'is_expiring_soon' => $user->isMembershipExpiringSoon()
    ]);
});
