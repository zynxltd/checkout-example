# C# classes — runnable tasks (Microsoft Learn)

Doc: [C# classes](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/classes)
Focus: [Create objects](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/classes#create-objects)

## Run options

### A) Local (recommended)
```bash
cd demos/dotnet-csharp-lab/mslearn-classes
dotnet run 01-declare-class.cs
dotnet run 03-reference-share.cs
./run-all.sh
```

### B) [.NET Fiddle](https://dotnetfiddle.net/)
1. Open https://dotnetfiddle.net/ → **C#**
2. Delete the default code
3. Paste the **entire** `.cs` file (including `Program.Main`)
4. Click **Run** — output should match **Expect**

## Checklist

- [ ] `01-declare-class.cs` — **Declare a class** · Declare a class · expect `Allison`
- [ ] `02-create-object.cs` — **Create objects with new** · Create objects · expect `Allison`
- [ ] `03-reference-share.cs` — **Assignment copies reference** · Create objects · expect `Hopper`
- [ ] `04-class-vs-struct.cs` — **Struct assignment copies values** · Create objects vs structs · expect `a.X=1 b.X=99`
- [ ] `05-field-initializer.cs` — **Field initializers** · Constructors and initialization · expect `10`
- [ ] `06-ctor-params.cs` — **Constructor parameters** · Constructors and initialization · expect `25`
- [ ] `07-primary-ctor.cs` — **Primary constructor** · Constructors and initialization · expect `40`
- [ ] `08-required-props.cs` — **Required properties** · Constructors and initialization · expect `Grace Hopper`
- [ ] `09-static-class.cs` — **Static class** · Static classes · expect `Circumference: 31.42`
- [ ] `10-object-initializer.cs` — **Object initializers** · Object initializers · expect `db.example.com:5432 (SSL: True)`
- [ ] `11-collection-expr.cs` — **Collection expression** · Object initializers · expect `Rose,Herb,Soil`
- [ ] `12-inheritance.cs` — **Inheritance** · Inheritance · expect `Satya manages Engineering`
- [ ] `13-virtual-override.cs` — **virtual / override** · Inheritance · expect `woof`
- [ ] `14-init-only.cs` — **init-only property** · Object initializers · expect `LOT-ROSE`
- [ ] `15-shared-ref-practice.cs` — **GreenShelf shared reference** · Create objects practice · expect `sam+club@yg.test`
- [ ] `16-options-practice.cs` — **GreenShelf options initializer** · Object initializers practice · expect `60/30`
- [ ] `17-primary-lot.cs` — **GreenShelf primary ctor lot** · Primary constructors practice · expect `LOT-1 reserve=18 high=20`
- [ ] `18-math-static.cs` — **Use BCL static class Math** · Static classes · expect `9`

## Done when

You can say out loud:
- `new` creates an instance; class vars hold **references**
- `c2 = c1` shares identity (mutate via either name)
- structs **copy** on assign
- field init / ctor / primary ctor / required / object initializer / static / inheritance
