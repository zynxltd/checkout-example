<?php

namespace App\Services;

use DateTimeImmutable;
use DateTimeZone;

/**
 * TV Live show data — mirrors yougarden.com/tv-live with demo basket SKUs.
 *
 * @see https://www.yougarden.com/tv-live
 */
class TvLiveShow
{
    public const SHOW_DURATION_MINUTES = 120;

    public const YOUTUBE_CHANNEL_ID = 'UCLMujNspgKbXY3oAQ4qUvYg';

    public const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/channel/UCLMujNspgKbXY3oAQ4qUvYg';

    /** Latest show video featured on yougarden.com/tv-live */
    public const YOUTUBE_LATEST_VIDEO_ID = '79DFE228lh0';

    /**
     * Weekly slots: Thursday 14:00 and Sunday 11:00 (Europe/London).
     *
     * @var list<array{dow: int, hour: int, minute: int, label: string}>
     */
    private const SHOW_SLOTS = [
        ['dow' => 4, 'hour' => 14, 'minute' => 0, 'label' => 'Thursday 2pm'],
        ['dow' => 7, 'hour' => 11, 'minute' => 0, 'label' => 'Sunday 11am'],
    ];

    /**
     * Current show line-up from yougarden.com/tv-live (titles + prices), mapped to demo SKUs.
     *
     * @var list<array{sku: string, title: string, display_price: float, category: string, on_air?: bool, deal?: string}>
     */
    private const LINEUP = [
        ['sku' => '404221', 'title' => 'Premium Professional Compost 110 Litre, with Fertiliser', 'display_price' => 29.99, 'category' => 'compost', 'on_air' => true, 'deal' => 'On air'],
        ['sku' => '501004', 'title' => 'Premium Professional Compost 110 Litre Bundle + Multi Purpose Handy Scoop', 'display_price' => 29.99, 'category' => 'compost', 'on_air' => true, 'deal' => 'Show deal'],
        ['sku' => '501004', 'title' => 'Blooming Fast Superior Soluble Fertiliser 1.25kg x 2', 'display_price' => 29.98, 'category' => 'feeds', 'on_air' => true, 'deal' => 'On air'],
        ['sku' => '510317', 'title' => "Harkness Climbing Rose 'New Dawn'", 'display_price' => 22.99, 'category' => 'roses', 'on_air' => true, 'deal' => 'Presenter pick'],
        ['sku' => '401842', 'title' => "Upright Zonal Geranium 'Parade' Mix", 'display_price' => 9.99, 'category' => 'bedding', 'on_air' => true, 'deal' => 'TV exclusive'],
        ['sku' => '402156', 'title' => "Eryngium 'Blue Hobbit'", 'display_price' => 14.97, 'category' => 'perennials', 'deal' => '2 for 1'],
        ['sku' => '403891', 'title' => "Imperata 'Red Baron' — Blood Grass", 'display_price' => 14.97, 'category' => 'grasses', 'on_air' => true],
        ['sku' => '404220', 'title' => "Pre-Planted 'Summer Sensation' Hanging Baskets", 'display_price' => 24.98, 'category' => 'bedding', 'deal' => 'Show deal'],
        ['sku' => '510317', 'title' => 'Sicilian Lemon Tree', 'display_price' => 24.99, 'category' => 'fruit', 'on_air' => true, 'deal' => 'Presenter pick'],
        ['sku' => 'PA255', 'title' => "Petunia 'Easy Wave' Ultimate Mix", 'display_price' => 6.99, 'category' => 'bedding'],
        ['sku' => '402156', 'title' => "Tree Hydrangea 'Incrediball'", 'display_price' => 24.99, 'category' => 'shrubs'],
        ['sku' => '401842', 'title' => "Pre-Planted Aster 'Alpha' in Pink Decopots", 'display_price' => 19.98, 'category' => 'bedding'],
        ['sku' => '401842', 'title' => "Pre-Planted White Aster 'Alpha' in Decopots", 'display_price' => 19.98, 'category' => 'bedding'],
        ['sku' => '510317', 'title' => "Buddleia 'Butterfly Candy Little Purple' Standard", 'display_price' => 44.99, 'category' => 'shrubs'],
        ['sku' => '510317', 'title' => "Buddleia 'Butterfly Candy Little Ruby' Standard", 'display_price' => 44.99, 'category' => 'shrubs'],
        ['sku' => '403891', 'title' => 'Tricolour Hibiscus', 'display_price' => 29.99, 'category' => 'shrubs'],
        ['sku' => '402156', 'title' => "Tree Fern 'Dicksonia Antarctica'", 'display_price' => 34.99, 'category' => 'trees'],
        ['sku' => '510317', 'title' => "Wisteria 'Amethyst Falls'", 'display_price' => 24.99, 'category' => 'climbers'],
        ['sku' => '510317', 'title' => "Citrus 'Lemon' Tree with Fruit", 'display_price' => 39.99, 'category' => 'fruit', 'deal' => 'TV exclusive'],
        ['sku' => '510317', 'title' => 'Citrus Lime Tree with Fruit', 'display_price' => 44.99, 'category' => 'fruit'],
        ['sku' => '401842', 'title' => 'Pair of Grape Vines', 'display_price' => 24.98, 'category' => 'fruit'],
        ['sku' => '401842', 'title' => "Honeyberry 'Altaj'", 'display_price' => 12.99, 'category' => 'fruit'],
        ['sku' => '510317', 'title' => 'Mini Patio Mango Tree', 'display_price' => 34.99, 'category' => 'fruit'],
        ['sku' => '401842', 'title' => "Everbearer Strawberry 'Sweet Summer'", 'display_price' => 19.94, 'category' => 'fruit'],
        ['sku' => '404220', 'title' => "Set of 3 'Tuscany' Roman Round Planters Aged Terracotta", 'display_price' => 23.97, 'category' => 'planters'],
        ['sku' => '403891', 'title' => 'Azalea Orange 3 x 9cm Pot', 'display_price' => 19.97, 'category' => 'shrubs'],
        ['sku' => '402156', 'title' => "Lobelia speciosa 'Queen Victoria'", 'display_price' => 14.97, 'category' => 'perennials'],
        ['sku' => '403891', 'title' => "Molinia caerulea 'Banshee'", 'display_price' => 19.97, 'category' => 'grasses'],
        ['sku' => '510317', 'title' => "Eucalyptus 'Compact Silver'", 'display_price' => 24.99, 'category' => 'trees'],
        ['sku' => '402156', 'title' => "Rudbeckia 'Sunbeckia Ophelia'", 'display_price' => 19.99, 'category' => 'perennials'],
        ['sku' => '402156', 'title' => "Salvia 'Amistad'", 'display_price' => 12.99, 'category' => 'perennials'],
        ['sku' => '402156', 'title' => "Agapanthus 'Poppin' Purple'", 'display_price' => 19.99, 'category' => 'perennials'],
        ['sku' => '402156', 'title' => 'Rudbeckia hirta Collection', 'display_price' => 19.97, 'category' => 'perennials'],
        ['sku' => '403891', 'title' => "Hibiscus 'Pink Chiffon'", 'display_price' => 19.99, 'category' => 'shrubs'],
        ['sku' => '404220', 'title' => 'Ceramic Look Planter Mottled Blue 39.5cm', 'display_price' => 19.99, 'category' => 'planters'],
        ['sku' => '404220', 'title' => 'Terracotta-Style Papilio Planter', 'display_price' => 19.99, 'category' => 'planters'],
        ['sku' => '404220', 'title' => 'Tower Planters with Trellis Frames', 'display_price' => 39.98, 'category' => 'planters'],
        ['sku' => '404220', 'title' => "Black and Gold 'Pinecone' Planter x 5", 'display_price' => 34.95, 'category' => 'planters'],
        ['sku' => '404220', 'title' => 'April Indigo Green Round Planters', 'display_price' => 25.98, 'category' => 'planters'],
        ['sku' => '501001', 'title' => 'Blooming Fast Superior Soluble Plant Food 800g', 'display_price' => 4.99, 'category' => 'feeds'],
        ['sku' => '501005', 'title' => 'Organic Seaweed Feed', 'display_price' => 6.49, 'category' => 'feeds'],
        ['sku' => 'PLP001', 'title' => "Hardy Gerbera 'Garvinea' Bright Collection", 'display_price' => 19.99, 'category' => 'perennials', 'deal' => 'Show exclusive'],
        ['sku' => 'PLP005', 'title' => 'Complete Hardy Garden Perennial Collection', 'display_price' => 29.99, 'category' => 'perennials'],
    ];

