#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/snippets"
for f in [0-9][0-9][0-9]-*.go; do echo "===== $f"; go run "$f"; echo; done
