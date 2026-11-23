# C# language basics — generics, delegates, events, collections & modern features

Quick recognition guide for **.NET job specs** that list these.  
Pairs with: [dotnet COMMANDS](../demos/dotnet-mvc-crash-course/COMMANDS.md) · [OOP cross-stack](./OOP-patterns-cross-stack.md) · crash course `LinqLab` / DI.

**Honest status vs your labs**

| Topic | In demos already? | This doc |
|-------|-------------------|----------|
| Generics | Light (`List<T>`, `ActionResult<T>`, `ILogger<T>`) | Basics + when |
| Delegates | Rarely explicit | Basics + lambdas |
| Events | Not in crash course | Basics + when |
| Collections | Yes (`List`, LINQ) | Catalogue + choose when |
| Modern C# | Some (`records`, nullable, collection expressions in places) | C# 10–14 highlights |

You do **not** need every feature daily — you need to **read** them in PRs and docs.

---

## 1. Generics — “works for any type T”

**Idea:** Write one piece of code that is type-safe for many types (like PHP templates / TypeScript generics).

```csharp
// Open generic type
public class Box<T>
{
    public T Value { get; set; }
}

var a = new Box<int> { Value = 3 };
var b = new Box<string> { Value = "rose" };

// Generic method
public static T Identity<T>(T x) => x;
```

**Constraints**

```csharp
public static void Save<T>(T entity) where T : class, IEntity
{
    // T must be a reference type AND implement IEntity
}
```

| Constraint | Meaning |
|------------|---------|
| `where T : class` | Reference type |
| `where T : struct` | Value type |
| `where T : new()` | Has public parameterless ctor |
| `where T : IDisposable` | Must implement interface |
| `where T : U` | Must derive from U |

**You’ve already seen**

```csharp
ILogger<ProductsController>     // T = the category type
List<Product>                   // T = Product
ActionResult<Product>           // T = response body type
Channel<Guid> / Queue           // T = payload
AddSingleton<IProductStore, InMemoryProductStore>()  // type args for DI
```

| When | Why |
|------|-----|
| Repositories, lists, result wrappers | Avoid `object` + casts |
| DI / logging | Framework APIs are generic |
| Avoid | Over-generic “enterprise” soup nobody can read |

**Laravel cousin:** less visible — collections are `Collection` of mixed types; C# makes the **element type** part of the contract.

---

## 2. Delegates — “a variable that holds a method”

**Idea:** Treat a function as a value (JS first-class functions / PHP callables).

```csharp
// Built-in shapes (prefer these)
Func<int, int, int> add = (a, b) => a + b;     // in → out
Action<string> log = s => Console.WriteLine(s); // in → void
Predicate<int> even = n => n % 2 == 0;          // in → bool

int sum = add(2, 3);
log("hi");
bool ok = even(4);
```

**Named delegate type** (older style / frameworks)

```csharp
delegate decimal PriceRule(decimal price);

PriceRule tenOff = p => p * 0.9m;
decimal n = tenOff(100m);
```

**Multicast:** one delegate can point at several methods (`+=`); all get called (used heavily by **events**).

| When | Why |
|------|-----|
| Callbacks, LINQ (`Where(p => …)`) | Lambdas *are* delegates |
| Sorting / filtering / DI factories | Pass behaviour |
| Avoid reinventing | Prefer `Func<>` / `Action<>` over custom delegates |

**Recognise in LINQ**

```csharp
products.Where(p => p.Stock > 0)   // Func<Product, bool>
        .Select(p => p.Sku);       // Func<Product, string>
```

That’s generics + delegates together — the heart of modern C#.

---

## 3. Events — “notify subscribers something happened”

**Idea:** Publisher exposes an event; subscribers attach handlers (`+=`). Safe way to do observer pattern.

```csharp
public class LeadPipeline
{
    // EventHandler is a delegate type
    public event EventHandler<LeadEventArgs>? LeadRouted;

    protected virtual void OnLeadRouted(Lead lead)
    {
        LeadRouted?.Invoke(this, new LeadEventArgs(lead));
    }
}

// Subscriber
pipeline.LeadRouted += (sender, e) =>
    Console.WriteLine($"Routed {e.Lead.Id}");
```

| When | Why |
|------|-----|
| UI (WinForms/WPF/MAUI), domain “something happened” | Loose coupling |
| ASP.NET Core | Prefer middleware / `IHostedService` / MediatR-style — **events exist but HTTP apps use other patterns more** |
| Threading note | Unsubscribe (`-=`) to avoid leaks |

**Laravel cousin:** `Event::dispatch` + listeners — same *idea*, different wiring.  
**Crash course:** lead worker logs instead of C# `event` — same lifecycle mentally.

**Recognise:** `event`, `EventHandler<T>`, `+=` / `-=`, `?.Invoke`.

---

## 4. Collections — what to reach for

| Type | Ordered? | Dupes? | Fast lookup | When |
|------|----------|--------|-------------|------|
| `List<T>` | Yes | Yes | Index O(1), find O(n) | Default list — **you use this most** |
| `T[]` array | Yes | Yes | Index | Fixed size / span perf |
| `Dictionary<TKey,TValue>` | No* | Keys unique | Key O(1) | Lookups by id/sku |
| `HashSet<T>` | No | Unique | Contains O(1) | “Have we seen this?” |
| `Queue<T>` | Yes | Yes | — | FIFO — lead queues |
| `Stack<T>` | Yes | Yes | — | LIFO / undo |
| `IEnumerable<T>` | — | — | Deferred | LINQ pipelines (lazy) |
| `IReadOnlyList<T>` | Yes | — | — | Return without allowing Add |

