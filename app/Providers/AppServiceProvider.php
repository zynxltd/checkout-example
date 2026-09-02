<?php

namespace App\Providers;

use App\Services\DemoArgosNav;
use App\Support\DemoDrawerVariant;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
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
        $this->configureProductionSession();

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

    private function configureProductionSession(): void
    {
        $appUrl = (string) config('app.url');

        if (str_starts_with($appUrl, 'https://')) {
            URL::forceScheme('https');
            config(['session.secure' => true]);
        }

        if (! $this->app->environment('production')) {
            return;
        }

        if (config('session.driver') !== 'file') {
            return;
        }

        try {
            if (Schema::hasTable('sessions')) {
                config(['session.driver' => 'database']);
            }
        } catch (\Throwable) {
            // Database may be unavailable during early boot / artisan commands.
        }
    }
}
