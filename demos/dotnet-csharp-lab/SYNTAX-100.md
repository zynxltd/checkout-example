# C# syntax — 100 copy-paste terminal drills

Get used to **C# syntax and OOP** by running one small program at a time.

Requires **.NET 10** (`dotnet run file.cs`).

## Quick start

```bash
cd demos/dotnet-csharp-lab/snippets
dotnet run 001-hello.cs
dotnet run 037-inheritance.cs
dotnet run 047-strategy.cs
```

Copy-paste any snippet to a temp file:

```bash
cat > /tmp/ex.cs <<'EOF'
// paste the csharp block (without the bash wrapper)
EOF
dotnet run /tmp/ex.cs
```

Run all 100:

```bash
cd demos/dotnet-csharp-lab/snippets
./run-all.sh
```

## Index

| # | File | Topic |
|---|------|-------|
| 001 | `001-hello.cs` | **basics** — Hello World |
| 002 | `002-int.cs` | **basics** — int literal |
| 003 | `003-decimal.cs` | **basics** — decimal money (m) |
| 004 | `004-bool.cs` | **basics** — bool logic |
| 005 | `005-string-interp.cs` | **basics** — string interpolation |
| 006 | `006-raw-string.cs` | **basics** — raw string """ |
| 007 | `007-null-coalesce.cs` | **basics** — ?? null-coalescing |
| 008 | `008-null-conditional.cs` | **basics** — ?. null-conditional |
| 009 | `009-is-pattern.cs` | **basics** — is pattern |
| 010 | `010-range.cs` | **basics** — range / index |
| 011 | `011-no-params.cs` | **functions** — method no params |
| 012 | `012-one-param.cs` | **functions** — one parameter |
| 013 | `013-two-params.cs` | **functions** — two parameters |
| 014 | `014-optional.cs` | **functions** — optional parameter |
| 015 | `015-named-args.cs` | **functions** — named arguments |
| 016 | `016-params.cs` | **functions** — params array |
| 017 | `017-tuple-return.cs` | **functions** — return tuple |
| 018 | `018-discard.cs` | **functions** — discard _ |
| 019 | `019-void.cs` | **functions** — void side-effect |
| 020 | `020-expression-body.cs` | **functions** — expression-bodied => |
| 021 | `021-by-value.cs` | **parameters** — pass by value (copy) |
| 022 | `022-ref.cs` | **parameters** — ref mutate caller |
| 023 | `023-out.cs` | **parameters** — out assigns result |
| 024 | `024-in.cs` | **parameters** — in read-only param |
| 025 | `025-ref-type-shared.cs` | **parameters** — class ref shared mutation |
| 026 | `026-reassign-param.cs` | **parameters** — reassign param does not replace caller |
| 027 | `027-ref-reference.cs` | **parameters** — ref can replace caller reference |
| 028 | `028-local-func.cs` | **functions** — local function |
| 029 | `029-func-lambda.cs` | **functions** — Func<> lambda |
| 030 | `030-action.cs` | **functions** — Action<> void lambda |
| 031 | `031-class-new.cs` | **oop** — class + new |
| 032 | `032-property.cs` | **oop** — get/set property |
| 033 | `033-init.cs` | **oop** — object initializer |
| 034 | `034-primary-ctor.cs` | **oop** — primary constructor |
| 035 | `035-static-method.cs` | **oop** — static method |
| 036 | `036-static-class.cs` | **oop** — static helper class |
| 037 | `037-inheritance.cs` | **oop** — inheritance + override |
| 038 | `038-abstract.cs` | **oop** — abstract Area() |
| 039 | `039-interface.cs` | **oop** — interface polymorphism |
| 040 | `040-sealed.cs` | **oop** — sealed class |
| 041 | `041-private-field.cs` | **oop** — encapsulation private field |
| 042 | `042-readonly.cs` | **oop** — readonly field |
| 043 | `043-virtual.cs` | **oop** — virtual / override |
| 044 | `044-base-call.cs` | **oop** — base.Method() |
| 045 | `045-composition.cs` | **oop** — composition over inheritance |
| 046 | `046-dependency-iface.cs` | **oop** — depend on interface (DIP) |
| 047 | `047-strategy.cs` | **oop** — strategy pattern |
| 048 | `048-repository.cs` | **oop** — repository pattern |
| 049 | `049-result-object.cs` | **oop** — result object (no throw) |
| 050 | `050-extension.cs` | **oop** — extension method |
| 051 | `051-record-eq.cs` | **oop** — record equality |
| 052 | `052-record-with.cs` | **oop** — record with copy |
| 053 | `053-struct.cs` | **oop** — readonly struct |
| 054 | `054-enum.cs` | **oop** — enum |
| 055 | `055-switch-enum.cs` | **oop** — switch expression |
| 056 | `056-flags.cs` | **oop** — flags enum |
| 057 | `057-deconstruct.cs` | **oop** — Deconstruct |
| 058 | `058-generic-method.cs` | **generics** — generic method |
| 059 | `059-generic-class.cs` | **generics** — generic class Box<T> |
| 060 | `060-nullable-value.cs` | **basics** — int? nullable value |
| 061 | `061-list.cs` | **collections** — List<T> |
| 062 | `062-dict.cs` | **collections** — Dictionary |
| 063 | `063-array-spread.cs` | **collections** — collection expression + spread |
| 064 | `064-linq-where.cs` | **linq** — LINQ Where/Select |
| 065 | `065-linq-any-all.cs` | **linq** — Any / All |
| 066 | `066-groupby.cs` | **linq** — GroupBy |
| 067 | `067-orderby.cs` | **linq** — OrderByDescending Take |
| 068 | `068-hashset.cs` | **collections** — HashSet unique |
| 069 | `069-stack.cs` | **collections** — Stack LIFO |
| 070 | `070-queue.cs` | **collections** — Queue FIFO |
| 071 | `071-try-catch.cs` | **errors** — try/catch |
| 072 | `072-throw-if-null.cs` | **errors** — ThrowIfNull |
| 073 | `073-using.cs` | **errors** — using IDisposable |
| 074 | `074-nameof.cs` | **basics** — nameof |
| 075 | `075-typeof.cs` | **basics** — typeof / GetType |
| 076 | `076-task-result.cs` | **async** — Task.FromResult |
| 077 | `077-async-await.cs` | **async** — async Task |
| 078 | `078-when-all.cs` | **async** — Task.WhenAll parallel |
| 079 | `079-lock.cs` | **async** — lock thread-safe |
| 080 | `080-concurrent-dict.cs` | **async** — ConcurrentDictionary |
| 081 | `081-switch-type.cs` | **patterns** — switch on type |
| 082 | `082-list-pattern.cs` | **patterns** — list pattern |
| 083 | `083-property-pattern.cs` | **patterns** — property pattern |
| 084 | `084-parse.cs` | **basics** — Parse / Convert |
| 085 | `085-timespan.cs` | **basics** — DateTimeOffset / TimeSpan |
| 086 | `086-stringbuilder.cs` | **basics** — StringBuilder |
| 087 | `087-guid.cs` | **basics** — Guid |
| 088 | `088-random.cs` | **basics** — Random |
| 089 | `089-math.cs` | **basics** — Math.Clamp / Round |
| 090 | `090-culture-money.cs` | **basics** — invariant money |
| 091 | `091-auction-service.cs` | **oop** — thin service orchestration |
| 092 | `092-policy-validate.cs` | **oop** — bid policy SRP |
| 093 | `093-options-config.cs` | **oop** — options like config() |
| 094 | `094-seed-record.cs` | **oop** — LotSeed catalogue |
| 095 | `095-status-machine.cs` | **oop** — status enum machine |
| 096 | `096-immutability.cs` | **oop** — immutable update with |
| 097 | `097-lsp.cs` | **oop** — Liskov — any IPriced works |
| 098 | `098-isp.cs` | **oop** — small interfaces ISP |
| 099 | `099-ocp.cs` | **oop** — open/closed new strategy |
| 100 | `100-solid-summary.cs` | **oop** — SOLID one-liner board |

## Topic map

| Topic | What you practice |
|-------|-------------------|
| basics | literals, null, strings, typeof |
| functions | params, optional, named, tuples, lambdas |
| parameters | `ref` / `out` / `in`, value vs reference |
| oop | class, inheritance, interface, SOLID-shaped demos |
| generics | `Box<T>`, generic methods |
| collections / linq | List, Dict, Where, GroupBy |
| errors | try/catch, using |
| async | Task, WhenAll, lock, ConcurrentDictionary |
| patterns | switch, list/property patterns |

---

## Snippets

### 001 — Hello World

**Topic:** `basics`

```bash
dotnet run 001-hello.cs
```

```csharp
Console.WriteLine("hello greenshelf");
```

### 002 — int literal

**Topic:** `basics`

```bash
dotnet run 002-int.cs
```

```csharp
Console.WriteLine(42);
```

### 003 — decimal money (m)

**Topic:** `basics`

```bash
dotnet run 003-decimal.cs
```

```csharp
Console.WriteLine(24.99m);
```

### 004 — bool logic

**Topic:** `basics`

```bash
dotnet run 004-bool.cs
```

```csharp
Console.WriteLine(true && !false);
```

### 005 — string interpolation

**Topic:** `basics`

```bash
dotnet run 005-string-interp.cs
```

```csharp
var plant = "Rose";
Console.WriteLine($"Plant: {plant}");
```

### 006 — raw string """

