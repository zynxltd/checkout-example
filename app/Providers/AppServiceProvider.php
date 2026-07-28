<?php

namespace App\Providers;

use App\Services\DemoArgosNav;
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
            $view->with('drawerVariant30', DemoDrawerVariant::isV30Active());
        });

        View::composer('demo.partials.site-chrome-argos', function ($view): void {
            $data = $view->getData();
            if (empty($data['shop_menu'])) {
                $view->with('shop_menu', DemoArgosNav::shopMenu());
            }
            if (empty($data['trending_links'])) {
                $view->with('trending_links', DemoArgosNav::trendingLinks());
            }
        });
    }
}
