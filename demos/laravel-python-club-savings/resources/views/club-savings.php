<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Club savings calculator — P0 demo</title>
  <style>
    :root {
      --bg: #f3f0e8;
      --ink: #1c2a1a;
      --muted: #5c6b58;
      --accent: #2f6b3a;
      --card: #fffdf8;
      --line: #d5d0c4;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
      background:
        radial-gradient(ellipse at top left, #e7efdf 0%, transparent 50%),
        var(--bg);
      color: var(--ink);
      min-height: 100vh;
    }
    main { max-width: 720px; margin: 0 auto; padding: 2rem 1.25rem 3rem; }
    h1 { font-size: 1.75rem; margin: 0 0 0.35rem; letter-spacing: -0.02em; }
    .lede { color: var(--muted); margin: 0 0 1.5rem; }
    .stack { display: grid; gap: 1rem; }
    .card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 4px;
      padding: 1rem 1.1rem;
    }
    .row { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; }
    .muted { color: var(--muted); font-size: 0.95rem; }
    .saving { color: var(--accent); font-weight: 700; font-size: 1.35rem; }
    button, .btn {
      font: inherit;
      cursor: pointer;
      border: 1px solid var(--ink);
      background: var(--ink);
      color: #f7f4ec;
      padding: 0.45rem 0.85rem;
      border-radius: 3px;
    }
    button.secondary { background: transparent; color: var(--ink); }
    .products { display: grid; gap: 0.5rem; }
    .product {
      display: flex; justify-content: space-between; align-items: center;
      gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--line);
    }
    .product:last-child { border-bottom: 0; }
    table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
    th, td { text-align: left; padding: 0.4rem 0; border-bottom: 1px solid var(--line); }
    th { color: var(--muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .pill {
      display: inline-block; font-size: 0.75rem; padding: 0.15rem 0.45rem;
      border: 1px solid var(--line); border-radius: 999px; color: var(--muted);
    }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85rem; }
  </style>
</head>
<body>
<main>
  <p class="pill">Laravel-style PHP + Python · P0</p>
  <h1>Club savings calculator</h1>
  <p class="lede">Toggle member state to see live £ savings. Run the Python lift report for abandon recovery.</p>

  <div class="stack">
    <section class="card">
      <div class="row">
        <div>
          <strong><?= $_SESSION['is_member'] ? 'Club member' : 'Guest' ?></strong>
          <div class="muted">Plants 15% · Machinery 7.5% · Club £<?= number_format(ClubPricing::CLUB_ANNUAL, 2) ?>/yr</div>
        </div>
        <form method="post">
          <input type="hidden" name="action" value="toggle_member">
          <button type="submit"><?= $_SESSION['is_member'] ? 'View as guest' : 'View as member' ?></button>
        </form>
      </div>
    </section>

    <section class="card">
      <h2 style="margin:0 0 0.75rem;font-size:1.1rem;">Basket</h2>
      <?php if ($quote['lines'] === []): ?>
        <p class="muted">Basket empty — add a product below.</p>
      <?php else: ?>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Guest</th><th>Member</th><th>Save</th></tr>
          </thead>
          <tbody>
            <?php foreach ($quote['lines'] as $line) : ?>
              <tr>
                <td><?= htmlspecialchars($line['name']) ?><div class="muted"><?= htmlspecialchars($line['category']) ?></div></td>
                <td><?= (int) $line['qty'] ?></td>
                <td>£<?= number_format($line['line_total'], 2) ?></td>
                <td>£<?= number_format($line['member_line_total'], 2) ?></td>
                <td>£<?= number_format($line['saving'], 2) ?></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>

      <div class="row" style="margin-top:1rem;">
        <div>
          <?php if ($_SESSION['is_member']) : ?>
            <div class="muted">Member subtotal</div>
            <div class="saving">£<?= number_format($quote['member_subtotal'], 2) ?></div>
            <div class="muted">You’re saving £<?= number_format($quote['club_saving'], 2) ?> vs guest</div>
          <?php else : ?>
            <div class="muted">Guest subtotal</div>
            <div class="saving">£<?= number_format($quote['guest_subtotal'], 2) ?></div>
            <div class="muted">
              Join Club — save £<?= number_format($quote['club_saving'], 2) ?> on this basket
              <?= $quote['pays_for_itself'] ? '(pays for itself)' : '' ?>
            </div>
          <?php endif; ?>
        </div>
        <form method="post">
          <input type="hidden" name="action" value="clear">
          <button class="secondary" type="submit">Clear</button>
        </form>
      </div>
    </section>

    <section class="card">
      <h2 style="margin:0 0 0.75rem;font-size:1.1rem;">Add products</h2>
      <div class="products">
        <?php foreach ($catalog as $product) : ?>
          <div class="product">
            <div>
              <strong><?= htmlspecialchars($product['name']) ?></strong>
              <div class="muted">£<?= number_format($product['price'], 2) ?> · <?= htmlspecialchars($product['category']) ?></div>
            </div>
            <form method="post">
              <input type="hidden" name="action" value="add">
              <input type="hidden" name="sku" value="<?= htmlspecialchars($product['sku']) ?>">
              <button type="submit">Add</button>
            </form>
          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <section class="card">
      <h2 style="margin:0 0 0.5rem;font-size:1.1rem;">Python lift report</h2>
      <p class="muted">Run <code>python3 scripts/club_lift_report.py</code> then refresh.</p>
      <?php if ($lift) : ?>
        <p>
          Guest recovery <?= number_format($lift['cohorts']['guest']['recovery_rate'] * 100, 1) ?>%
          → Club-message <?= number_format($lift['cohorts']['club_msg']['recovery_rate'] * 100, 1) ?>%
          (<strong>+<?= htmlspecialchars((string) $lift['lift']['absolute_pp']) ?> pp</strong>)
        </p>
      <?php else : ?>
        <p class="muted">No report yet.</p>
      <?php endif; ?>
    </section>
  </div>
</main>
</body>
</html>
