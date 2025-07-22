<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\HomeBookService;
use App\Services\EbookService;
use App\Services\AudiobookService;
use App\Services\UserService;

class BookServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register HomeBookService for home page (all book types)
        $this->app->bind(HomeBookService::class, function ($app) {
            return new HomeBookService(
                $app->make(UserService::class)
            );
        });

        // Register EbookService for ebooks only
        $this->app->bind(EbookService::class, function ($app) {
            return new EbookService(
                $app->make(UserService::class)
            );
        });

        // Register AudiobookService for audiobooks only
        $this->app->bind(AudiobookService::class, function ($app) {
            return new AudiobookService(
                $app->make(UserService::class)
            );
        });
    }

    public function boot()
    {
        //
    }
}
