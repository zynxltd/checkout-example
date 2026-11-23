# C# language lab (~100 terminal examples)

## Docs

| Doc | Purpose |
|-----|---------|
| **[SYNTAX-100.md](./SYNTAX-100.md)** | **100 copy-paste drills** — syntax + OOP, run one at a time |
| `snippets/*.cs` | Each drill as a runnable file |
| `Program.cs` | All-in-one dump (`dotnet run` from this folder) |

## Run one drill

```bash
cd demos/dotnet-csharp-lab/snippets
dotnet run 001-hello.cs
dotnet run 047-strategy.cs
dotnet run 100-solid-summary.cs
```

## Run all drills

```bash
cd demos/dotnet-csharp-lab/snippets
./run-all.sh
```

## Full dump (104 labeled sections)

```bash
cd demos/dotnet-csharp-lab
dotnet run
```

## Microsoft Learn — classes checklist

Runnable tasks for [C# classes](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/classes) (including [Create objects](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/classes#create-objects)):

```bash
cd demos/dotnet-csharp-lab/mslearn-classes
dotnet run 03-reference-share.cs
./run-all.sh
```

Or paste into [.NET Fiddle](https://dotnetfiddle.net/) — see [mslearn-classes/TASKS.md](./mslearn-classes/TASKS.md).
