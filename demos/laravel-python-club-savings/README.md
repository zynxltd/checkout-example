# Club savings calculator (Laravel-style PHP + Python)

**P0 pick** from Laravel + Python stack.

## Run UI

```bash
cd demos/laravel-python-club-savings
php -S 127.0.0.1:8081 -t public
```

Open http://127.0.0.1:8081

## Run lift report

```bash
python3 scripts/club_lift_report.py
```

Refresh the UI to see recovery lift (± Club messaging).

## Demo script

1. Add plants → see guest “save £X with Club”
2. Toggle member → member subtotal + savings strip
3. Add mower → 7.5% machinery rate
4. Run Python report → +pp lift vs guest cohort
