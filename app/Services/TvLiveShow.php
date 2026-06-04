<?php

namespace App\Services;

use DateTimeImmutable;
use DateTimeZone;
use Illuminate\Support\Str;

/**
 * TV Live show data — line-up titles mirror yougarden.com/tv-live (demo SKUs for basket).
 *
 * @see https://www.yougarden.com/tv-live
 */
class TvLiveShow
{
    public const SHOW_HOUR = 14;

    public const SHOW_MINUTE = 0;

    public const SHOW_DURATION_MINUTES = 120;

    public const YOUTUBE_CHANNEL_ID = 'UCLMujNspgKbXY3oAQ4qUvYg';

    public const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/channel/UCLMujNspgKbXY3oAQ4qUvYg';

    public static function youtubeEmbedSrc(bool $isLive): string
    {
        $channel = self::YOUTUBE_CHANNEL_ID;

        if ($isLive) {
            return 'https://www.youtube.com/embed/live_stream?channel='.$channel.'&autoplay=1';
        }

        $uploadsPlaylist = 'UU'.substr($channel, 2);

        return 'https://www.youtube.com/embed/videoseries?list='.$uploadsPlaylist.'&autoplay=1';
    }

    /**
     * Production-style show products mapped to demo catalogue SKUs.
     *
     * @var list<array{sku: string, title: string, display_price: float, category: string, on_air?: bool}>
     */
    private const LINEUP = [
        ['sku' => '404221', 'title' => 'Premium Professional Compost 2 x 50 Litre Bags', 'display_price' => 26.99, 'category' => 'compost', 'on_air' => true, 'deal' => 'Show exclusive'],
        ['sku' => '501004', 'title' => 'Strulch Mineralised Straw Garden Mulch 9kg x2', 'display_price' => 36.97, 'category' => 'compost', 'on_air' => true, 'deal' => '2 for 1'],
        ['sku' => '501004', 'title' => 'Professional Farmyard Manure 50L Bag', 'display_price' => 17.99, 'category' => 'compost'],
        ['sku' => '501004', 'title' => 'Ericaceous Compost 60L', 'display_price' => 19.99, 'category' => 'compost'],
        ['sku' => '404220', 'title' => "Black and Gold 'Pinecone' Planter x 5", 'display_price' => 34.95, 'category' => 'planters'],
        ['sku' => '510317', 'title' => 'Harkness The Elton John AIDS Foundation Rose', 'display_price' => 28.99, 'category' => 'roses', 'on_air' => true, 'deal' => 'Presenter pick'],
        ['sku' => '401842', 'title' => "Strawberry 'Sweet Colossus'", 'display_price' => 14.98, 'category' => 'fruit'],
        ['sku' => '510317', 'title' => 'Sicilian Lemon Tree', 'display_price' => 24.99, 'category' => 'fruit'],
        ['sku' => '401842', 'title' => "Begonia 'Apricot Fiery Shades' - New Improved", 'display_price' => 25.98, 'category' => 'bedding'],
        ['sku' => '401842', 'title' => "Geranium 'Rozanne' - RHS Plant of the Centenary", 'display_price' => 19.97, 'category' => 'bedding'],
        ['sku' => '401842', 'title' => 'Alstroemeria Summer Collection', 'display_price' => 19.99, 'category' => 'bedding'],
        ['sku' => '402156', 'title' => 'The Complete Winter Hardy Fuchsia Collection', 'display_price' => 19.94, 'category' => 'bedding'],
        ['sku' => '510317', 'title' => "Acer palmatum 'Taylor'", 'display_price' => 34.99, 'category' => 'trees'],
        ['sku' => '402156', 'title' => "Sarcococca hookeriana 'Winter Gem'", 'display_price' => 24.99, 'category' => 'shrubs'],
        ['sku' => '402156', 'title' => "Loropetalum 'Black Pearl' Chinese Witch Hazel", 'display_price' => 14.99, 'category' => 'shrubs'],
        ['sku' => '403891', 'title' => "Nandina 'Obsessed' - Sacred Bamboo", 'display_price' => 14.99, 'category' => 'shrubs'],
        ['sku' => '402156', 'title' => "Hydrangea 'Runaway Bride'", 'display_price' => 24.99, 'category' => 'shrubs'],
        ['sku' => '403891', 'title' => "Fatsia japonica 'Spider's Web'", 'display_price' => 19.99, 'category' => 'shrubs'],
        ['sku' => '402156', 'title' => "Philadelphus 'Petite Perfume Pink'", 'display_price' => 24.97, 'category' => 'shrubs'],
        ['sku' => '510317', 'title' => "Wisteria 'Amethyst Falls'", 'display_price' => 24.99, 'category' => 'climbers'],
        ['sku' => '402156', 'title' => "Wallflower Erysimum 'Bowles's Mauve'", 'display_price' => 14.97, 'category' => 'perennials'],
        ['sku' => '402156', 'title' => "Rudbeckia 'Goldsturm'", 'display_price' => 14.97, 'category' => 'perennials'],
        ['sku' => '403891', 'title' => 'Ophiopogon – Black Dragon Grass', 'display_price' => 24.97, 'category' => 'grasses'],
        ['sku' => '402156', 'title' => "Echinacea 'Green Twister'", 'display_price' => 14.97, 'category' => 'perennials'],
        ['sku' => '402156', 'title' => "Agapanthus 'Poppin Purple'", 'display_price' => 24.97, 'category' => 'perennials'],
        ['sku' => '510317', 'title' => "Pair of Oleander Double Yellow 'Luteum Plenum' Standards", 'display_price' => 59.98, 'category' => 'trees'],
        ['sku' => '403891', 'title' => "Cordyline 'Magic Star'", 'display_price' => 19.99, 'category' => 'shrubs'],
        ['sku' => '404220', 'title' => 'Rainbow Planters', 'display_price' => 24.98, 'category' => 'planters'],
        ['sku' => '404220', 'title' => '4 x Heavy Duty Pots 30L', 'display_price' => 17.96, 'category' => 'planters'],
        ['sku' => '404220', 'title' => 'Tower Planters with Trellis Frames', 'display_price' => 39.98, 'category' => 'planters'],
    ];

