// TASK 10: Object initializers
// Docs: Object initializers
// Run:  dotnet run 10-object-initializer.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: db.example.com:5432 (SSL: True)

class ConnectionOptions
{
    public string Host { get; init; } = "localhost";
    public int Port { get; init; } = 80;
    public bool UseSsl { get; init; }
}

class Program
{
    static void Main()
    {
        var options = new ConnectionOptions { Host = "db.example.com", Port = 5432, UseSsl = true };
        Console.WriteLine($"{options.Host}:{options.Port} (SSL: {options.UseSsl})");
    }
}
