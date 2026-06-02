#!/usr/bin/env bash
# Sync prototype to Laravel Herd site (yg-cart-drawer-demo.test)
set -e
SRC="$(cd "$(dirname "$0")" && pwd)"
HERD="/Users/tom/Herd/yg-cart-drawer-demo"
rsync -a --delete \
  --exclude vendor --exclude node_modules --exclude storage --exclude .env \
  --exclude database/database.sqlite \
  "$SRC/" "$HERD/"
echo "Synced to $HERD — refresh http://yg-cart-drawer-demo.test"
