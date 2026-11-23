# NuGet package demo — GreenShelf.Pricing

Laravel / Composer mental model: **you author a package**, publish it to a feed, then `require` it from an app.

| Composer | This demo |
|----------|-----------|
| `composer.json` library | `GreenShelf.Pricing.csproj` + package metadata |
| Packagist / private Satis | Local folder feed `./nupkg` (+ nuget.org) |
| `composer require vendor/pkg` | `PackageReference` + `dotnet restore` |
| `composer pack` | `dotnet pack` → `.nupkg` |

## Layout

```
demos/dotnet-nuget-demo/
  nuget.config                 # local feed + nuget.org
  nupkg/                       # packed .nupkg files land here
  src/GreenShelf.Pricing/      # class library (the package)
  src/GreenShelf.Pricing.Consumer/  # app that *only* uses PackageReference
  tests/GreenShelf.Pricing.Tests/
  scripts/pack-and-run.sh
```

## Quick start

```bash
cd demos/dotnet-nuget-demo
chmod +x scripts/pack-and-run.sh
./scripts/pack-and-run.sh
```

Or step by step:

```bash
# 1) Build + test the library (ProjectReference — like developing the package)
dotnet test GreenShelf.Pricing.sln

# 2) Pack → ./nupkg/GreenShelf.Pricing.1.0.0.nupkg
dotnet pack src/GreenShelf.Pricing/GreenShelf.Pricing.csproj -c Release -o nupkg

# 3) Consumer restores from local feed (nuget.config)
dotnet run --project src/GreenShelf.Pricing.Consumer
```

Expected consumer output includes **£75.62** margin and a club quote.

## What to notice

1. **Consumer has no ProjectReference** to the library — only:

```xml
<PackageReference Include="GreenShelf.Pricing" Version="1.0.0" />
```

2. **`nuget.config`** points `greenshelf-local` at `./nupkg` so restore finds your pack without nuget.org.

3. **Bump version** in the `.csproj` (`<Version>1.0.1</Version>`), re-pack, update the consumer’s `PackageReference`, restore — same habit as bumping a Composer constraint.

## Private feed (real world)

| Feed | Typical use |
|------|-------------|
| Local folder / network share | This demo |
| Azure Artifacts | Enterprise / Azure DevOps |
| GitHub Packages | Org packages |
| nuget.org | Public OSS |

```bash
# Example: push to a real feed (do not run unless you have a key)
# dotnet nuget push nupkg/GreenShelf.Pricing.1.0.0.nupkg --api-key $KEY --source https://api.nuget.org/v3/index.json
```

## Interview lines

- “NuGet is Composer for .NET; `dotnet pack` produces a `.nupkg`.”
- “Apps depend on `PackageReference`; libraries set `PackageId` / `Version`.”
- “CI packs once; many services consume the same version from a private feed.”

## Walkthrough ticks

See [docs/WALKTHROUGH.md](../../docs/WALKTHROUGH.md) → **Optional — NuGet**.
