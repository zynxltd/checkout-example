// 041 — encapsulation private field [oop]
// Run: dotnet run 041-private-field.cs

var b = new Bank(); b.Deposit(10); b.Deposit(2.5m);
Console.WriteLine(b.Balance);

class Bank {
  private decimal _bal;
  public void Deposit(decimal n) => _bal += n;
  public decimal Balance => _bal;
}
