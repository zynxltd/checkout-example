#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

swift build -c release
BIN="$(swift build -c release --show-bin-path)/GreenShelfDesk"
APP="$ROOT/dist/GreenShelfDesk.app"

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS"
cp "$BIN" "$APP/Contents/MacOS/GreenShelfDesk"
cp "$ROOT/Support/Info.plist" "$APP/Contents/Info.plist"
chmod +x "$APP/Contents/MacOS/GreenShelfDesk"

echo "Built $APP"
open "$APP"
