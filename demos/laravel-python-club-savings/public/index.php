<?php

declare(strict_types=1);

require dirname(__DIR__) . '/app/ClubPricing.php';

$catalog = [
    ['sku' => 'PA255', 'name' => 'Strawberry Collection', 'category' => 'plants', 'price' => 14.99],
    ['sku' => 'ROSE01', 'name' => 'Rose Bush (Bare Root)', 'category' => 'plants', 'price' => 24.99],
    ['sku' => 'FEED01', 'name' => 'Bird Feeder Kit', 'category' => 'plants', 'price' => 9.99],
    ['sku' => 'MOWER1', 'name' => 'Compact Lawn Mower', 'category' => 'machinery', 'price' => 199.00],
];

session_start();

if (! isset($_SESSION['lines'])) {
    $_SESSION['lines'] = [
        ['sku' => 'PA255', 'name' => 'Strawberry Collection', 'category' => 'plants', 'price' => 14.99, 'qty' => 2],
        ['sku' => 'ROSE01', 'name' => 'Rose Bush (Bare Root)', 'category' => 'plants', 'price' => 24.99, 'qty' => 1],
    ];
}
if (! isset($_SESSION['is_member'])) {
    $_SESSION['is_member'] = false;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'toggle_member') {
        $_SESSION['is_member'] = ! $_SESSION['is_member'];
    }
    if ($action === 'add' && isset($_POST['sku'])) {
        $sku = (string) $_POST['sku'];
        foreach ($catalog as $product) {
            if ($product['sku'] !== $sku) {
                continue;
            }
            $found = false;
            foreach ($_SESSION['lines'] as &$line) {
                if ($line['sku'] === $sku) {
                    $line['qty']++;
                    $found = true;
                    break;
                }
            }
            unset($line);
            if (! $found) {
                $_SESSION['lines'][] = array_merge($product, ['qty' => 1]);
            }
        }
    }
    if ($action === 'clear') {
        $_SESSION['lines'] = [];
    }
    header('Location: /');
    exit;
}

$quote = ClubPricing::quote($_SESSION['lines'], (bool) $_SESSION['is_member']);
$liftPath = dirname(__DIR__) . '/data/lift_report.json';
$lift = is_file($liftPath) ? json_decode((string) file_get_contents($liftPath), true) : null;

require dirname(__DIR__) . '/resources/views/club-savings.php';
