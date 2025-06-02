<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RoleController;

Route::get('test-api', function () {
    return response()->json([
        'message' => 'Api đã hoạt động rồi nhá!',
        'data' => [
            'name' => 'Laravel API',
            'version' => '1.0.0',
        ],
        'timestamp' => now()->toDateTimeString(),
        'status' => 200,
    ]);
});
Route::resource('roles', RoleController::class)->except(['create', 'show', 'destroy', 'update']);
Route::group(['prefix' => 'roles'], function () {
    Route::get('permissions', [RoleController::class, 'showPermissions']);
    Route::post('create', [RoleController::class, 'create'])->middleware('check.permission:create-role');
    Route::get('showrole/{id}', [RoleController::class, 'show'])->middleware('check.permission:update-role');
    Route::post('update/{id}', [RoleController::class, 'update'])->middleware('check.permission:update-role');
    Route::post('destroy', [RoleController::class, 'destroy'])->middleware('check.permission:delete-role');
    // route::get('trash', [TrashedRoleController::class, 'index'])->middleware('check.permission:delete-role');
    // route::post('restore', [TrashedRoleController::class, 'restore'])->middleware('check.permission:delete-role');
    // route::delete('force-delete/{id}', [TrashedRoleController::class, 'forceDelete'])->middleware('check.permission:delete-role');
});

Route::group([
    'middleware' => ['api'],
    'prefix' => 'auth'
], function () {
    Route::post('/login-google', [AuthController::class, 'loginGoogle']);
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
