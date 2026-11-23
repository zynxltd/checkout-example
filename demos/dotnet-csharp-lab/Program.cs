// GreenShelf C# lab — ~100 tiny examples. Run: cd demos/dotnet-csharp-lab && dotnet run
// Tip: pipe to less: dotnet run | less

var n = 0;
void T(string title) => Console.WriteLine($"\n── {++n:000}. {title}");
void O(object? value) => Console.WriteLine($"    → {value}");

// ═══════════════════════════════════════════════════════════
// A. Basics — values, types, strings
// ═══════════════════════════════════════════════════════════

T("int literal");
O(42);

T("decimal money (m suffix)");
O(24.99m);

T("float / double");
O($"{3.14f} / {3.14159}");

T("bool");
O(true && !false);

T("char vs string");
O($"'A'={(int)'A'}  \"hi\".Length={"hi".Length}");

T("string interpolation");
var plant = "Rose";
O($"Plant: {plant}");

T("raw string literal (\"\"\")");
O("""{"sku":"ROSE01"}""");

T("null-coalescing ??");
string? maybe = null;
O(maybe ?? "default");

T("null-conditional ?.");
string? name = null;
O(name?.Length.ToString() ?? "was null");

T("is pattern / type check");
object box = 7;
O(box is int i ? $"int {i}" : "other");

// ═══════════════════════════════════════════════════════════
// B. Simple parameters & return values
// ═══════════════════════════════════════════════════════════

T("function: no params");
string Hello() => "hello";
O(Hello());

T("one param");
int Double(int x) => x * 2;
O(Double(21));

T("two params");
decimal LineTotal(int qty, decimal price) => qty * price;
O(LineTotal(2, 12.50m));

T("optional param (default)");
string Greet(string who = "gardener") => $"Hi {who}";
O(Greet());
O(Greet("Sam"));

T("named arguments (any order)");
O(LineTotal(price: 9.99m, qty: 3));

T("params array — variable args");
int Sum(params int[] xs) => xs.Sum();
O(Sum(1, 2, 3, 4));

T("return tuple");
(string sku, int stock) Peek() => ("HERB12", 40);
var (sku, stock) = Peek();
O($"{sku} stock={stock}");

T("discard _");
var (_, onlyStock) = Peek();
O(onlyStock);

T("void method (side effect only)");
void Log(string msg) => Console.WriteLine($"    [log] {msg}");
Log("bid placed");

T("expression-bodied method =>");
bool IsOdd(int x) => x % 2 != 0;
O(IsOdd(5));

// ═══════════════════════════════════════════════════════════
// C. Complex parameters — ref / out / in / by-value
// ═══════════════════════════════════════════════════════════

T("by-value (copy of value type)");
void BumpCopy(int x) => x++;
var a = 1; BumpCopy(a); O($"still {a}");

T("ref — mutate caller's variable");
void BumpRef(ref int x) => x++;
var b = 1; BumpRef(ref b); O($"now {b}");

T("out — method assigns before return");
bool TryParseSku(string s, out string code)
{
    if (s.StartsWith("LOT-")) { code = s; return true; }
    code = ""; return false;
}
O(TryParseSku("LOT-ROSE", out var code) ? code : "fail");

T("in — read-only pass (no copy intent for large structs)");
decimal Tax(in decimal net) => net * 0.2m;
var net = 100m; O(Tax(in net));

T("pass reference type — object is shared");
void Rename(LotTag tag) => tag.Label = "renamed";
var tag = new LotTag("rose"); Rename(tag); O(tag.Label);

T("reassign parameter does NOT change caller's reference");
void Replace(LotTag t) => t = new LotTag("other");
var t0 = new LotTag("keep"); Replace(t0); O(t0.Label);

T("ref on reference — can replace caller's reference");
void ReplaceRef(ref LotTag t) => t = new LotTag("replaced");
var t1 = new LotTag("old"); ReplaceRef(ref t1); O(t1.Label);

T("span / ReadOnlySpan (advanced slice, no alloc)");
ReadOnlySpan<char> slice = "LOT-ROSE".AsSpan(4);
O(slice.ToString());

// ═══════════════════════════════════════════════════════════
// D. Local functions, lambdas, delegates
// ═══════════════════════════════════════════════════════════

T("local function inside method-ish scope");
int Factorial(int x)
{
    int Rec(int n) => n <= 1 ? 1 : n * Rec(n - 1);
    return Rec(x);
}
O(Factorial(5));

T("lambda assigned to Func<>");
Func<int, int> square = x => x * x;
O(square(9));

T("Action<> — void lambda");
Action<string> shout = s => Console.WriteLine($"    → {s.ToUpper()}");
shout("bid");

