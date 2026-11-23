# OOP SOLID Five Principles (console demos)

Extracted from `OOP-SOLID-Five-Principle-master.zip`, retargeted to **.NET 10**.

**Not a web server** — these are console + unit-test projects that demonstrate SOLID.

## Layout

| Folder | Principle |
|--------|-----------|
| `SingleResponsabilityPrinciple/` | SRP |
| `OpenClosePrinciple/` | OCP (pricing rules) |
| `TheLiskovSubstitutionPrinciple/` | LSP |
| `UnitTestProject1/` | MSTest coverage |

## Run demos

```bash
cd demos/dotnet-oop-solid-five-principles

dotnet run --project OpenClosePrinciple
dotnet run --project SingleResponsabilityPrinciple
dotnet run --project TheLiskovSubstitutionPrinciple
```

## Tests

```bash
dotnet test UnitTestProject1
```

13 pass; 1 fails on purpose (`TwentyFor4X5RectangleFromSquare` in the “wrong” LSP approach) to show why Square must not subtype Rectangle.