# OOP patterns — quick cross-stack recognition guide

Goal: **recognise the same idea** in Laravel/PHP, Python, Node/JS, C#/.NET, and a little C++ — not memorize syntax.

Use with: [WALKTHROUGH.md](./WALKTHROUGH.md) · crash-course demos under `demos/`.

---

## 30-second map

| OOP idea | Plain English | Laravel | Python | Node/JS | C# | C++ |
|----------|---------------|---------|--------|---------|-----|-----|
| **Class** | Blueprint | `class User` | `class User` | `class User` / factory | `class User` | `class User` |
| **Object / instance** | One concrete thing | `$user = new User` | `User()` | `new User()` | `new User()` | `User u;` / `new` |
| **Property / field** | Data on the object | `$user->name` | `user.name` | `user.name` | `user.Name` | `user.name` |
| **Method** | Behaviour | `$user->save()` | `user.save()` | `user.save()` | `user.Save()` | `user.save()` |
| **Constructor** | Setup on create | `__construct` | `__init__` | `constructor` | `ctor` / primary ctor | constructor |
| **Encapsulation** | Hide guts; expose API | `private` / getters | `_private` / `@property` | `#private` / closure | `private` / props | `private:` |
| **Inheritance** | Is-a reuse | `extends` | `(Parent)` | `extends` | `:` | `:` |
| **Interface / contract** | Can-do promise | `interface` | `Protocol` / ABC | duck typing / TS `interface` | `interface` | pure virtual / concepts |
| **Polymorphism** | Same call, different behaviour | override / interface | override | override | `virtual`/`override` | `virtual` |
| **Composition** | Has-a (prefer this) | inject deps | inject / attrs | inject / props | DI container | members / smart ptrs |

**React note:** UI is mostly **functions + hooks**, not classic OOP. You still meet OOP in domain models, API clients, and Error classes. Pattern recognition &gt; forcing classes into components.

---

## 1. Class & instance

```php
// Laravel / PHP
class Product {
    public function __construct(public string $sku, public float $price) {}
}
$p = new Product('ROSE01', 24.99);
```

```python
# FastAPI demo — app/models style / services
class Product:
    def __init__(self, sku: str, price: float):
        self.sku = sku
        self.price = price

p = Product("ROSE01", 24.99)
```

```js
// Node
class Product {
  constructor(sku, price) {
    this.sku = sku
    this.price = price
  }
}
const p = new Product('ROSE01', 24.99)
```

```csharp
// ASP.NET crash course Models/Product.cs
public class Product
{
    public string Sku { get; set; } = "";
    public decimal Price { get; set; }
}
var p = new Product { Sku = "ROSE01", Price = 24.99m };
```

**Where in demos:**  
`dotnet-mvc-crash-course/Models/Product.cs` · `python-react-crash-course/api/app/services/product_store.py` · Plotline `store.js` (module as “object”).

**Recognise:** `new` / `()` creating state + methods = object.

---

## 2. Encapsulation (public API vs private guts)

| Stack | Hide internals | Expose |
|-------|----------------|--------|
| PHP | `private` / `protected` | `public` methods |
| Python | `_name` convention / `__name` mangling | public methods / `@property` |
| JS | `#name` private fields / closures | exports / methods |
| C# | `private` fields, properties | `public` props/methods |
| C++ | `private:` section | `public:` |

**Laravel:** FormRequest validates outside the controller — same idea as **don’t let callers poke private state**.

**Demo:** `ProductRules.can_delete` / `ProductRules.CanDelete` — rule lives in one place; controllers stay thin (**SRP**).

---

## 3. Inheritance vs composition (interview favourite)

### Inheritance — “is a”

```csharp
public class LeadPipelineWorker : BackgroundService  // is-a hosted service
```

```python
class InMemoryLeadAuditStore(ILeadAuditStore):  # implements contract (see interfaces)
    ...
```

Use sparingly. Deep trees get brittle (`GodController extends BaseController extends …`).

### Composition — “has a” (prefer)

```csharp
public class ProductsController {
    private readonly IProductStore _store;  // has-a store
    public ProductsController(IProductStore store) => _store = store;
}
```

