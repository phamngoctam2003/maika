<?php

namespace App\Providers;

use App\Contracts\CategoryRepositoryInterface;
use App\Repositories\CategoryRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(
            \App\Contracts\AccountRepositoryInterface::class,
            \App\Repositories\AccountRepository::class
        );
        $this->app->bind(
            \App\Contracts\BookRepositoryInterface::class,
            \App\Repositories\BookRepository::class
        );
        $this->app->bind(
            \App\Contracts\ChapterRepositoryInterface::class,
            \App\Repositories\ChapterRepository::class
        );
        $this->app->bind(
            \App\Contracts\UserRepositoryInterface::class,
            \App\Repositories\UserRepository::class
        );
        $this->app->bind(
            \App\Contracts\PackageRepositoryInterface::class,
            \App\Repositories\PackageRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