    /** @return array{heading: string, intro: string} */
    public static function pageCopy(): array
    {
        return [
            'heading' => 'Watch our Live Shows every Thursday from 2pm',
            'intro' => 'Join our live and interactive shows every week from the Potting Shed at the You Garden Nursery. We have special offers not available elsewhere and free gifts for live viewers. Hosted by friendly and familiar faces with all of the expert advice and guidance that you will need to make the most of your garden all year through.',
        ];
    }

    /** @return array{is_live: bool, status: string, label: string, next_at: DateTimeImmutable, next_iso: string, show_day_label: string, countdown_seconds: int} */
    public static function schedule(): array
    {
        $tz = new DateTimeZone('Europe/London');
        $now = new DateTimeImmutable('now', $tz);
        $start = self::showStart($now, $tz);
        $end = $start->modify('+'.self::SHOW_DURATION_MINUTES.' minutes');
        $isLive = $now >= $start && $now < $end;

        if ($isLive) {
            $label = 'Live now';
            $status = 'live';
            $countdownTarget = $end;
        } else {
            $label = 'Next show: Thursday 2pm';
            $status = 'upcoming';
            $countdownTarget = $start;
        }

        return [
            'is_live' => $isLive,
            'status' => $status,
            'label' => $label,
            'next_at' => $start,
            'next_iso' => $countdownTarget->format(DateTimeImmutable::ATOM),
            'show_day_label' => $start->format('l j F Y'),
            'countdown_seconds' => max(0, $countdownTarget->getTimestamp() - $now->getTimestamp()),
        ];
    }

    /**
     * @return list<array{
     *     sku: string,
     *     name: string,
     *     variant: string,
     *     image: string,
     *     price: float,
     *     was_price: ?float,
     *     category: string,
     *     category_label: string,
     *     on_air: bool,
     *     deal: ?string
     * }>
     */
    public static function lineup(): array
    {
        $catalogue = DemoCart::catalogue();
        $categories = self::categoryLabels();
        $items = [];

        foreach (self::LINEUP as $index => $row) {
            $product = $catalogue[$row['sku']] ?? null;
            if (! $product || ! empty($product['is_club'])) {
                continue;
            }

            $items[] = [
                'sku' => $product['sku'],
                'line_id' => $product['sku'].'-'.$index,
                'name' => $row['title'],
                'variant' => $product['variant'] ?? '',
                'image' => $product['image'],
                'price' => (float) $row['display_price'],
                'was_price' => null,
                'category' => $row['category'],
                'category_label' => $categories[$row['category']] ?? ucfirst($row['category']),
                'on_air' => ! empty($row['on_air']),
                'deal' => $row['deal'] ?? null,
            ];
        }

        return $items;
    }

    /** @return list<array{id: string, label: string}> */
    public static function filterCategories(): array
    {
        $used = [];
        foreach (self::lineup() as $item) {
            $used[$item['category']] = $item['category_label'];
        }

        $filters = [['id' => 'all', 'label' => 'All show items']];
        foreach ($used as $id => $label) {
            $filters[] = ['id' => $id, 'label' => $label];
        }

        return $filters;
    }

    /** @return array<string, string> */
    public static function categoryLabels(): array
    {
        return [
            'all' => 'All',
            'compost' => 'Compost & soil',
            'planters' => 'Planters',
            'roses' => 'Roses',
            'fruit' => 'Fruit',
            'bedding' => 'Bedding',
            'trees' => 'Trees',
            'shrubs' => 'Shrubs',
            'climbers' => 'Climbers',
            'perennials' => 'Perennials',
            'grasses' => 'Grasses',
        ];
    }

    private static function showStart(DateTimeImmutable $now, DateTimeZone $tz): DateTimeImmutable
    {
        $cursor = $now->setTime(self::SHOW_HOUR, self::SHOW_MINUTE, 0);
        $dow = (int) $cursor->format('N');
        $daysAhead = (4 - $dow + 7) % 7;

        if ($daysAhead === 0 && $now >= $cursor->modify('+'.self::SHOW_DURATION_MINUTES.' minutes')) {
            $daysAhead = 7;
        }

        return $cursor->modify('+'.$daysAhead.' days');
    }
}