**Topic:** `basics`

```bash
dotnet run 006-raw-string.cs
```

```csharp
Console.WriteLine("""{"sku":"ROSE01"}""");
```

### 007 — ?? null-coalescing

**Topic:** `basics`

```bash
dotnet run 007-null-coalesce.cs
```

```csharp
string? x = null;
Console.WriteLine(x ?? "default");
```

### 008 — ?. null-conditional

**Topic:** `basics`

```bash
dotnet run 008-null-conditional.cs
```

```csharp
string? n = null;
Console.WriteLine(n?.Length.ToString() ?? "was null");
```

### 009 — is pattern

**Topic:** `basics`

```bash
dotnet run 009-is-pattern.cs
```

```csharp
object box = 7;
Console.WriteLine(box is int i ? $"int {i}" : "other");
```

### 010 — range / index

**Topic:** `basics`

```bash
dotnet run 010-range.cs
```

```csharp
var s = "LOT-ROSE";
Console.WriteLine(s[4..]);
Console.WriteLine(s[^4..]);
```

### 011 — method no params

**Topic:** `functions`

```bash
dotnet run 011-no-params.cs
```

```csharp
string Hello() => "hello";
Console.WriteLine(Hello());
```

### 012 — one parameter

**Topic:** `functions`

```bash
dotnet run 012-one-param.cs
```

