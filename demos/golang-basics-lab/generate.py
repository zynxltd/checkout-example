#!/usr/bin/env python3
"""Generate C# MS Learn class drills + Go tour drills."""
from __future__ import annotations

from pathlib import Path

REPO = Path("/Users/tom/Herd/yg-cart-drawer-demo")

# ---- C# ----
cs_root = REPO / "demos/dotnet-csharp-lab/mslearn-classes"
cs_root.mkdir(parents=True, exist_ok=True)
for p in cs_root.glob("*.cs"):
    p.unlink()

CS: list[tuple[str, str, str, str, str]] = []


def cs(num: int, slug: str, title: str, section: str, code: str, expected: str) -> None:
    name = f"{num:02d}-{slug}.cs"
    header = (
        f"// TASK {num:02d}: {title}\n"
        f"// Docs: {section}\n"
        f"// Run:  dotnet run {name}\n"
        f"// Or paste (code only) into https://dotnetfiddle.net/\n"
        f"// Expect: {expected}\n\n"
    )
    CS.append((name, title, section, expected, header + code.strip() + "\n"))


cs(1, "declare-class", "Declare a class", "Declare a class", """
class Customer
{
    public string Name { get; set; }
    public Customer(string name) => Name = name;
}

var customer = new Customer("Allison");
Console.WriteLine(customer.Name);
""", "Allison")

cs(2, "create-object", "Create objects with new", "Create objects", """
class Customer
{
    public string Name { get; set; }
    public Customer(string name) => Name = name;
}

var customer = new Customer("Allison");
Console.WriteLine(customer.Name);
""", "Allison")

cs(3, "reference-share", "Assignment copies reference", "Create objects", """
class Customer
{
    public string Name { get; set; }
    public Customer(string name) => Name = name;
}

var c1 = new Customer("Grace");
var c2 = c1;
c2.Name = "Hopper";
Console.WriteLine(c1.Name);
""", "Hopper")

cs(4, "class-vs-struct", "Struct assignment copies values", "Create objects vs structs", """
struct Point { public int X; public int Y; }
var a = new Point { X = 1, Y = 2 };
var b = a;
b.X = 99;
Console.WriteLine($"a.X={a.X} b.X={b.X}");
""", "a.X=1 b.X=99")

cs(5, "field-initializer", "Field initializers", "Constructors and initialization", """
class Container
{
    private int _capacity = 10;
    public int Capacity => _capacity;
}
Console.WriteLine(new Container().Capacity);
""", "10")

cs(6, "ctor-params", "Constructor parameters", "Constructors and initialization", """
class Container
{
    private int _capacity;
    public Container(int capacity) => _capacity = capacity;
    public int Capacity => _capacity;
}
Console.WriteLine(new Container(25).Capacity);
""", "25")

cs(7, "primary-ctor", "Primary constructor", "Constructors and initialization", """
class Container(int capacity)
{
    private int _capacity = capacity;
    public int Capacity => _capacity;
}
Console.WriteLine(new Container(40).Capacity);
""", "40")

cs(8, "required-props", "Required properties", "Constructors and initialization", """
class Person
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}
var person = new Person { FirstName = "Grace", LastName = "Hopper" };
Console.WriteLine($"{person.FirstName} {person.LastName}");
""", "Grace Hopper")

cs(9, "static-class", "Static class", "Static classes", """
static class MathHelpers
{
    public static double CircleCircumference(double radius) => 2 * Math.PI * radius;
}
Console.WriteLine($"Circumference: {MathHelpers.CircleCircumference(5.0):F2}");
""", "Circumference: 31.42")

cs(10, "object-initializer", "Object initializers", "Object initializers", """
class ConnectionOptions
{
    public string Host { get; init; } = "localhost";
    public int Port { get; init; } = 80;
    public bool UseSsl { get; init; }
}
var options = new ConnectionOptions { Host = "db.example.com", Port = 5432, UseSsl = true };
Console.WriteLine($"{options.Host}:{options.Port} (SSL: {options.UseSsl})");
""", "db.example.com:5432 (SSL: True)")

