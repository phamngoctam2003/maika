<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RoleController;

Route::get('test-api', function () {
    return response()->json([
        'message' => 'Api đã hoạt động thành công',
        'status' => 200,
    ]);
});

Route::resource('roles', RoleController::class)->except(['create', 'show', 'destroy', 'update']);
Route::post('roles/create', [RoleController::class, 'create']);
Route::get('roles/permissions', [RoleController::class, 'showPermissions']);
Route::get('roles/showrole/{id}', [RoleController::class, 'show']);
Route::post('roles/update/{id}', [RoleController::class, 'update']);
Route::post('roles/destroy', [RoleController::class, 'destroy']);
Route::group([
    'middleware' => ['api'],
    'prefix' => 'auth'
], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::get('me', [AuthController::class, 'me']);
    Route::middleware(['auth:api'])->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
    Route::middleware(['check.role:admin'])->group(function () {
        Route::post('admin/category/create', [CategoryController::class, 'create']);
        Route::get('admin/users', [AuthController::class, 'users']);
    });
    // Route::middleware(['role:admin,manager'])->group(function () {
    //     Route::get('/reports', [ReportController::class, 'index']);
    //     // Các routes cho cả admin và manager
    // });
});
