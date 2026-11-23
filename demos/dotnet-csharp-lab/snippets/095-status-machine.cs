// 095 — status enum machine [oop]
// Run: dotnet run 095-status-machine.cs

Status Next(Status s) => s switch {
  Status.Booked => Status.Ready,
  Status.Ready => Status.Collected,
  _ => s
};
Console.WriteLine(Next(Status.Booked));
Console.WriteLine(Next(Status.Ready));

enum Status { Booked, Ready, Collected }
