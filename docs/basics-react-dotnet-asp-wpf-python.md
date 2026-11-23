# Basics quick run-through — React, .NET, ASP.NET, WPF, Python

**Pretty simple.** What each thing *is*, when you use it, and whether your labs already go deeper.

| Tech | Covered in labs? | This page |
|------|------------------|-----------|
| **React** | Yes — full crash course | 2-minute recap |
| **.NET** | Yes — runtime/SDK via demos | 2-minute recap |
| **ASP.NET** | Yes — MVC + Web API crash course | 2-minute recap |
| **Python** | Yes — FastAPI + React path | 2-minute recap |
| **WPF** | **No demo** | Basics only (below) |

Detail when you need it: [WALKTHROUGH](./WALKTHROUGH.md) · [React COMMANDS](../demos/react-crash-course/COMMANDS.md) · [.NET COMMANDS](../demos/dotnet-mvc-crash-course/COMMANDS.md) · [Python COMMANDS](../demos/python-react-crash-course/COMMANDS.md) · [C# language](./csharp-language-basics.md)

---

## 1. React (UI library for the browser)

**What:** Library for building web UIs from **components**. You describe the UI as a function of **state**; React updates the DOM.

**Not:** A backend. Pair with Laravel / FastAPI / ASP.NET / Node for APIs.

| Idea | One line |
|------|----------|
| Component | Function that returns JSX (`<div>…</div>`) |
| Props | Inputs from parent (like Vue props) |
| State | `useState` — local data that re-renders on change |
| Effect | `useEffect` — run after render (fetch, subscriptions) |
| Key | Stable id when listing items |

```jsx
function Hello({ name }) {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>{name}: {n}</button>
}
```

| When | SPA dashboards, Shopify widgets, job ads saying React |
| How | `npm create vite@latest` → React; lab: `demos/react-crash-course` |
| Debug | React DevTools + browser console |

**Vue cousin:** SFC ≈ component file; `ref` ≈ `useState`; `onMounted` ≈ `useEffect`.

---

## 2. .NET (the platform)

**What:** Microsoft’s **runtime + SDK + libraries** for building apps in **C#** (mainly). Version you care about: **.NET 8/10** (not the old “.NET Framework only” world).

| Piece | Role |
|-------|------|
| `dotnet` CLI | create, build, run, test (like composer + artisan-ish) |
| CLR / runtime | Executes your app |
| NuGet | Packages (`dotnet add package`) |
| C# | Main language |

```bash
dotnet --version
dotnet new console -n Hi
dotnet run
```

| When | Any C# app: web, desktop, APIs, workers |
| Labs | Everything under `demos/dotnet-*` |

**.NET ≠ ASP.NET ≠ WPF** — .NET is the base; ASP.NET and WPF are **app models on top**.

---

## 3. ASP.NET (web on .NET)

**What:** **Web** framework on .NET. Today that means **ASP.NET Core** (cross-platform).

| Flavour | Use |
|---------|-----|
| **MVC** | Controllers + Razor views (Blade-like) |
| **Razor Pages** | Page-focused (simpler sites) |
| **Web API** | JSON APIs for React/Vue/mobile |
| **Blazor** | .NET-based UI (optional on job ads) |
| **Minimal APIs** | Tiny endpoint style in `Program.cs` |

```text
Browser/SPA → ASP.NET routing → Controller/API → services → DB
```

```bash
dotnet new mvc -n MySite
dotnet new webapi -n MyApi
dotnet run
```

| When | Server-rendered sites or APIs in C# |
| Lab | `demos/dotnet-mvc-crash-course` (MVC + `/api/*`) |
| Laravel cousin | routes + controllers + Blade/API Resources |

**“ASP” on old job ads** often means this family (ASP.NET). Classic ASP (1990s VBScript) is dead — ignore it.

---

## 4. WPF (Windows desktop UI)

**What:** **Windows Presentation Foundation** — desktop apps for **Windows** (not the browser). XAML for layout + C# for logic. Part of .NET (modern: .NET 6/8/10 WPF, Windows-only).

| Piece | Cousin |
|-------|--------|
| **XAML** | HTML-like markup for windows/controls |
| **code-behind** | Click handlers in `.xaml.cs` |
| **Data binding** | `{Binding Name}` ≈ Vue/React binding |
| **MVVM** | Model–View–ViewModel (like MVC for desktop) |
| **Window / UserControl** | Screens / reusable chunks |

```xml
<!-- MainWindow.xaml (sketch) -->
<Window Title="Plotline Desk">
  <StackPanel>
    <TextBlock Text="{Binding Title}" />
    <Button Content="Save" Click="OnSave" />
  </StackPanel>
</Window>
```

```csharp
// MainWindow.xaml.cs
void OnSave(object sender, RoutedEventArgs e) { /* … */ }
```

| When | Internal Windows tools, rich desktop clients, some enterprise line-of-business apps |
| When not | Web SaaS, Shopify, mobile — use React/ASP.NET instead |
| Job ads | “WPF” or “desktop” alongside C# — different track from ASP.NET web |

**Create (on Windows):**

```bash
dotnet new wpf -n MyDesktop
dotnet run
```

**vs ASP.NET / React**

| | WPF | ASP.NET | React |
|--|-----|---------|-------|
| Runs | Windows desktop | Server → browser | Browser |
| UI language | XAML | Razor / SPA | JSX |
| Deploy | Installer / MSIX | IIS / Azure / Docker | Static + API |

No WPF demo in this repo (macOS-friendly web labs only). Knowing the **name + XAML + MVVM** is enough for most web SE interviews unless the ad says desktop.

---

## 5. Python (language + typical web use)

**What:** General-purpose language. In web jobs: **APIs and scripts** more than HTML templates (though Django can do both).

| Piece | Role |
|-------|------|
| `venv` + `pip` | Isolate deps (like vendor/composer) |
| **FastAPI** | Modern JSON APIs (your lab) |
| **Django** | Full batteries-included web framework |
| **Flask** | Small/simple apps |
| pytest | Tests |

```python
# FastAPI sketch
@app.get("/api/health")
def health():
    return {"status": "ok"}
```

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn
uvicorn app.main:app --reload
```

| When | Data/scripts, AI glue, SE roles listing Python + React |
| Lab | `demos/python-react-crash-course` |
| Laravel cousin | `api.php` + FormRequest ≈ FastAPI + Pydantic |

---

## One picture

```text
                    ┌────────────┐
                    │   React    │  browser UI
                    └─────▲──────┘
                          │ HTTP JSON
         ┌────────────────┼────────────────┐
         │                │                │
    ASP.NET Core     FastAPI/Django    Node/Express
    (C# / .NET)       (Python)          (JS)
         │
    same .NET platform
         │
    ┌────┴────┐
    │  WPF    │  Windows desktop (no browser)
    └─────────┘
```

---

## Tiny “am I covered?” checklist

- [ ] React: component, props, state, effect  
- [ ] .NET: `dotnet run` / NuGet / C# app host  
- [ ] ASP.NET: MVC vs Web API vs “it’s the web stack on .NET”  
- [ ] WPF: XAML desktop on Windows; not for your Shopify/web SaaS path unless listed  
- [ ] Python: venv, FastAPI route, JSON in/out  

**Basics for all five:** yes after this skim. **Hands-on depth:** React / ASP.NET / Python yes via labs; WPF = awareness only unless you install a Windows WPF template later.
