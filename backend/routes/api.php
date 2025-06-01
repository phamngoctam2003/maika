<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RoleController;

Route::get('test-api', function () {
    return response()->json([
        'message' => 'Api đã hoạt động rồi!',
        'data' => [
            'name' => 'Laravel API',
            'version' => '1.0.0',
        ],
        'timestamp' => now()->toDateTimeString(),
        'status' => 200,
    ]);
});
route::get('test', [CategoryController::class, 'test']);
route::group((['prefix' => 'roles']), function () {
    Route::resource('/', RoleController::class)->except(['create', 'show', 'destroy', 'update']);
    Route::post('create', [RoleController::class, 'create']);
    Route::get('permissions', [RoleController::class, 'showPermissions']);
    Route::get('showrole/{id}', [RoleController::class, 'show']);
    Route::post('update/{id}', [RoleController::class, 'update']);
    Route::post('destroy', [RoleController::class, 'destroy']);
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