```csharp
int Double(int x) => x * 2;
Console.WriteLine(Double(21));
```

### 013 — two parameters

**Topic:** `functions`

```bash
dotnet run 013-two-params.cs
```

```csharp
decimal LineTotal(int qty, decimal price) => qty * price;
Console.WriteLine(LineTotal(2, 12.50m));
```

### 014 — optional parameter

**Topic:** `functions`

```bash
dotnet run 014-optional.cs
```

```csharp
string Greet(string who = "gardener") => $"Hi {who}";
Console.WriteLine(Greet());
Console.WriteLine(Greet("Sam"));
```

### 015 — named arguments

**Topic:** `functions`

```bash
dotnet run 015-named-args.cs
```

```csharp
decimal Line(int qty, decimal price) => qty * price;
Console.WriteLine(Line(price: 9.99m, qty: 3));
```

### 016 — params array

**Topic:** `functions`

```bash
dotnet run 016-params.cs
```

```csharp
int Sum(params int[] xs) => xs.Sum();
Console.WriteLine(Sum(1, 2, 3, 4));
```

### 017 — return tuple

**Topic:** `functions`

```bash
dotnet run 017-tuple-return.cs
```

```csharp
(string sku, int stock) Peek() => ("HERB12", 40);
var (sku, stock) = Peek();
Console.WriteLine($"{sku}={stock}");
```

### 018 — discard _

**Topic:** `functions`

```bash
dotnet run 018-discard.cs
```

```csharp
(string, int) Peek() => ("X", 9);
var (_, stock) = Peek();
Console.WriteLine(stock);
```

### 019 — void side-effect

**Topic:** `functions`

```bash
dotnet run 019-void.cs
```

```csharp
void Log(string m) => Console.WriteLine($"[log] {m}");
Log("bid placed");
```

### 020 — expression-bodied =>

**Topic:** `functions`

```bash
dotnet run 020-expression-body.cs
```

```csharp
bool IsOdd(int x) => x % 2 != 0;
Console.WriteLine(IsOdd(5));
```

### 021 — pass by value (copy)

**Topic:** `parameters`

```bash
dotnet run 021-by-value.cs
```

```csharp
void Bump(int x) => x++;
var a = 1; Bump(a);
Console.WriteLine(a); // still 1
```

### 022 — ref mutate caller

**Topic:** `parameters`

```bash
dotnet run 022-ref.cs
```

```csharp
void Bump(ref int x) => x++;
var a = 1; Bump(ref a);
Console.WriteLine(a); // 2
```

### 023 — out assigns result

**Topic:** `parameters`

```bash
dotnet run 023-out.cs
```

```csharp
bool TrySku(string s, out string code) {
  if (s.StartsWith("LOT-")) { code = s; return true; }
  code = ""; return false;
}
Console.WriteLine(TrySku("LOT-ROSE", out var c) ? c : "fail");
```

### 024 — in read-only param

**Topic:** `parameters`

```bash
dotnet run 024-in.cs
```

```csharp
decimal Tax(in decimal net) => net * 0.2m;
var net = 100m;
Console.WriteLine(Tax(in net));
```

### 025 — class ref shared mutation

**Topic:** `parameters`

```bash
dotnet run 025-ref-type-shared.cs
```

```csharp
void Rename(Tag t) => t.Label = "renamed";
var t = new Tag(); Rename(t);
Console.WriteLine(t.Label);

class Tag { public string Label = "rose"; }
```

