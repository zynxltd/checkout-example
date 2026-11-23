#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
for f in [0-9][0-9]-*.cs; do echo "===== $f"; dotnet run "$f"; echo; done
