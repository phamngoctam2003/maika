<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\BookDetaiController;
use App\Http\Controllers\User\ReadingHistoryController;
use App\Http\Controllers\User\BookCommentController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Api\VnpayController;

Route::get('test-api', function () {
    return response()->json([
        'message' => 'Api đang hoạt động!',
        'data' => [
            'name' => 'Laravel API',
            'version' => '12.0.0',
        ],
        'timestamp' => now()->toDateTimeString(),
        'status' => 200,
    ]);
});

route::group(['prefix' => 'categories'], function () {
    route::get('/', [CategoryController::class, 'index']);
    route::get('/with-formats', [CategoryController::class, 'getCategoriesWithFormats']);
    route::get('/ebook', [CategoryController::class, 'getEbookCategories']);
    route::get('/audiobook', [CategoryController::class, 'getAudiobookCategories']);
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
    route::get('authors', [BookController::class, 'getAuthors']);
    route::get('/', [BookController::class, 'index']);
    route::post('create', [BookController::class, 'create']);
    route::get('/{id}', [BookController::class, 'show']);
    route::post('/update/{id}', [BookController::class, 'update']);
    route::post('/destroy', [BookController::class, 'delete']);
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

route::group(['prefix' => 'users'], function () {
    route::post('{slug}/increase-view', [HomeController::class, 'increaseView']);
    route::group(['prefix' => 'home', 'middleware' => 'throttle:home'], function () {
        route::get('get-latest', [HomeController::class, 'getLatest']);
        route::get('get-ranking', [HomeController::class, 'getRanking']);
        route::get('get-proposed', [HomeController::class, 'getProposed']);
        route::get('get-books-by-category/{categorySlug}', [HomeController::class, 'getBooksByCategory']);
    });

    route::group(['prefix' => 'detail'], function () {
        route::get('get-ebook-reader/{slug}', [BookDetaiController::class, 'getEbookReader']);
        route::get('get-ebook/{slug}', [BookDetaiController::class, 'getEbook']);
    });

    Route::group(['prefix' => 'reading-history'], function () {
        Route::post('/save', [ReadingHistoryController::class, 'save']);
        Route::get('/{slug}', [ReadingHistoryController::class, 'getProgress']);
        Route::get('/', [ReadingHistoryController::class, 'recentlyRead']);
    });

    route::group(['prefix' => 'book-comments'], function () {
        Route::get('/', [BookCommentController::class, 'index']);
        Route::post('/create', [BookCommentController::class, 'create']);
        Route::post('/check-user-comment', [BookCommentController::class, 'checkUserComment']);
        // Route::post('create', [\App\Http\Controllers\User\BookCommentController::class, 'create']);
        // Route::get('/{id}', [\App\Http\Controllers\User\BookCommentController::class, 'show']);
        // Route::post('/update/{id}', [\App\Http\Controllers\User\BookCommentController::class, 'update']);
    });

    route::group(['prefix' => 'package'], function () {
        route::get('/', [PackageController::class, 'getPackagesWithUser']);
        route::post('/purchase', [PackageController::class, 'setUserPackage'])
             ->middleware('throttle:5,1'); // Limit 5 requests per minute
    });
});

// VNPay Payment routes - Improved implementation
Route::group(['prefix' => 'vnpay'], function () {
    Route::post('/create-payment', [VnpayController::class, 'createPayment'])
        ->middleware('auth:api');
    Route::post('/return', [VnpayController::class, 'handleReturn']);
    Route::get('/check-config', [VnpayController::class, 'checkConfig']);
    Route::post('/debug-hash', [VnpayController::class, 'debugHash'])
        ->middleware('auth:api');
    Route::any('/debug-callback', [VnpayController::class, 'debugCallback']);
    Route::get('/test-complete-callback', [VnpayController::class, 'testCompleteCallback']);
    Route::any('/debug-real-callback', [VnpayController::class, 'debugRealCallback']);
    Route::get('/test-simple-callback', [VnpayController::class, 'testSimpleCallback']);
});

// Legacy payment routes (for other payment methods if needed)
Route::group(['prefix' => 'payment'], function () {
    Route::get('/status', [PaymentController::class, 'checkPaymentStatus'])
        ->middleware('auth:api');
    Route::post('/cancel', [PaymentController::class, 'cancelPayment'])
        ->middleware('auth:api');
    Route::post('/cleanup', [PaymentController::class, 'cleanupPendingPayments'])
        ->middleware('auth:api');
});