### 026 — reassign param does not replace caller

**Topic:** `parameters`

```bash
dotnet run 026-reassign-param.cs
```

```csharp
void Replace(Tag t) => t = new Tag("other");
var t = new Tag("keep"); Replace(t);
Console.WriteLine(t.Label);

class Tag(string l) { public string Label = l; }
```

### 027 — ref can replace caller reference

**Topic:** `parameters`

```bash
dotnet run 027-ref-reference.cs
```

```csharp
void Replace(ref Tag t) => t = new Tag("replaced");
var t = new Tag("old"); Replace(ref t);
Console.WriteLine(t.Label);

class Tag(string l) { public string Label = l; }
```

### 028 — local function

**Topic:** `functions`

```bash
dotnet run 028-local-func.cs
```

```csharp
int Factorial(int x) {
  int Rec(int n) => n <= 1 ? 1 : n * Rec(n - 1);
  return Rec(x);
}
Console.WriteLine(Factorial(5));
```

### 029 — Func<> lambda

**Topic:** `functions`

```bash
dotnet run 029-func-lambda.cs
```

```csharp
Func<int,int> square = x => x * x;
Console.WriteLine(square(9));
```

### 030 — Action<> void lambda

**Topic:** `functions`

```bash
dotnet run 030-action.cs
```

```csharp
Action<string> shout = s => Console.WriteLine(s.ToUpper());
shout("bid");
```

### 031 — class + new

**Topic:** `oop`

```bash
dotnet run 031-class-new.cs
```

```csharp
var lot = new Lot("LOT-1", 18m);
Console.WriteLine($"{lot.Id} £{lot.Reserve}");

class Lot {
  public string Id { get; }
  public decimal Reserve { get; }
  public Lot(string id, decimal reserve) { Id = id; Reserve = reserve; }
}
```

### 032 — get/set property

**Topic:** `oop`

```bash
dotnet run 032-property.cs
```

```csharp
var lot = new Lot { HighBid = 20m };
Console.WriteLine(lot.HighBid);

class Lot { public decimal HighBid { get; set; } }
```

### 033 — object initializer

**Topic:** `oop`

```bash
dotnet run 033-init.cs
```

```csharp
var p = new Product { Sku = "ROSE01", Price = 24.99m };
Console.WriteLine($"{p.Sku} £{p.Price}");

class Product { public string Sku { get; set; } = ""; public decimal Price { get; set; } }
```

### 034 — primary constructor

**Topic:** `oop`

```bash
dotnet run 034-primary-ctor.cs
```

```csharp
var b = new Bid("Sam", 22m);
Console.WriteLine($"{b.Bidder} £{b.Amount}");

class Bid(string bidder, decimal amount) {
  public string Bidder => bidder;
  public decimal Amount => amount;
}
```

### 035 — static method

**Topic:** `oop`

```bash
dotnet run 035-static-method.cs
```

```csharp
Console.WriteLine(MathX.Clamp(150, 0, 100));

static class MathX {
  public static int Clamp(int v, int min, int max) => v < min ? min : v > max ? max : v;
}
```

### 036 — static helper class

**Topic:** `oop`

```bash
dotnet run 036-static-class.cs
```

```csharp
Console.WriteLine(Money.Format(19.5m));

static class Money {
  public static string Format(decimal v) => $"£{v:0.00}";
}
```

### 037 — inheritance + override

**Topic:** `oop`

```bash
dotnet run 037-inheritance.cs
```

```csharp
Animal a = new Dog();
Console.WriteLine(a.Speak());

abstract class Animal { public abstract string Speak(); }

class Dog : Animal { public override string Speak() => "woof"; }
```

### 038 — abstract Area()

**Topic:** `oop`

```bash
dotnet run 038-abstract.cs
```

```csharp
Console.WriteLine($"area≈{new Circle(2).Area():0.00}");

abstract class Shape { public abstract double Area(); }

class Circle(double r) : Shape { public override double Area() => Math.PI * r * r; }
```

### 039 — interface polymorphism

**Topic:** `oop`

```bash
dotnet run 039-interface.cs
```

```csharp
IPriced p = new Product { Price = 5m };
Console.WriteLine(p.Price);

interface IPriced { decimal Price { get; } }

class Product : IPriced { public decimal Price { get; set; } }
```

### 040 — sealed class

**Topic:** `oop`

```bash
dotnet run 040-sealed.cs
```

```csharp
Console.WriteLine(new Tool("secateurs").Name);

sealed class Tool(string name) { public string Name => name; }
```

### 041 — encapsulation private field

**Topic:** `oop`

```bash
dotnet run 041-private-field.cs
```

