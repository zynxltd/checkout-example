#!/usr/bin/env bash
# Pack GreenShelf.Pricing into ./nupkg and restore the consumer.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p nupkg
rm -f nupkg/GreenShelf.Pricing.*.nupkg nupkg/GreenShelf.Pricing.*.snupkg 2>/dev/null || true

echo "==> pack"
dotnet pack src/GreenShelf.Pricing/GreenShelf.Pricing.csproj -c Release -o nupkg --nologo

echo "==> restore + test + run consumer"
dotnet test GreenShelf.Pricing.sln -c Release --nologo
dotnet restore src/GreenShelf.Pricing.Consumer/GreenShelf.Pricing.Consumer.csproj --force
dotnet run --project src/GreenShelf.Pricing.Consumer/GreenShelf.Pricing.Consumer.csproj -c Release --no-restore

echo "==> done — packages in $ROOT/nupkg"
ls -la nupkg