\*Dictionary enumeration order isn’t for sorting — sort explicitly if needed.

```csharp
var list = new List<Product>();
var bySku = new Dictionary<string, Product>(StringComparer.OrdinalIgnoreCase);
bySku["ROSE01"] = product;

foreach (var p in list) { /* … */ }

// LINQ (extension methods on IEnumerable<T>)
var plants = list.Where(p => p.Category == "plants").ToList();
```

**Immutability / modern**

```csharp
IReadOnlyList<Product> All();           // callers can’t Add
List<Product> plants = [p1, p2, p3];  // collection expression (modern C#)
```

**Laravel cousin:** `collect([])` ≈ LINQ on `IEnumerable` / `List`.  
**Demo:** `InMemoryProductStore` + `LinqLab` — practise `Where` / `Select` / `GroupBy`.

---

## 5. Modern C# features (read-only cheat sheet)

Grouped by what you’ll *see* in .NET 8–10 / C# 12–14 codebases.

### Types & null safety

| Feature | Example | When |
|---------|---------|------|
| Nullable reference types | `string?` / `#nullable enable` | Catch null bugs at compile time |
| Null-conditional | `lead?.RoutedToLender` | Safe navigation |
| Null-coalescing | `name ?? "unknown"` | Defaults |
| `is not null` | `if (p is not null)` | Clearer than `!= null` |

### Concise types

| Feature | Example | When |
|---------|---------|------|
| Auto-properties | `public string Sku { get; set; }` | Models/DTOs |
| Records | `public record ProductDto(string Sku, decimal Price);` | Immutable DTOs / value-like data |
| Init-only | `{ get; init; }` | Set on create only |
| Primary constructors | `class Store(ILogger<Store> log)` | Inject deps with less boilerplate |
| File-scoped namespaces | `namespace App.Models;` | Less nesting |
| Top-level statements | `Program.cs` without `Main` | Minimal hosting / scripts |

### Pattern matching

```csharp
string label = status switch
{
    LeadStatus.Routed => "done",
    LeadStatus.Rejected => "no",
    _ => "pending"
};

if (product is { Stock: 0, Category: "plants" }) { /* out of stock plant */ }
```

### Lambdas & local functions

```csharp
products.Where(p => p.Price > 10);

decimal Tax(decimal net) => net * 0.2m; // local function
```

### Async (you’ll see everywhere)

```csharp
public async Task<Product?> FindAsync(int id)
{
    return await _db.Products.FindAsync(id);
}
```

`Task` / `Task<T>` / `async`/`await` ≈ JS Promises / Laravel HTTP async — don’t block with `.Result` on ASP.NET.

### Other “modern” you’ll skim in docs

| Feature | One-liner |
|---------|-----------|
| `span` / `Memory` | High-perf slices (advanced) |
| `required` members | Must set on object initializer |
| Raw string literals `"""…"""` | Multi-line JSON/SQL |
| Collection expressions `[…]` | Create lists/arrays succinctly |
| Interceptors / new C# 14 toys | Nice-to-know; not day-one |

**Crash course already leans modern:** nullable enabled, implicit usings, minimal `Program.cs`, records possible for forms.

---

## 6. How they combine (one picture)

```csharp
// Generics          ↓
public event EventHandler<LeadEventArgs>? LeadRouted;  // event + delegate + generic arg

public IReadOnlyList<Product> Search(string? q)        // collection interface
{
    // delegate (lambda) plugged into LINQ (generic extension methods)
    return _items.Where(p => p.Name.Contains(q ?? "", StringComparison.OrdinalIgnoreCase))
                 .ToList();
}
```

If you can read that block, you’re “covered” for most job-ad checklists.

---

## 7. Five-minute drill

1. What does `List<Product>` buy you vs `ArrayList` / untyped list?  
2. Is `p => p.Stock > 0` a delegate? (**Yes** — `Func<Product,bool>`.)  
3. When prefer `Dictionary` over `List`?  
4. Why `IProductStore` instead of concrete class? (DIP — OOP doc.)  
5. Rewrite a tiny DTO as a `record`.  
6. In DebugLab, set a breakpoint and inspect a `List<Product>` in Locals.

---

## 8. Practice map (your repo)

| Want reps on… | Do this |
|---------------|---------|
| Collections + LINQ | .NET Ex 1 + Ex 7 `LinqLab` |
| Generics in the wild | Read `ILogger<T>`, `ActionResult<T>`, `List<T>` in crash course |
| Delegates | Read every `.Where(` / `.Select(` — name the `Func<>` |
| Events | Skim this doc; optional: fire `LeadRouted` from worker (stretch) |
| Modern C# | Convert a DTO to `record`; use `switch` expression on `LeadStatus` |
| Async | Follow `async` in EF Ex 6 when you add `ToListAsync()` |

---

## One-liner cheat

> **Generics = type-safe reuse. Delegates = functions as values (LINQ lives here). Events = safe pub/sub. Collections = pick List/Dictionary/Queue on purpose. Modern C# = less boilerplate + null safety — read records, pattern matching, async.**

**Basics on all covered?** After this doc + LINQ/DI labs: **yes for recognition and interview talk.** Deep expertise comes from reading real PRs and writing a bit of each — not from memorising the spec.