```csharp
var b = new Bank(); b.Deposit(10); b.Deposit(2.5m);
Console.WriteLine(b.Balance);

class Bank {
  private decimal _bal;
  public void Deposit(decimal n) => _bal += n;
  public decimal Balance => _bal;
}
```

### 042 — readonly field

**Topic:** `oop`

```bash
dotnet run 042-readonly.cs
```

```csharp
Console.WriteLine(new Lot("LOT-X").Id);

class Lot {
  public readonly string Id;
  public Lot(string id) => Id = id;
}
```

### 043 — virtual / override

**Topic:** `oop`

```bash
dotnet run 043-virtual.cs
```

```csharp
Base x = new Child();
Console.WriteLine(x.Kind());

class Base { public virtual string Kind() => "base"; }

class Child : Base { public override string Kind() => "child"; }
```

### 044 — base.Method()

**Topic:** `oop`

```bash
dotnet run 044-base-call.cs
```

```csharp
Console.WriteLine(new Child().Tag());

class Base { public virtual string Tag() => "B"; }

class Child : Base { public override string Tag() => base.Tag() + "+C"; }
```

### 045 — composition over inheritance

**Topic:** `oop`

```bash
dotnet run 045-composition.cs
```

```csharp
Console.WriteLine(new Mower(new Engine()).Go());

class Engine { public string Start() => "vroom"; }

class Mower(Engine engine) { public string Go() => engine.Start(); }
```

### 046 — depend on interface (DIP)

**Topic:** `oop`

```bash
dotnet run 046-dependency-iface.cs
```

```csharp
string Stamp(IClock c) => c.Now.ToString("HH:mm");
Console.WriteLine(Stamp(new FixedClock(new DateTimeOffset(2026,1,1,15,30,0,TimeSpan.Zero))));

interface IClock { DateTimeOffset Now { get; } }

class FixedClock(DateTimeOffset at) : IClock { public DateTimeOffset Now => at; }
```

### 047 — strategy pattern

**Topic:** `oop`

```bash
dotnet run 047-strategy.cs
```

```csharp
IBidPolicy p = new Vip();
Console.WriteLine(p.Check(18m, 18m) ?? "ok");

interface IBidPolicy { string? Check(decimal amt, decimal reserve); }

class Strict : IBidPolicy { public string? Check(decimal a, decimal r) => a < r + 1 ? "too low" : null; }

class Vip : IBidPolicy { public string? Check(decimal a, decimal r) => a < r ? "below" : null; }
```

### 048 — repository pattern

**Topic:** `oop`

```bash
dotnet run 048-repository.cs
```

```csharp
var repo = new MemoryRepo(); repo.Add("LOT-1");
Console.WriteLine(repo.Find("LOT-1"));

interface IRepo { void Add(string id); string? Find(string id); }

class MemoryRepo : IRepo {
  readonly List<string> _xs = [];
  public void Add(string id) => _xs.Add(id);
  public string? Find(string id) => _xs.FirstOrDefault(x => x == id);
}
```

### 049 — result object (no throw)

**Topic:** `oop`

```bash
dotnet run 049-result-object.cs
```

```csharp
Result Place(decimal a) => a < 18m ? Result.Fail("below reserve") : Result.Success();
Console.WriteLine(Place(20m));
Console.WriteLine(Place(10m));

record Result(bool Ok, string? Error) {
  public static Result Fail(string e) => new(false, e);
  public static Result Success() => new(true, null);
}
```

### 050 — extension method

**Topic:** `oop`

```bash
dotnet run 050-extension.cs
```

```csharp
Console.WriteLine("rose".Title());

static class Ex {
  public static string Title(this string s) => char.ToUpper(s[0]) + s[1..].ToLower();
}
```

### 051 — record equality

**Topic:** `oop`

```bash
dotnet run 051-record-eq.cs
```

```csharp
Console.WriteLine(new LotSeed("A", 10m) == new LotSeed("A", 10m));

record LotSeed(string Id, decimal Reserve);
```

### 052 — record with copy

**Topic:** `oop`

```bash
dotnet run 052-record-with.cs
```

```csharp
var a = new LotSeed("A", 10m);
var b = a with { Reserve = 12m };
Console.WriteLine($"{b.Reserve} (orig {a.Reserve})");

record LotSeed(string Id, decimal Reserve);
```

### 053 — readonly struct

**Topic:** `oop`

```bash
dotnet run 053-struct.cs
```

```csharp
Console.WriteLine($"{new Point(3,4).Len():0.00}");

readonly struct Point(double x, double y) {
  public double Len() => Math.Sqrt(x*x + y*y);
}
```

### 054 — enum

**Topic:** `oop`

```bash
dotnet run 054-enum.cs
```

```csharp
Console.WriteLine(LotStatus.ClosingSoon);
Console.WriteLine((int)LotStatus.Sold);

enum LotStatus { Open, ClosingSoon, Sold, Unsold }
```

