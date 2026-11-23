<?php

declare(strict_types=1);

/**
 * Club savings pricing (Laravel-style service — no full framework required for the demo).
 */
final class ClubPricing
{
    public const CLUB_ANNUAL = 10.00;

    public const PLANT_MEMBER_RATE = 0.15;

    public const MACHINERY_MEMBER_RATE = 0.075;

    /**
     * @param list<array{sku: string, name: string, category: string, price: float, qty: int}> $lines
     * @return array{
     *   guest_subtotal: float,
     *   member_subtotal: float,
     *   club_saving: float,
     *   pays_for_itself: bool,
     *   lines: list<array{sku: string, name: string, category: string, price: float, qty: int, line_total: float, member_line_total: float, saving: float}>
     * }
     */
    public static function quote(array $lines, bool $isMember): array
    {
        $guest = 0.0;
        $member = 0.0;
        $out = [];

        foreach ($lines as $line) {
            $rate = $line['category'] === 'machinery'
                ? self::MACHINERY_MEMBER_RATE
                : self::PLANT_MEMBER_RATE;
            $lineTotal = round($line['price'] * $line['qty'], 2);
            $memberLine = round($lineTotal * (1 - $rate), 2);
            $saving = round($lineTotal - $memberLine, 2);
            $guest += $lineTotal;
            $member += $memberLine;
            $out[] = array_merge($line, [
                'line_total' => $lineTotal,
                'member_line_total' => $memberLine,
                'saving' => $saving,
            ]);
        }

        $guest = round($guest, 2);
        $member = round($member, 2);
        $clubSaving = round($guest - $member, 2);

        return [
            'guest_subtotal' => $guest,
            'member_subtotal' => $member,
            'club_saving' => $clubSaving,
            'pays_for_itself' => $clubSaving >= self::CLUB_ANNUAL,
            'is_member' => $isMember,
            'lines' => $out,
        ];
    }
}