cs(11, "collection-expr", "Collection expression", "Object initializers", """
class Basket
{
    public List<string> Items { get; init; } = [];
}
var basket = new Basket { Items = ["Rose", "Herb", "Soil"] };
Console.WriteLine(string.Join(",", basket.Items));
""", "Rose,Herb,Soil")

cs(12, "inheritance", "Inheritance", "Inheritance", """
class Employee(string name)
{
    public string Name { get; } = name;
}
class Manager(string name, string department) : Employee(name)
{
    public string Department { get; } = department;
}
var manager = new Manager("Satya", "Engineering");
Console.WriteLine($"{manager.Name} manages {manager.Department}");
""", "Satya manages Engineering")

cs(13, "virtual-override", "virtual / override", "Inheritance", """
class Animal
{
    public virtual string Speak() => "...";
}
class Dog : Animal
{
    public override string Speak() => "woof";
}
Animal a = new Dog();
Console.WriteLine(a.Speak());
""", "woof")

cs(14, "init-only", "init-only property", "Object initializers", """
class Lot
{
    public string Id { get; init; } = "";
}
var lot = new Lot { Id = "LOT-ROSE" };
Console.WriteLine(lot.Id);
""", "LOT-ROSE")

cs(15, "shared-ref-practice", "GreenShelf shared reference", "Create objects practice", """
class Member
{
    public string Email { get; set; }
    public Member(string email) => Email = email;
}
var m1 = new Member("sam@yg.test");
var m2 = m1;
m2.Email = "sam+club@yg.test";
Console.WriteLine(m1.Email);
""", "sam+club@yg.test")

cs(16, "options-practice", "GreenShelf options initializer", "Object initializers practice", """
class AuctionOptions
{
    public int SoftCloseSeconds { get; init; } = 45;
    public int ExtendSeconds { get; init; } = 30;
}
var opt = new AuctionOptions { SoftCloseSeconds = 60 };
Console.WriteLine($"{opt.SoftCloseSeconds}/{opt.ExtendSeconds}");
""", "60/30")

cs(17, "primary-lot", "GreenShelf primary ctor lot", "Primary constructors practice", """
class Lot(string id, decimal reserve)
{
    public string Id => id;
    public decimal Reserve => reserve;
    public decimal HighBid { get; set; }
}
var lot = new Lot("LOT-1", 18m) { HighBid = 20m };
Console.WriteLine($"{lot.Id} reserve={lot.Reserve} high={lot.HighBid}");
""", "LOT-1 reserve=18 high=20")

cs(18, "math-static", "Use BCL static class Math", "Static classes", """
Console.WriteLine(Math.Max(3, 9));
""", "9")

for name, title, section, expected, content in CS:
    (cs_root / name).write_text(content)

tasks_cs = [
    "# C# classes — runnable tasks (Microsoft Learn)",
    "",
    "Doc: [C# classes](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/classes)",
    "Focus: [Create objects](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/classes#create-objects)",
    "",
    "## Run options",
    "",
    "### A) Local (recommended)",
    "```bash",
    "cd demos/dotnet-csharp-lab/mslearn-classes",
    "dotnet run 01-declare-class.cs",
    "dotnet run 03-reference-share.cs",
    "./run-all.sh",
    "```",
    "",
    "### B) [.NET Fiddle](https://dotnetfiddle.net/)",
    "1. Open the fiddle → choose **C#**",
    "2. Delete the default code",
    "3. Paste everything **below the `// Expect:` comment** from a `.cs` file",
    "4. Click **Run**",
    "",
    "## Checklist",
    "",
]
for name, title, section, expected, _ in CS:
    tasks_cs.append(f"- [ ] `{name}` — **{title}** · {section} · expect `{expected}`")
tasks_cs += [
    "",
    "## Done when",
    "",
    "You can say out loud:",
    "- `new` creates an instance; class vars hold **references**",
    "- `c2 = c1` shares identity (mutate via either name)",
    "- structs **copy** on assign",
    "- field init / ctor / primary ctor / required / object initializer / static / inheritance",
    "",
]
(cs_root / "TASKS.md").write_text("\n".join(tasks_cs))
(cs_root / "run-all.sh").write_text(
    "#!/usr/bin/env bash\nset -euo pipefail\ncd \"$(dirname \"$0\")\"\n"
    "for f in [0-9][0-9]-*.cs; do echo \"===== $f\"; dotnet run \"$f\"; echo; done\n"
)
(cs_root / "run-all.sh").chmod(0o755)
print("C# drills", len(CS), "->", cs_root)

