// 046 — depend on interface (DIP) [oop]
// Run: dotnet run 046-dependency-iface.cs

string Stamp(IClock c) => c.Now.ToString("HH:mm");
Console.WriteLine(Stamp(new FixedClock(new DateTimeOffset(2026,1,1,15,30,0,TimeSpan.Zero))));

interface IClock { DateTimeOffset Now { get; } }

class FixedClock(DateTimeOffset at) : IClock { public DateTimeOffset Now => at; }
