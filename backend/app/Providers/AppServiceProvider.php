<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Cấu hình middleware cho nhóm api route
        RateLimiter::for('api', function ($request) {
            return Limit::perMinute(120)->by(optional($request->user())->id ?: $request->ip());
        });

        // Rate limit riêng cho home routes (ít nghiêm ngặt hơn)
        RateLimiter::for('home', function ($request) {
            return Limit::perMinute(30)->by($request->ip());
        });
    }
}