# ---- Go ----
go_root = REPO / "demos/golang-basics-lab/snippets"
go_root.mkdir(parents=True, exist_ok=True)
for p in go_root.glob("*.go"):
    p.unlink()

GO: list[tuple[str, str, str, str, str]] = []


def go(num: int, slug: str, title: str, section: str, code: str, expected: str) -> None:
    name = f"{num:03d}-{slug}.go"
    header = (
        f"// TASK {num:03d}: {title}\n"
        f"// Docs: {section}\n"
        f"// Run:  go run {name}\n"
        f"// Expect: {expected}\n\n"
    )
    body = code.strip() + "\n"
    if not body.startswith("package "):
        lines = body.strip("\n").splitlines()
        indented = "\n".join(("\t" + ln if ln.strip() else "") for ln in lines)
        body = f"package main\n\nimport \"fmt\"\n\nfunc main() {{\n{indented}\n}}\n"
    GO.append((name, title, section, expected, header + body))


go(1, "hello", "Hello World", "Getting started / Tour", 'fmt.Println("hello greenshelf")', "hello greenshelf")
go(2, "packages", "Packages", "Tour: Packages", 'fmt.Println("fmt package")', "fmt package")
go(3, "functions", "Functions", "Tour: Functions", "add := func(x, y int) int { return x + y }\nfmt.Println(add(42, 13))", "55")
go(4, "multi-return", "Multiple results", "Tour: Multiple results", 'swap := func(x, y string) (string, string) { return y, x }\na, b := swap("hello", "world")\nfmt.Println(a, b)', "world hello")
go(5, "named-return", "Named returns", "Tour: Named return values", "split := func(sum int) (x, y int) { x = sum * 4 / 9; y = sum - x; return }\nfmt.Println(split(17))", "7 10")
go(6, "vars", "Variables", "Tour: Variables", "var i int = 1\nj := 2\nfmt.Println(i, j)", "1 2")
go(7, "short-decl", "Short declaration", "Tour: Short variable declarations", "k := 3\nfmt.Println(k)", "3")
go(8, "basic-types", "Basic types", "Tour: Basic types", 'fmt.Println(true, "hi", 42)', "true hi 42")
go(9, "zero", "Zero values", "Tour: Zero values", 'var i int\nvar s string\nvar b bool\nfmt.Printf("%v %q %v\\n", i, s, b)', '0 "" false')
go(10, "convert", "Type conversions", "Tour: Type conversions", "fmt.Println(float64(42))", "42")
go(11, "infer", "Type inference", "Tour: Type inference", 'v := 42\nfmt.Printf("%T\\n", v)', "int")
go(12, "const", "Constants", "Tour: Constants", "const Pi = 3.14\nfmt.Println(Pi)", "3.14")
go(13, "for", "For", "Tour: For", "sum := 0\nfor i := 0; i < 10; i++ { sum += i }\nfmt.Println(sum)", "45")
go(14, "for-while", "For as while", "Tour: For continued", "sum := 1\nfor sum < 1000 { sum += sum }\nfmt.Println(sum)", "1024")
go(15, "break", "Break", "Tour: Forever", "i := 0\nfor { i++; if i >= 3 { break } }\nfmt.Println(i)", "3")
go(16, "if", "If", "Tour: If", 'if 7%2 == 1 { fmt.Println("odd") }', "odd")
go(17, "if-else", "If else", "Tour: If and else", 'if 8%2 == 0 { fmt.Println("even") } else { fmt.Println("odd") }', "even")
go(18, "if-short", "If short stmt", "Tour: If with a short statement", "if v := 81; v < 100 { fmt.Println(v) }", "81")
go(19, "switch", "Switch", "Tour: Switch", 'switch os := "mac"; os {\ncase "mac": fmt.Println("darwin")\ndefault: fmt.Println(os)\n}', "darwin")
go(20, "switch-true", "Switch true", "Tour: Switch with no condition", 't := 15\nswitch {\ncase t < 12: fmt.Println("am")\ndefault: fmt.Println("pm-ish")\n}', "pm-ish")
go(21, "defer", "Defer", "Tour: Defer", 'defer fmt.Println("world")\nfmt.Println("hello")', "hello\\nworld")
go(22, "defer-stack", "Defer stack", "Tour: Stacking defers", "defer fmt.Println(1)\ndefer fmt.Println(2)\ndefer fmt.Println(3)", "3\\n2\\n1")
go(23, "pointers", "Pointers", "Tour: Pointers", "i := 42\np := &i\n*p = 21\nfmt.Println(i)", "21")
go(24, "structs", "Structs", "Tour: Structs", "type Vertex struct{ X, Y int }\nv := Vertex{1, 2}\nfmt.Println(v.X, v.Y)", "1 2")
go(25, "struct-lit", "Struct literals", "Tour: Struct Literals", "type Vertex struct{ X, Y int }\nfmt.Println(Vertex{X: 1})", "{1 0}")
go(26, "struct-ptr", "Pointers to structs", "Tour: Pointers to structs", "type Vertex struct{ X, Y int }\nv := &Vertex{1, 2}\nv.X = 9\nfmt.Println(v.X)", "9")
go(27, "arrays", "Arrays", "Tour: Arrays", 'var a [2]string\na[0], a[1] = "Hello", "World"\nfmt.Println(a[0], a[1])', "Hello World")
go(28, "slices", "Slices", "Tour: Slices", "s := []int{2, 3, 5}\nfmt.Println(s)", "[2 3 5]")
go(29, "slice-expr", "Slicing", "Tour: Slices are like references", "s := []int{0, 1, 2, 3, 4}\nfmt.Println(s[1:4])", "[1 2 3]")
go(30, "len-cap", "len and cap", "Tour: Slice length and capacity", "s := []int{2, 3, 5, 7, 11, 13}\ns = s[:0]\nfmt.Println(len(s), cap(s))\ns = s[:4]\nfmt.Println(len(s), cap(s))", "0 6\\n4 6")
go(31, "nil-slice", "Nil slices", "Tour: Nil slices", "var s []int\nfmt.Println(s == nil, len(s))", "true 0")
go(32, "make-slice", "make slice", "Tour: Creating a slice with make", "a := make([]int, 5)\nfmt.Println(len(a), a)", "5 [0 0 0 0 0]")
go(33, "append", "append", "Tour: Appending to a slice", "var s []int\ns = append(s, 0, 1, 2)\nfmt.Println(s)", "[0 1 2]")
go(34, "range", "range", "Tour: Range", 'for i, v := range []int{1, 2, 4} { fmt.Printf("%d=%d ", i, v) }\nfmt.Println()', "0=1 1=2 2=4")
go(35, "maps", "Maps", "Tour: Maps", 'm := make(map[string]int)\nm["Answer"] = 42\nfmt.Println(m["Answer"])', "42")
go(36, "map-lit", "Map literals", "Tour: Map literals", 'm := map[string]int{"B": 2}\nfmt.Println(m["B"])', "2")
go(37, "map-mut", "Mutating maps", "Tour: Mutating Maps", 'm := map[string]int{"A": 1}\ndelete(m, "A")\n_, ok := m["A"]\nfmt.Println(ok)', "false")
go(38, "fn-values", "Function values", "Tour: Function values", "hypot := func(x, y float64) float64 { return x*x + y*y }\nfmt.Println(hypot(3, 4))", "25")
go(39, "closures", "Closures", "Tour: Function closures", "adder := func() func(int) int {\n\tsum := 0\n\treturn func(x int) int { sum += x; return sum }\n}\npos := adder()\nfmt.Println(pos(1), pos(2), pos(3))", "1 3 6")

