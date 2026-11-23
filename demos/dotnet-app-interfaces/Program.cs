using System;

namespace SavingInterface
{
  class Program
  {
    static void Main(string[] args)
    {
      TodoList tdl = new TodoList();
      tdl.Add("Invite friends");
      tdl.Add("Buy decorations");
      tdl.Add("Party");

      PasswordManager pm = new PasswordManager("iluvpie", true);

      // Task 8
      tdl.Display();
      pm.Display();

      // Task 12
      tdl.Reset();
      pm.Reset();
      tdl.Display();
      pm.Display();
    }
  }
}