### 055 — switch expression

**Topic:** `oop`

```bash
dotnet run 055-switch-enum.cs
```

```csharp
string Lab(S s) => s switch { S.Open => "open", S.Sold => "gone", _ => "?" };
Console.WriteLine(Lab(S.Sold));

enum S { Open, Sold }
```

### 056 — flags enum

**Topic:** `oop`

```bash
dotnet run 056-flags.cs
```

```csharp
var p = Perm.Read | Perm.Write;
Console.WriteLine(p.HasFlag(Perm.Write));

[Flags] enum Perm { None=0, Read=1, Write=2 }
```

### 057 — Deconstruct

**Topic:** `oop`

```bash
dotnet run 057-deconstruct.cs
```

```csharp
var (id, reserve) = new Lot("L1", 18m);
Console.WriteLine($"{id}/{reserve}");

class Lot(string id, decimal r) {
  public void Deconstruct(out string i, out decimal x) { i = id; x = r; }
}
```

### 058 — generic method

**Topic:** `generics`

```bash
dotnet run 058-generic-method.cs
```

```csharp
T MaxOf<T>(T a, T b) where T : IComparable<T> => a.CompareTo(b) >= 0 ? a : b;
Console.WriteLine(MaxOf(3, 9));
Console.WriteLine(MaxOf("sam", "lee"));
```

### 059 — generic class Box<T>

**Topic:** `generics`

```bash
dotnet run 059-generic-class.cs
```

```csharp
Console.WriteLine(new Box<int>(42).Value);

class Box<T>(T value) { public T Value => value; }
```

### 060 — int? nullable value

**Topic:** `basics`

```bash
dotnet run 060-nullable-value.cs
```

```csharp
int? x = null;
Console.WriteLine(x?.ToString() ?? "null");
```

### 061 — List<T>

**Topic:** `collections`

```bash
dotnet run 061-list.cs
```

```csharp
var ids = new List<string> { "LOT-1", "LOT-2" };
ids.Add("LOT-3");
Console.WriteLine(string.Join(",", ids));
```

### 062 — Dictionary

**Topic:** `collections`

```bash
dotnet run 062-dict.cs
```

```csharp
var stock = new Dictionary<string,int> { ["ROSE01"] = 10 };
stock["ROSE01"]++;
Console.WriteLine(stock["ROSE01"]);
```

### 063 — collection expression + spread

**Topic:** `collections`

```bash
dotnet run 063-array-spread.cs
```

```csharp
int[] xs = [1,2,3];
int[] ys = [..xs, 4, 5];
Console.WriteLine(string.Join(",", ys));
```

### 064 — LINQ Where/Select

**Topic:** `linq`

```bash
dotnet run 064-linq-where.cs
```

```csharp
Console.WriteLine(string.Join(",", new[]{1,2,3,4}.Where(x=>x%2==0).Select(x=>x*10)));
```

### 065 — Any / All

**Topic:** `linq`

```bash
dotnet run 065-linq-any-all.cs
```

```csharp
int[] xs = [1,2,3];
Console.WriteLine($"any>2={xs.Any(v=>v>2)} all>0={xs.All(v=>v>0)}");
```

### 066 — GroupBy

**Topic:** `linq`

```bash
dotnet run 066-groupby.cs
```

```csharp
var lines = new[]{ ("plants",1), ("plants",2), ("tools",1) };
Console.WriteLine(string.Join(" | ", lines.GroupBy(l=>l.Item1).Select(g=>$"{g.Key}:{g.Sum(x=>x.Item2)}")));
```

### 067 — OrderByDescending Take

**Topic:** `linq`

```bash
dotnet run 067-orderby.cs
```

```csharp
Console.WriteLine(string.Join(",", new[]{5,1,9,3}.OrderByDescending(v=>v).Take(2)));
```

### 068 — HashSet unique

**Topic:** `collections`

```bash
dotnet run 068-hashset.cs
```

```csharp
var set = new HashSet<string>{ "a","a","b" };
Console.WriteLine(set.Count);
```

### 069 — Stack LIFO

**Topic:** `collections`

```bash
dotnet run 069-stack.cs
```

```csharp
var s = new Stack<int>(); s.Push(1); s.Push(2);
Console.WriteLine(s.Pop());
```

### 070 — Queue FIFO

**Topic:** `collections`

```bash
dotnet run 070-queue.cs
```

```csharp
var q = new Queue<string>(); q.Enqueue("a"); q.Enqueue("b");
Console.WriteLine(q.Dequeue());
```

### 071 — try/catch

**Topic:** `errors`

```bash
dotnet run 071-try-catch.cs
```

```csharp
try { throw new InvalidOperationException("below reserve"); }
catch (InvalidOperationException ex) { Console.WriteLine($"caught: {ex.Message}"); }
```