go(40, "methods", "Methods", "Tour: Methods", """package main

import (
	"fmt"
	"math"
)

type Vertex struct{ X, Y float64 }

func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func main() {
	fmt.Printf("%.0f\\n", Vertex{3, 4}.Abs())
}
""", "5")

go(41, "ptr-recv", "Pointer receivers", "Tour: Pointer receivers", """package main

import "fmt"

type Vertex struct{ X, Y float64 }

func (v *Vertex) Scale(f float64) {
	v.X *= f
	v.Y *= f
}

func main() {
	v := Vertex{3, 4}
	v.Scale(2)
	fmt.Println(v)
}
""", "{6 8}")

go(42, "interfaces", "Interfaces", "Tour: Interfaces", """package main

import "fmt"

type Abser interface{ Abs() float64 }

type MyFloat float64

func (f MyFloat) Abs() float64 {
	if f < 0 {
		return float64(-f)
	}
	return float64(f)
}

func main() {
	var a Abser = MyFloat(-2)
	fmt.Println(a.Abs())
}
""", "2")

go(43, "assert", "Type assertions", "Tour: Type assertions", 'var i any = "hello"\nfmt.Println(i.(string))\ns, ok := i.(string)\nfmt.Println(s, ok)', "hello\\nhello true")
go(44, "type-switch", "Type switches", "Tour: Type switches", 'var i any = 42\nswitch v := i.(type) {\ncase int: fmt.Printf("int %d\\n", v)\ndefault: fmt.Printf("%T\\n", v)\n}', "int 42")

