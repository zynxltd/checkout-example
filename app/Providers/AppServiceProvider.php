<?php

namespace App\Providers;

use App\Support\DemoDrawerVariant;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

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
        if (config('demo-preview.auth_enabled') && config('demo-preview.session_expire_on_close')) {
            config(['session.expire_on_close' => true]);
        }

        View::composer('demo.partials.drawer', function ($view): void {
            $view->with('drawerVariant21', DemoDrawerVariant::isActive());
        });
    }
}