### 072 — ThrowIfNull

**Topic:** `errors`

```bash
dotnet run 072-throw-if-null.cs
```

```csharp
try { ArgumentNullException.ThrowIfNull((string?)null); }
catch (ArgumentNullException) { Console.WriteLine("ThrowIfNull worked"); }
```

### 073 — using IDisposable

**Topic:** `errors`

```bash
dotnet run 073-using.cs
```

```csharp
using (var m = new Meter()) Console.WriteLine(m.Read());

class Meter : IDisposable {
  public string Read() => "12mm";
  public void Dispose() => Console.WriteLine("disposed");
}
```

### 074 — nameof

**Topic:** `basics`

```bash
dotnet run 074-nameof.cs
```

```csharp
Console.WriteLine(nameof(Lot.HighBid));

class Lot { public decimal HighBid { get; set; } }
```

### 075 — typeof / GetType

**Topic:** `basics`

```bash
dotnet run 075-typeof.cs
```

```csharp
Console.WriteLine(typeof(Lot).Name);
Console.WriteLine(new Lot().GetType().Name);

class Lot {}
```

### 076 — Task.FromResult

**Topic:** `async`

```bash
dotnet run 076-task-result.cs
```

```csharp
Console.WriteLine(Task.FromResult(99).Result);
```

### 077 — async Task

**Topic:** `async`

```bash
dotnet run 077-async-await.cs
```

```csharp
async Task<int> Add(int a, int b) { await Task.Delay(20); return a + b; }
Console.WriteLine(Add(2,3).GetAwaiter().GetResult());
```

### 078 — Task.WhenAll parallel

**Topic:** `async`

```bash
dotnet run 078-when-all.cs
```

```csharp
var sw = System.Diagnostics.Stopwatch.StartNew();
Task.WhenAll(Task.Delay(40), Task.Delay(40)).GetAwaiter().GetResult();
Console.WriteLine($"~{sw.ElapsedMilliseconds}ms");
```

### 079 — lock thread-safe

**Topic:** `async`

```bash
dotnet run 079-lock.cs
```

```csharp
var n = 0; var gate = new object();
Parallel.For(0, 1000, _ => { lock(gate) n++; });
Console.WriteLine(n);
```

### 080 — ConcurrentDictionary

**Topic:** `async`

```bash
dotnet run 080-concurrent-dict.cs
```

```csharp
var bag = new System.Collections.Concurrent.ConcurrentDictionary<string,int>();
bag.AddOrUpdate("bids", 1, (_,v)=>v+1);
bag.AddOrUpdate("bids", 1, (_,v)=>v+1);
Console.WriteLine(bag["bids"]);
```

### 081 — switch on type

**Topic:** `patterns`

```bash
dotnet run 081-switch-type.cs
```

```csharp
object p = new Bid("Sam", 30m);
Console.WriteLine(p switch { Bid b => $"bid {b.Amount}", _ => "?" });

record Bid(string Who, decimal Amount);
```

### 082 — list pattern

**Topic:** `patterns`

```bash
dotnet run 082-list-pattern.cs
```

```csharp
int[] xs = [1,2,3];
Console.WriteLine(xs is [1,2,3] ? "match" : "no");
```

### 083 — property pattern

**Topic:** `patterns`

```bash
dotnet run 083-property-pattern.cs
```

```csharp
var p = new { Price = 24.99m };
Console.WriteLine(p is { Price: > 20m } ? "pricey" : "cheap");
```

### 084 — Parse / Convert

**Topic:** `basics`

```bash
dotnet run 084-parse.cs
```

```csharp
Console.WriteLine(int.Parse("42") + Convert.ToInt32("8"));
```

### 085 — DateTimeOffset / TimeSpan

**Topic:** `basics`

```bash
dotnet run 085-timespan.cs
```

```csharp
var ends = DateTimeOffset.UtcNow.AddMinutes(8);
Console.WriteLine($"in {(ends-DateTimeOffset.UtcNow).TotalMinutes:0.0}m");
```

### 086 — StringBuilder

**Topic:** `basics`

```bash
dotnet run 086-stringbuilder.cs
```

```csharp
var sb = new System.Text.StringBuilder();
sb.Append("Green").Append("Shelf");
Console.WriteLine(sb.ToString());
```

### 087 — Guid

**Topic:** `basics`

```bash
dotnet run 087-guid.cs
```

```csharp
Console.WriteLine(Guid.NewGuid().ToString("N")[..8]);
```

### 088 — Random

**Topic:** `basics`

```bash
dotnet run 088-random.cs
```

```csharp
Console.WriteLine(Random.Shared.Next(1, 7));
```

### 089 — Math.Clamp / Round

**Topic:** `basics`

