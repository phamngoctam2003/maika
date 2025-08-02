<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Illuminate\Console\Scheduling\Schedule;
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 
        $middleware->append([
            
        ]);

        // Hoặc đăng ký middleware nhóm
        $middleware->group('api-test', [
            \App\Http\Middleware\AuthenticateWithJwt::class,
        ]);
        
        $middleware->group('api', [
            \Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);

        // Hoặc đăng ký route middleware
        $middleware->alias([
            'jwt.auth' => \App\Http\Middleware\AuthenticateWithJwt::class,
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            'check.role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
        $exceptions->render(function (TokenInvalidException $e, $request) {
            return response()->json(['error' => 'Token không hợp lệ!'], 401);
        });

        $exceptions->render(function (TokenExpiredException $e, $request) {
            return response()->json(['error' => 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!'], 401);
        });
    })
    ->withSchedule(function (Schedule $schedule) {
        $schedule->command('subscriptions:update-expired')->dailyAt('00:15' );
    })
    ->create();
