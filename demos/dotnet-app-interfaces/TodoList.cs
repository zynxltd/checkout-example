using System;

namespace SavingInterface
{
  class TodoList : IDisplayable, IResetable
  {
    public string[] Todos
    { get; private set; }

    private int nextOpenIndex;

    public TodoList()
    {
      Todos = new string[5];
      nextOpenIndex = 0;
    }

    public void Add(string todo)
    {
      if (nextOpenIndex < 5)
      {
        Todos[nextOpenIndex] = todo;
        nextOpenIndex++;
      }
    }

    public void Display()
    {
      foreach (string todo in Todos)
      {
        Console.WriteLine(todo);
      }
    }

    public void Reset()
    {
      Todos = new string[5];
      nextOpenIndex = 0;
    }
  }
}
