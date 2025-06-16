<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ChapterController;
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

route::group(['prefix' => 'categories'], function () {
    route::get('/', [CategoryController::class, 'index']);
    route::get('/{id}', [CategoryController::class, 'show']);
    route::post('create', [CategoryController::class, 'create']);
    route::post('/update/{id}', [CategoryController::class, 'update']);
});
route::group(['prefix' => 'accounts'], function () {
    route::get('/', [AccountController::class, 'index']);
    route::get('getbyid/{id}', [AccountController::class, 'getAccountById']);
    route::post('rolelevel/{id}', [AccountController::class, 'roleLevel']);
    route::get('showroles', [AccountController::class, 'showRoles']);
});

// route::group(['prefix' => 'book-types'], function () {
//     route::get('/', [BooktypeController::class, 'index']);
//     route::post('create', [BooktypeController::class, 'create']);
//     route::get('/{id}', [BooktypeController::class, 'show']);
//     route::post('/update/{id}', [BooktypeController::class, 'update']);
// });



route::group(['prefix' => 'books'], function () {
    route::get('formats', [BookController::class, 'getAllFormats']);
    route::get('/', [BookController::class, 'index']);
    route::post('create', [BookController::class, 'create']);
    route::get('/{id}', [BookController::class, 'show']);
    route::post('/update/{id}', [BookController::class, 'update']);
});

route::group(['prefix' => 'chapters'], function () {
    route::get('/', [ChapterController::class, 'index']);
    route::post('create', [ChapterController::class, 'create']);
    route::get('/{id}', [ChapterController::class, 'show']);
    route::post('/update/{id}', [ChapterController::class, 'update']);
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