go(45, "stringer", "Stringer", "Tour: Stringer", """package main

import "fmt"

type Person struct {
	Name string
	Age  int
}

func (p Person) String() string {
	return fmt.Sprintf("%v (%v years)", p.Name, p.Age)
}

func main() {
	fmt.Println(Person{"Arthur", 42})
}
""", "Arthur (42 years)")

go(46, "errors", "Errors", "Tour: Errors", """package main

import (
	"errors"
	"fmt"
)

func run() error {
	return errors.New("broke")
}

func main() {
	if err := run(); err != nil {
		fmt.Println(err)
	}
}
""", "broke")

go(47, "generics", "Generics", "Tour: Generics", """package main

import "fmt"

func Index[T comparable](s []T, x T) int {
	for i, v := range s {
		if v == x {
			return i
		}
	}
	return -1
}

func main() {
	fmt.Println(Index([]int{1, 2, 3}, 2))
}
""", "1")

go(48, "goroutines", "Goroutines", "Tour: Goroutines", """package main

import (
	"fmt"
	"time"
)

func main() {
	go func(msg string) {
		fmt.Println(msg)
	}("ping")
	time.Sleep(20 * time.Millisecond)
}
""", "ping")

go(49, "channels", "Channels", "Tour: Channels", """package main

import "fmt"

func main() {
	ch := make(chan int)
	go func() { ch <- 1 }()
	fmt.Println(<-ch)
}
""", "1")

go(50, "buffered", "Buffered channels", "Tour: Buffered Channels", "ch := make(chan int, 2)\nch <- 1\nch <- 2\nfmt.Println(<-ch, <-ch)", "1 2")
go(51, "range-close", "Range and close", "Tour: Range and Close", 'ch := make(chan int, 3)\nch <- 2\nch <- 4\nch <- 6\nclose(ch)\nfor i := range ch { fmt.Print(i, " ") }\nfmt.Println()', "2 4 6")
go(52, "select", "Select", "Tour: Select", """package main

import "fmt"

func main() {
	c := make(chan int, 1)
	c <- 7
	select {
	case x := <-c:
		fmt.Println(x)
	default:
		fmt.Println("none")
	}
}
""", "7")
go(53, "select-default", "Default selection", "Tour: Default Selection", 'c := make(chan int)\nselect {\ncase <-c:\n\tfmt.Println("got")\ndefault:\n\tfmt.Println("default")\n}', "default")

go(54, "json", "encoding/json", "JSON and Go", """package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	b, _ := json.Marshal(map[string]int{"qty": 2})
	fmt.Println(string(b))
}
""", '{"qty":2}')

go(55, "err-idiom", "if err != nil", "Effective Go", """package main

import (
	"errors"
	"fmt"
)

func mightFail(ok bool) error {
	if !ok {
		return errors.New("nope")
	}
	return nil
}

func main() {
	if err := mightFail(false); err != nil {
		fmt.Println("err:", err)
	}
}
""", "err: nope")


for name, title, section, expected, content in GO:
    (go_root / name).write_text(content)

print("Go drills (base)", len(GO), "->", go_root)