    /** @return array{heading: string, intro: string, perks: list<string>} */
    public static function pageCopy(): array
    {
        return [
            'heading' => 'Watch our Live Shows every Thursday from 2pm & Sunday from 11am',
            'intro' => 'Join our live and interactive shows every week from the Potting Shed at the YouGarden Nursery. We have special offers not available elsewhere and free gifts for live viewers. Hosted by friendly and familiar faces with all of the expert advice and guidance that you will need to make the most of your garden all year through.',
            'perks' => [
                'Show-only prices',
                'Free gifts for live viewers',
                'Expert advice from the Potting Shed',
            ],
        ];
    }

    public static function youtubeEmbedSrc(bool $isLive): string
    {
        if ($isLive) {
            return 'https://www.youtube.com/embed/live_stream?channel='.self::YOUTUBE_CHANNEL_ID.'&autoplay=1';
        }

        return 'https://www.youtube.com/embed/'.self::YOUTUBE_LATEST_VIDEO_ID.'?rel=0&modestbranding=1';
    }

    public static function youtubePosterUrl(): string
    {
        return 'https://img.youtube.com/vi/'.self::YOUTUBE_LATEST_VIDEO_ID.'/hqdefault.jpg';
    }

    /**
     * @return array{
     *     is_live: bool,
     *     status: string,
     *     label: string,
     *     slot_label: string,
     *     next_at: DateTimeImmutable,
     *     next_iso: string,
     *     show_day_label: string,
     *     countdown_seconds: int
     * }
     */
    public static function schedule(): array
    {
        $tz = new DateTimeZone('Europe/London');
        $now = new DateTimeImmutable('now', $tz);
        $current = self::currentOrNextShow($now, $tz);
        $start = $current['start'];
        $end = $current['end'];
        $isLive = $now >= $start && $now < $end;

        if ($isLive) {
            $label = 'Live now · '.$current['label'];
            $status = 'live';
            $countdownTarget = $end;
        } else {
            $label = 'Next show: '.$current['label'];
            $status = 'upcoming';
            $countdownTarget = $start;
        }

        return [
            'is_live' => $isLive,
            'status' => $status,
            'label' => $label,
            'slot_label' => $current['label'],
            'next_at' => $start,
            'next_iso' => $countdownTarget->format(DateTimeImmutable::ATOM),
            'show_day_label' => $start->format('l j F Y · g:ia'),
            'countdown_seconds' => max(0, $countdownTarget->getTimestamp() - $now->getTimestamp()),
        ];
    }