T("Predicate<>");
Predicate<int> over10 = x => x > 10;
O(over10(12));

T("LINQ Where + Select");
O(string.Join(",", new[] { 1, 2, 3, 4 }.Where(x => x % 2 == 0).Select(x => x * 10)));

T("delegate multicast +=");
Action pipe = () => Console.Write("    → A");
pipe += () => Console.Write("B");
pipe += () => Console.WriteLine("C");
pipe();

// ═══════════════════════════════════════════════════════════
// E. Classes, objects, constructors
// ═══════════════════════════════════════════════════════════

T("class + new");
var lot = new SimpleLot("LOT-1", 18m);
O($"{lot.Id} reserve={lot.Reserve}");

T("property get/set");
lot.HighBid = 20m; O(lot.HighBid);

T("auto-property init");
var p = new Product { Sku = "ROSE01", Price = 24.99m };
O($"{p.Sku} £{p.Price}");

T("primary constructor (C# 12)");
var bid = new BidLine("Sam", 22m);
O($"{bid.Bidder} £{bid.Amount}");

T("static method on class");
O(MathHelpers.Clamp(150, 0, 100));

T("static class (like Laravel helper)");
O(Money.Format(19.5m));

T("inheritance — override");
Animal dog = new Dog();
O(dog.Speak());

T("abstract base");
Shape shape = new Circle(2);
O($"area≈{shape.Area():0.00}");

T("interface polymorphism");
IPriced priced = new Product { Sku = "X", Price = 5m };
O(priced.Price);

T("explicit interface impl use-case");
ILogger logger = new ConsoleLogger();
logger.Info("ready");

// ═══════════════════════════════════════════════════════════
// F. Records, structs, enums
// ═══════════════════════════════════════════════════════════

T("record — value-like equality");
var r1 = new LotSeed("A", 10m);
var r2 = new LotSeed("A", 10m);
O(r1 == r2);

T("record with { } — immutable copy");
var r3 = r1 with { Reserve = 12m };
O($"{r3.Id} {r3.Reserve} (orig {r1.Reserve})");

T("readonly struct");
var pt = new Point(3, 4);
O($"len={pt.Length():0.00}");

T("enum");
O(LotStatus.ClosingSoon);

T("enum to int / parse");
O($"{(int)LotStatus.Sold} / {Enum.Parse<LotStatus>("Open")}");

T("switch expression on enum");
string Label(LotStatus s) => s switch
{
    LotStatus.Open => "open",
    LotStatus.ClosingSoon => "hurry",
    LotStatus.Sold => "gone",
    _ => "unsold",
};
O(Label(LotStatus.ClosingSoon));

// ═══════════════════════════════════════════════════════════
// G. Generics
// ═══════════════════════════════════════════════════════════

T("generic method");
T MaxOf<T>(T a, T b) where T : IComparable<T> => a.CompareTo(b) >= 0 ? a : b;
O(MaxOf(3, 9));
O(MaxOf("sam", "lee"));

T("generic class Box<T>");
var boxInt = new Box<int>(42);
O(boxInt.Value);

T("List<T>");
var ids = new List<string> { "LOT-1", "LOT-2" };
ids.Add("LOT-3");
O(string.Join(",", ids));

T("Dictionary<TKey,TValue>");
var stockMap = new Dictionary<string, int> { ["ROSE01"] = 10 };
stockMap["ROSE01"]++;
O(stockMap["ROSE01"]);

T("Nullable value type int?");
int? missing = null;
O(missing?.ToString() ?? "null");

// ═══════════════════════════════════════════════════════════
// H. Collections & LINQ use-cases
// ═══════════════════════════════════════════════════════════

T("array");
int[] xs = [1, 2, 3];
O(xs[1]);

T("collection expression + spread");
int[] ys = [.. xs, 4, 5];
O(string.Join(",", ys));

T("Any / All");
O($"any>2={xs.Any(v => v > 2)} all>0={xs.All(v => v > 0)}");

T("Aggregate sum");
O(xs.Aggregate(0, (acc, v) => acc + v));

T("GroupBy");
var lines = new[] { ("plants", 1), ("plants", 2), ("tools", 1) };
O(string.Join(" | ", lines.GroupBy(l => l.Item1).Select(g => $"{g.Key}:{g.Sum(x => x.Item2)}")));

T("OrderByDescending Take");
O(string.Join(",", new[] { 5, 1, 9, 3 }.OrderByDescending(v => v).Take(2)));

T("Distinct");
O(string.Join(",", new[] { 1, 1, 2, 2, 3 }.Distinct()));