```python
class ProductsApi:
    def __init__(self, store: ProductStore):
        self._store = store  # has-a
```

```js
// Express: app has routers; router uses store module
```

**Laravel:** controller constructor DI = composition.  
**React:** component *has* hooks/state/callbacks — composition over class inheritance.

**Recognise:** if you inject a dependency instead of extending a mega-base class, that’s composition.

---

## 4. Interfaces / contracts (DIP — Dependency Inversion)

Same idea everywhere: **depend on a shape, not a concrete class**.

```csharp
public interface IProductStore {
    IReadOnlyList<Product> All();
}
// Program.cs
builder.Services.AddSingleton<IProductStore, InMemoryProductStore>();
// later swap → EfProductStore without rewriting controllers
```

```python
# Protocol / ABC — or duck typing
class ProductStore(Protocol):
    def all(self) -> list: ...
```

```ts
// TypeScript (Node/React)
interface ProductStore {
  all(): Product[]
}
```

```php
// Laravel
interface ProductRepositoryInterface {
    public function all(): Collection;
}
$this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
```

**Demo ticks:**  
.NET `IProductStore` / `ILeadPipeline` / `ILeadAuditStore` · Python store classes · swap in-memory → EF/SQLite (Ex 6).

**Recognise:** `I…` / `Protocol` / `bind()` / `AddSingleton<I, Impl>` = “I can replace the guts later.”

---

## 5. Polymorphism (one call, many behaviours)

```csharp
IProductStore store = …;  // could be memory or EF
store.All();               // same call site
```

```python
def export(store):  # any object with .all()
    return store.all()
```

```js
// Strategy: different lenders in LeadPipeline routing
```

**Lead queue demos:** status enum + different `MarkRouted` / `MarkRejected` paths — behavioural branching; with interfaces you can swap entire pipelines.

**Recognise:** caller doesn’t `if (type === 'ef')` — the object knows what to do.

---

## 6. SOLID — recognise in code reviews

| Letter | Meaning | Smell if missing | Demo example |
|--------|---------|------------------|--------------|
| **S**ingle responsibility | One reason to change | God class | `ProductRules` vs controller |
| **O**pen/closed | Extend without rewriting callers | Giant `switch` for every type | New `IProductStore` impl |
| **L**iskov | Subtypes must honour contract | Child breaks parent method | Fake store in tests must behave |
| **I**nterface segregation | Small interfaces | One mega `IApp` | Separate product vs lead vs audit |
| **D**ependency inversion | Depend on abstractions | `new SqlStore()` inside controller | Constructor injection |

**AI check:** if the agent dumps DB access inside a React component or Blade view, that’s DIP/SRP failure — push to a service/store.

---

## 7. Common design patterns (spot them)