    /**
     * @return list<array{
     *     sku: string,
     *     line_id: string,
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
        $bySku = [];
        foreach (DemoCart::catalogue() as $product) {
            if (! empty($product['sku'])) {
                $bySku[$product['sku']] = $product;
            }
        }

        $categories = self::categoryLabels();
        $items = [];

        foreach (self::LINEUP as $index => $row) {
            $product = $bySku[$row['sku']] ?? null;
            if (! empty($product['is_club'])) {
                continue;
            }

            $image = $product['image']
                ?? match ($index % 5) {
                    0 => 'images/products/401842.jpg',
                    1 => 'images/products/402156.jpg',
                    2 => 'images/products/403891.jpg',
                    3 => 'images/products/404220.jpg',
                    default => 'images/products/510317.png',
                };

            $items[] = [
                'sku' => $product['sku'] ?? $row['sku'],
                'line_id' => ($product['sku'] ?? $row['sku']).'-'.$index,
                'name' => $row['title'],
                'variant' => $product['variant'] ?? '',
                'image' => $image,
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

        $filters = [['id' => 'all', 'label' => 'All']];
        foreach ($used as $id => $label) {
            $filters[] = ['id' => $id, 'label' => $label];
        }

        return $filters;
    }

    /** @return array<string, string> */
    public static function categoryLabels(): array
    {
        return [
            'compost' => 'Compost',
            'feeds' => 'Feeds',
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

    /**
     * @return array{start: DateTimeImmutable, end: DateTimeImmutable, label: string}
     */
    private static function currentOrNextShow(DateTimeImmutable $now, DateTimeZone $tz): array
    {
        $candidates = [];

        foreach (self::SHOW_SLOTS as $slot) {
            for ($week = 0; $week < 3; $week++) {
                $start = self::slotStart($now, $tz, $slot, $week);
                $end = $start->modify('+'.self::SHOW_DURATION_MINUTES.' minutes');
                if ($now < $end) {
                    $candidates[] = [
                        'start' => $start,
                        'end' => $end,
                        'label' => $slot['label'],
                    ];
                }
            }
        }

        usort($candidates, static fn (array $a, array $b): int => $a['start'] <=> $b['start']);

        return $candidates[0];
    }

    /**
     * @param  array{dow: int, hour: int, minute: int, label: string}  $slot
     */
    private static function slotStart(DateTimeImmutable $now, DateTimeZone $tz, array $slot, int $weekOffset): DateTimeImmutable
    {
        $cursor = $now->setTime($slot['hour'], $slot['minute'], 0);
        $dow = (int) $cursor->format('N');
        $daysAhead = ($slot['dow'] - $dow + 7) % 7;
        $daysAhead += $weekOffset * 7;

        return $cursor->modify('+'.$daysAhead.' days');
    }
}