// ═══════════════════════════════════════════════════════════
// I. Exceptions, using, IDisposable
// ═══════════════════════════════════════════════════════════

T("try/catch");
try { throw new InvalidOperationException("below reserve"); }
catch (InvalidOperationException ex) { O($"caught: {ex.Message}"); }

T("throw if null (argument guard)");
try { ArgumentNullException.ThrowIfNull((string?)null); }
catch (ArgumentNullException) { O("ThrowIfNull worked"); }

T("using — dispose pattern");
using (var meter = new FakeMeter())
{
    O(meter.Read());
}
O("disposed after using");

T("await using would be for IAsyncDisposable (shown sync here)");
O("see async section");

// ═══════════════════════════════════════════════════════════
// J. Async / multithreading lite
// ═══════════════════════════════════════════════════════════

T("Task.FromResult");
O(Task.FromResult(99).Result);

T("async Task method");
async Task<int> SlowAdd(int a, int b)
{
    await Task.Delay(30);
    return a + b;
}
O(SlowAdd(2, 3).GetAwaiter().GetResult());

T("Task.WhenAll parallel");
var sw = System.Diagnostics.Stopwatch.StartNew();
Task.WhenAll(Task.Delay(40), Task.Delay(40)).GetAwaiter().GetResult();
O($"parallel ~{sw.ElapsedMilliseconds}ms (not 80)");

T("lock for thread-safe mutation");
var counter = 0;
var gate = new object();
Parallel.For(0, 1000, _ => { lock (gate) counter++; });
O(counter);

T("ConcurrentDictionary");
var bag = new System.Collections.Concurrent.ConcurrentDictionary<string, int>();
bag.AddOrUpdate("bids", 1, (_, v) => v + 1);
bag.AddOrUpdate("bids", 1, (_, v) => v + 1);
O(bag["bids"]);

T("Channel-like queue with ConcurrentQueue");
var q = new System.Collections.Concurrent.ConcurrentQueue<string>();
q.Enqueue("lead-1");
O(q.TryDequeue(out var job) ? job : "empty");

// ═══════════════════════════════════════════════════════════
// K. OOP patterns you'll see in the demos
// ═══════════════════════════════════════════════════════════

T("DI-shaped: depend on interface");
IBidPolicy policy = new MinIncrementPolicy(1m);
O(policy.Validate(20m, 18m) ?? "ok");

T("strategy swap");
IBidPolicy vip = new VipPolicy();
O(vip.Validate(18.5m, 18m) ?? "ok");

T("repository fake");
ILotRepo repo = new MemoryLotRepo();
repo.Add("LOT-X");
O(repo.Find("LOT-X"));

T("options object (like config())");
var opt = new AuctionOpts { SoftCloseSeconds = 45 };
O(opt.SoftCloseSeconds);

T("result object instead of throwing");
BidResult Place(decimal amount) =>
    amount < 18m ? BidResult.Fail("below reserve") : BidResult.Success(amount);
O(Place(20m));
O(Place(10m));

T("extension method");
O("rose".TitleCase());

T("sealed class — no further inherit");
O(new SealedTool("secateurs").Name);

// ═══════════════════════════════════════════════════════════
// L. Pattern matching & modern C#
// ═══════════════════════════════════════════════════════════

T("switch on type");
object payload = new BidLine("Sam", 30m);
O(payload switch
{
    BidLine bl => $"bid {bl.Amount}",
    string s => s,
    _ => "unknown",
});

T("list pattern");
int[] trio = [1, 2, 3];
O(trio is [1, 2, 3] ? "exact match" : "no");

T("property pattern");
O(p is { Price: > 20m } ? "pricey" : "cheap");

T("nameof");
O(nameof(SimpleLot.HighBid));

T("nameof protects renames");
O(nameof(IBidPolicy));

T("default literal");
int z = default;
O(z);

T("typeof / GetType");
O(typeof(SimpleLot).Name);
O(lot.GetType().Name);

T("Convert / Parse");
O(int.Parse("42") + Convert.ToInt32("8"));

T("TimeSpan / DateTimeOffset");
var ends = DateTimeOffset.UtcNow.AddMinutes(8);
O($"ends in {(ends - DateTimeOffset.UtcNow).TotalMinutes:0.0}m");

T("string.Join / Split");
O(string.Join("-", "a,b,c".Split(',')));

T("Span-free Substring");
O("LOT-ROSE"[4..]); // range operator

T("range ..");
O(string.Join(",", xs[1..]));

T("bit flags enum use-case");
var flags = FilePerm.Read | FilePerm.Write;
O(flags.HasFlag(FilePerm.Write));

T("index ^1 last element");
O(xs[^1]);

