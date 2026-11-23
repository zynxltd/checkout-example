// TASK 15: GreenShelf shared reference
// Docs: Create objects practice
// Run:  dotnet run 15-shared-ref-practice.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: sam+club@yg.test

class Member
{
    public string Email { get; set; }
    public Member(string email) => Email = email;
}

class Program
{
    static void Main()
    {
        var m1 = new Member("sam@yg.test");
        var m2 = m1;
        m2.Email = "sam+club@yg.test";
        Console.WriteLine(m1.Email);
    }
}
