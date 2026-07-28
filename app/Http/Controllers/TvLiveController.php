<?php

namespace App\Http\Controllers;

use App\Services\DemoCart;
use App\Services\TvLiveShow;
use Illuminate\View\View;

class TvLiveController extends Controller
{
    public function show(): View
    {
        DemoCart::seed();
        session(['demo_drawer_enabled' => true]);

        $schedule = TvLiveShow::schedule();

        return view('demo.tv-live', [
            'cart' => DemoCart::state(),
            'copy' => TvLiveShow::pageCopy(),
            'schedule' => $schedule,
            'lineup' => TvLiveShow::lineup(),
            'categories' => TvLiveShow::filterCategories(),
            'youtubeEmbed' => TvLiveShow::youtubeEmbedSrc($schedule['is_live']),
            'youtubeChannelUrl' => TvLiveShow::YOUTUBE_CHANNEL_URL,
            'youtubePoster' => TvLiveShow::youtubePosterUrl(),
        ]);
    }
}