T("deconstruct custom");
var (id, reserve) = lot;
O($"{id}/{reserve}");

T("equality Comparer");
O(StringComparer.OrdinalIgnoreCase.Equals("Rose", "rose"));

T("HashSet");
var set = new HashSet<string> { "a", "a", "b" };
O(set.Count);

T("Stack / Queue");
var stack = new Stack<int>(); stack.Push(1); stack.Push(2);
O(stack.Pop());

T("StringBuilder (mutate without many allocs)");
var sb = new System.Text.StringBuilder();
sb.Append("Green").Append("Shelf");
O(sb.ToString());

T("GUID");
O(Guid.NewGuid().ToString("N")[..8]);

T("Random");
O(Random.Shared.Next(1, 7)); // dice

T("Math.Clamp / Round");
O($"{Math.Clamp(120, 0, 100)} / {Math.Round(2.5m, 0, MidpointRounding.AwayFromZero)}");

T("Culture-invariant money string");
O(24.5m.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture));

T("file-scoped feel: local static helper already used");
O("done");

T("FINAL — count of demos printed");
O($"This run labeled ~{n} sections (target ~100).");

Console.WriteLine("\n✓ Lab finished. Re-run: cd demos/dotnet-csharp-lab && dotnet run\n");

// ═══════════════════════════════════════════════════════════
// Types used above
// ═══════════════════════════════════════════════════════════

sealed class LotTag(string label)
{
    public string Label { get; set; } = label;
}

class SimpleLot(string id, decimal reserve)
{
    public string Id { get; } = id;
    public decimal Reserve { get; } = reserve;
    public decimal HighBid { get; set; }
    public void Deconstruct(out string id, out decimal reserve) { id = Id; reserve = Reserve; }
}

class Product : IPriced
{
    public string Sku { get; set; } = "";
    public decimal Price { get; set; }
}

interface IPriced { decimal Price { get; } }

sealed class BidLine(string bidder, decimal amount)
{
    public string Bidder { get; } = bidder;
    public decimal Amount { get; } = amount;
}

static class MathHelpers
{
    public static int Clamp(int v, int min, int max) => v < min ? min : v > max ? max : v;
}

static class Money
{
    public static string Format(decimal v) => $"£{v:0.00}";
}

abstract class Animal { public abstract string Speak(); }
class Dog : Animal { public override string Speak() => "woof"; }

abstract class Shape { public abstract double Area(); }
sealed class Circle(double r) : Shape { public override double Area() => Math.PI * r * r; }

interface ILogger { void Info(string msg); }
class ConsoleLogger : ILogger { public void Info(string msg) => Console.WriteLine($"    → INFO {msg}"); }

record LotSeed(string Id, decimal Reserve);

readonly struct Point(double x, double y)
{
    public double Length() => Math.Sqrt(x * x + y * y);
}

enum LotStatus { Open = 0, ClosingSoon = 1, Sold = 2, Unsold = 3 }

[Flags] enum FilePerm { None = 0, Read = 1, Write = 2, ReadWrite = Read | Write }

class Box<T>(T value) { public T Value { get; } = value; }

sealed class FakeMeter : IDisposable
{
    public string Read() => "12mm rain";
    public void Dispose() => Console.WriteLine("    → FakeMeter.Dispose()");
}

interface IBidPolicy { string? Validate(decimal amount, decimal reserve); }
class MinIncrementPolicy(decimal min) : IBidPolicy
{
    public string? Validate(decimal amount, decimal reserve) =>
        amount < reserve + min ? $"need ≥ {reserve + min}" : null;
}
class VipPolicy : IBidPolicy
{
    public string? Validate(decimal amount, decimal reserve) =>
        amount < reserve ? "below reserve" : null; // VIP can bid at reserve
}

interface ILotRepo
{
    void Add(string id);
    string? Find(string id);
}
class MemoryLotRepo : ILotRepo
{
    private readonly List<string> _ids = [];
    public void Add(string id) => _ids.Add(id);
    public string? Find(string id) => _ids.FirstOrDefault(x => x == id);
}

class AuctionOpts { public int SoftCloseSeconds { get; set; } }

readonly record struct BidResult(bool Ok, string? Error, decimal? Amount)
{
    public static BidResult Fail(string e) => new(false, e, null);
    public static BidResult Success(decimal a) => new(true, null, a);
    public override string ToString() => Ok ? $"OK £{Amount}" : $"FAIL {Error}";
}

static class StringExtras
{
    public static string TitleCase(this string s) =>
        string.IsNullOrEmpty(s) ? s : char.ToUpper(s[0]) + s[1..].ToLower();
}

sealed class SealedTool(string name) { public string Name { get; } = name; }