| Pattern | What it looks like | You’ve seen it as… |
|---------|-------------------|---------------------|
| **Repository / Store** | Class that loads/saves a model | Eloquent repos · `ProductStore` · `IProductStore` |
| **DTO / Form model** | Data shape for input/output | FormRequest · Pydantic · `ProductForm` · JSON body |
| **Service / Action** | Orchestrates use case | Laravel Action · `LeadPipeline` · `MemberPricing` |
| **Dependency Injection** | Framework builds graph | Laravel container · FastAPI Depends · `builder.Services` |
| **Factory** | Creates objects without `new` everywhere | `Model::factory` · `create_products_router(store)` |
| **Strategy** | Swap algorithm | Lender routing rules · discount codes |
| **Observer / Events** | Fire and listeners | Laravel Events · domain events · webhooks |
| **Queue / Worker** | Async “do later” | `ShouldQueue` · `BackgroundService` · thread/`Channel` |
| **Singleton** | One shared instance | Laravel singleton bind · `AddSingleton` · module-level store |
| **Facade** | Simple static face over complex subsystem | Laravel `Cache::` · (use sparingly in C#/JS) |
| **Middleware / Pipeline** | Wrap request | Laravel middleware · Express middleware · ASP.NET middleware |
| **Adapter** | Wrap alien API | Shopify webhook adapter · HttpClient partner webhook |

**Plotline SaaS:** `store.js` ≈ repository; Express routes ≈ controllers; React pages ≈ views — **MVC-ish** even in a SPA+API split.

---

## 8. MVC / layered architecture (same movie, new cast)

```text
Request → Router → Controller/Handler → Service/Store → Model/DB
                      ↓
                   View / JSON
```

| Layer | Laravel | ASP.NET | FastAPI | Express | React |
|-------|---------|---------|---------|---------|-------|
| Route | `routes/*.php` | `[Route]` / Map | `@app.get` | `app.get` | client router |
| Controller | `*Controller` | `*Controller` | path functions | controller fn | — |
| Domain/Service | Actions/Services | Services | `services/` | modules | hooks/lib |
| Model | Eloquent | class/EF entity | Pydantic + store | objects/DB | props/state |
| View | Blade/Inertia | Razor / SPA | JSON → SPA | EJS / SPA | JSX |

**Recognise:** if business rules sit only in the view/component, the layering slipped.

---

## 9. OOP vs FP vs “just modules” (2026 reality)

| Style | Where | Pattern still applies? |
|-------|-------|------------------------|
| Classic OOP | C#, Java, C++, PHP classes | Yes — full toolkit |
| Pythonic OOP | classes + modules | Yes — lighter |
| JS mixed | classes + functions + modules | Contracts via TS; composition via imports |
| React | functions | Composition, props as immutable data |
| FP-ish | LINQ, array `.map`, Python comprehensions | Still uses objects underneath |

You don’t need a class for everything. You **do** need to spot **boundaries**, **contracts**, and **who owns state**.

---

## 10. C++ recognition (when you see it)

```cpp
class Product {
public:
  Product(std::string sku, double price);
  double price() const;      // encapsulated getter
private:
  std::string sku_;
  double price_;
};
```

| C++ thing | Cousin |
|-----------|--------|
| `public`/`private` | same as C# |
| `virtual` / override | polymorphism |
| headers + `.cpp` | declaration vs implementation |
| RAII / smart pointers | ownership (unique vs shared) — C# GC hides this |
| templates | generics (`List<T>` / `vector<T>`) |

Web SE roles rarely need you to write C++; recognising “this is a class with invariants” is enough.

---

## 11. Five-minute drill (do tomorrow)

Open any of these and **name the pattern out loud**:

1. `demos/dotnet-mvc-crash-course/Program.cs` — DI registrations → **DIP / composition**  
2. `ProductsController` + `IProductStore` → **MVC + repository + injection**  
3. `LeadQueueWorker` / `LeadPipeline` → **worker / async service**  
4. `ProductRules` / `product_rules.py` → **SRP / domain rule**  
5. `demos/node-react-saas/api/src/store.js` + `server.js` → **module as singleton store + controllers**  
6. React `CartDrawer` props → **composition** (parent owns cart state)  
7. Pydantic `ProductCreate` → **DTO / FormRequest**

---

## 12. Smell checklist (PR / AI review)

| Smell | Likely issue |
|-------|--------------|
| Controller 400 lines | Missing service/store (**S**) |
| `new SqlConnection` inside UI | Missing DIP |
| Copy-pasted validation | Missing shared rules (**DRY**/SRP) |
| `switch(type)` everywhere for behaviour | Missing polymorphism / strategy |
| Subclass overrides break callers | LSP violation |
| God `Utils` class | Need cohesive objects/modules |
| Mutable global state | Encapsulation / test pain |

---

## Tie-in to walkthrough

While doing [WALKTHROUGH.md](./WALKTHROUGH.md):

| Part | OOP focus |
|------|-----------|
| React | Composition, props as data, avoid class components unless needed |
| Node / Plotline | Modules, store singleton, route handlers as thin controllers |
| Python | Classes + Pydantic DTOs + store |
| .NET | Interfaces, DI, SOLID, workers |
| DevOps | Not OOP — packaging of the same modular app |

---

## One-liner cheat

> **Objects hold state + behaviour. Prefer composition and small contracts. Put rules next to the data they protect. Swap implementations behind interfaces. That’s OOP in every stack you care about.**