```bash
dotnet run 089-math.cs
```

```csharp
Console.WriteLine($"{Math.Clamp(120,0,100)} / {Math.Round(2.5m, 0, MidpointRounding.AwayFromZero)}");
```

### 090 — invariant money

**Topic:** `basics`

```bash
dotnet run 090-culture-money.cs
```

```csharp
Console.WriteLine(24.5m.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture));
```

### 091 — thin service orchestration

**Topic:** `oop`

```bash
dotnet run 091-auction-service.cs
```

```csharp
Console.WriteLine(new AuctionService(new MemoryLots()).Board());

interface ILots { string All(); }

class MemoryLots : ILots { public string All() => "LOT-ROSE,LOT-HERB"; }

class AuctionService(ILots lots) { public string Board() => lots.All(); }
```

### 092 — bid policy SRP

**Topic:** `oop`

```bash
dotnet run 092-policy-validate.cs
```

```csharp
Console.WriteLine(new DefaultPolicy().Validate(20m, 18m, 1m) ?? "ok");
Console.WriteLine(new DefaultPolicy().Validate(18.5m, 18m, 1m) ?? "ok");

interface IPolicy { string? Validate(decimal amt, decimal high, decimal inc); }

class DefaultPolicy : IPolicy {
  public string? Validate(decimal amt, decimal high, decimal inc)
    => amt < high + inc ? $"need ≥ {high+inc}" : null;
}
```

### 093 — options like config()

**Topic:** `oop`

```bash
dotnet run 093-options-config.cs
```

```csharp
var opt = new AuctionOptions { SoftCloseSeconds = 30 };
Console.WriteLine(Math.Max(5, opt.SoftCloseSeconds));

class AuctionOptions { public int SoftCloseSeconds { get; set; } = 45; }
```

### 094 — LotSeed catalogue

**Topic:** `oop`

```bash
dotnet run 094-seed-record.cs
```

```csharp
var seeds = new[] {
  new LotSeed("LOT-ROSE", "Climbing Rose", 18m, DateTimeOffset.UtcNow.AddMinutes(8)),
};
Console.WriteLine($"{seeds[0].Id} ends {seeds[0].EndsAt:HH:mm}");

record LotSeed(string Id, string Name, decimal Reserve, DateTimeOffset EndsAt);
```

### 095 — status enum machine

**Topic:** `oop`

```bash
dotnet run 095-status-machine.cs
```

```csharp
Status Next(Status s) => s switch {
  Status.Booked => Status.Ready,
  Status.Ready => Status.Collected,
  _ => s
};
Console.WriteLine(Next(Status.Booked));
Console.WriteLine(Next(Status.Ready));

enum Status { Booked, Ready, Collected }
```

### 096 — immutable update with

**Topic:** `oop`

```bash
dotnet run 096-immutability.cs
```

```csharp
var o = new Order("open", 50m);
var packed = o with { Status = "packed" };
Console.WriteLine($"{o.Status} -> {packed.Status}");

record Order(string Status, decimal Total);
```

### 097 — Liskov — any IPriced works

**Topic:** `oop`

```bash
dotnet run 097-lsp.cs
```

```csharp
decimal Tax(IPriced p) => p.Price * 0.2m;
Console.WriteLine(Tax(new Plant()));
Console.WriteLine(Tax(new Tool()));

interface IPriced { decimal Price { get; } }

class Plant : IPriced { public decimal Price => 24.99m; }

class Tool : IPriced { public decimal Price => 16.40m; }
```

### 098 — small interfaces ISP

**Topic:** `oop`

```bash
dotnet run 098-isp.cs
```

```csharp
IRead r = new Store(); ((IWrite)r).Set("ok");
Console.WriteLine(r.Get());

interface IRead { string Get(); }

interface IWrite { void Set(string v); }

class Store : IRead, IWrite {
  string _v = "";
  public string Get() => _v;
  public void Set(string v) => _v = v;
}
```

### 099 — open/closed new strategy

**Topic:** `oop`

```bash
dotnet run 099-ocp.cs
```

```csharp
decimal Quote(IShip s) => s.Cost(2m);
Console.WriteLine(Quote(new Ground()));
Console.WriteLine(Quote(new Express()));

interface IShip { decimal Cost(decimal kg); }

class Ground : IShip { public decimal Cost(decimal kg) => 5 + kg; }

class Express : IShip { public decimal Cost(decimal kg) => 12 + kg * 2; }
```

### 100 — SOLID one-liner board

**Topic:** `oop`

```bash
dotnet run 100-solid-summary.cs
```

```csharp
Console.WriteLine("S single responsibility | O open/closed | L liskov | I interface seg | D depend on abstractions");
Console.WriteLine("Hub/Controller thin → Service orchestrates → Policy rules → Repository state");
```

