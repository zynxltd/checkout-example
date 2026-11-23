#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
fail=0
for f in *.cs; do
  echo "===== $f"
  if ! dotnet run "$f" --nologo; then
    echo "FAIL $f"
    fail=1
  fi
  echo
done
exit $fail
