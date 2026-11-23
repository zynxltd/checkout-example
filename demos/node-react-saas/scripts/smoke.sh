#!/usr/bin/env bash
# Smoke checks — local or post-deploy
set -euo pipefail

BASE="${1:-http://127.0.0.1:5210}"

echo "Smoke → $BASE"

code=$(curl -sf -o /tmp/plotline-health.json -w "%{http_code}" "$BASE/api/health")
test "$code" = "200"
grep -q '"status":"ok"' /tmp/plotline-health.json

curl -sf "$BASE/api/dashboard" | grep -q mrr
curl -sf "$BASE/api/clubs" | grep -q club_midlands

# business rule still holds
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/clubs/club_trial/pause")
test "$code" = "409"

echo "Smoke OK"
