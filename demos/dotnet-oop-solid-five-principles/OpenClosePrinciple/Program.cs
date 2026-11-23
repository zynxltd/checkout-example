using OpenClosePrinciple.Models;
using System;

namespace OpenClosePrinciple
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Open/Closed Principle — cart pricing demo");

            var cart = new Cart();
            cart.Add(new OrderItem { Quantity = 500, Sku = "WEIGHT_PEANUTS" });

            var total = cart.TotalAmount();
            Console.WriteLine($"Items: 1 × WEIGHT_PEANUTS (qty 500)");
            Console.WriteLine($"Total: {total}");
        }
    }
}
