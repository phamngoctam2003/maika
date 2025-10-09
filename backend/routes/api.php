<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\EbookController;
use App\Http\Controllers\User\AudiobookController;
use App\Http\Controllers\User\BookDetaiController;
use App\Http\Controllers\User\ReadingHistoryController;
use App\Http\Controllers\User\BookCommentController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Api\VnpayController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;

Route::get('test-api', function () {
    return response()->json([
        'message' => 'API đã hoạt động!',
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
    route::get('/{id}', [CategoryController::class, 'show']);
    route::post('create', [CategoryController::class, 'create']);
    route::post('/update/{id}', [CategoryController::class, 'update']);
    route::post('/destroy', [CategoryController::class, 'delete']);
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
route::group(['prefix' => 'packages'], function () {
    route::get('/', [PackageController::class, 'index']);
    route::post('/create', [PackageController::class, 'create']);
    route::get('/{id}', [PackageController::class, 'show']);
    route::post('/update/{id}', [PackageController::class, 'update']);
    route::post('/delete', [PackageController::class, 'delete']);
});

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
    route::post('/destroy', [ChapterController::class, 'delete']);
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
        Route::post('/change-password', [AuthController::class, 'changePassword']);
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

Route::post('auth/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('auth/reset-password', [ResetPasswordController::class, 'reset']);

route::group(['prefix' => 'users'], function () {
    route::post('{slug}/increase-view', [HomeController::class, 'increaseView']);
    Route::post('profile', [AuthController::class, 'updateProfile']);
    route::group(['prefix' => 'home', 'middleware' => 'throttle:home'], function () {
        route::get('get-book-free', [HomeController::class, 'getBookFree']);
        route::get('get-book-member', [HomeController::class, 'getBookMember']);
        route::get('get-latest', [HomeController::class, 'getLatest']);
        route::get('get-ranking', [HomeController::class, 'getRanking']);
        route::get('get-proposed', [HomeController::class, 'getProposed']);
        route::get('get-category-book', [CategoryController::class, 'getBookCategories']);
        route::get('get-books-by-category/{categorySlug}', [HomeController::class, 'getBooksByCategory']);
    });

    route::group(['prefix' => 'ebook'], function () {
        route::get('get-ebooks-by-category/{categorySlug}', [EbookController::class, 'getEbooksByCategory']);
        route::get('get-latest', [EbookController::class, 'getLatest']);
        route::get('/', [CategoryController::class, 'getEbookCategories']);
        route::get('/getcategory/{slug}', [EbookController::class, 'getEbooksCategorySlug']);
        route::get('/get-all-ebook-category', [CategoryController::class, 'getAllEbookCategories']);
        route::get('get-ranking', [EbookController::class, 'getRanking']);
        route::get('get-proposed', [EbookController::class, 'getProposed']);
    });
    route::group(['prefix' => 'audiobook'], function () {
        route::get('get-audiobooks-by-category/{categorySlug}', [AudiobookController::class, 'getAudiobooksByCategory']);
        route::get('/', [CategoryController::class, 'getAudiobookCategories']);
        route::get('getcategory/{slug}', [AudioBookController::class, 'getAudiobooksCategorySlug']);
        route::get('get-latest', [AudioBookController::class, 'getLatest']);
        route::get('get-all-audiobook-category', [CategoryController::class, 'getAllAudiobookCategories']);
        route::get('get-ranking', [AudioBookController::class, 'getRanking']);
        route::get('get-proposed', [AudioBookController::class, 'getProposed']);
    });

    route::group(['prefix' => 'detail'], function () {
        route::get('get-ebook-reader/{slug}', [BookDetaiController::class, 'getEbookReader']);
        route::get('get-book/{slug}', [BookDetaiController::class, 'getBook']);
    });

    // Audio chapters and progress routes
    route::group(['prefix' => 'books'], function () {
        route::get('stream-audio/{path}', [AudioBookController::class, 'stream'])->where('path', '.*');
        route::get('{bookId}/chapters', [ChapterController::class, 'getBookChapters']);
        route::get('{bookId}/chapters/{chapterId}/audio', [ChapterController::class, 'getChapterAudio']);
        route::post('{bookId}/chapters/{chapterId}/progress', [ChapterController::class, 'updateListeningProgress'])
            ->middleware('auth:api');
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

    Route::group(['prefix' => 'listening-history'], function () {
        Route::get('/', [\App\Http\Controllers\User\ListeningProgressController::class, 'recentlyListened']);
        Route::post('/save', [\App\Http\Controllers\User\ListeningProgressController::class, 'save']);
        Route::get('/{chapterId}', [\App\Http\Controllers\User\ListeningProgressController::class, 'getProgress']);
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
Route::group(['prefix' => 'payments'], function () {
    Route::get('/', [PaymentController::class, 'getAllPayments'])
        ->middleware('auth:api');
    Route::post('/update/{id}', [PaymentController::class, 'updatePayment'])
        ->middleware('auth:api');
    Route::get('/getbyid/{id}', [PaymentController::class, 'getPaymentById'])
        ->middleware('auth:api');
    Route::get('/status', [PaymentController::class, 'checkPaymentStatus'])
        ->middleware('auth:api');
    Route::post('/cancel', [PaymentController::class, 'cancelPayment'])
        ->middleware('auth:api');
    Route::post('/cleanup', [PaymentController::class, 'cleanupPendingPayments'])
        ->middleware('auth:api');
});


Route::group(['prefix' => 'users', 'middleware' => 'auth:api'], function () {
    // ... các route khác của bạn

    // Route để thêm sách vào tủ sách
    Route::post('book-case/add', [App\Http\Controllers\User\BookCaseController::class, 'store']);
    Route::delete('book-case/{book}', [App\Http\Controllers\User\BookCaseController::class, 'destroy']);
    Route::get('book-case', [App\Http\Controllers\User\BookCaseController::class, 'getBookCase']);
});
Route::middleware('auth:api')->group(function () {
    // ...existing code...
    Route::get('/transaction-histories', [AuthController::class, 'transactionHistories']);
    // ...existing code...
});
