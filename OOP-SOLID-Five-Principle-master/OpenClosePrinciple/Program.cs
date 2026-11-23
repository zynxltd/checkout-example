

using OpenClosePrinciple.Models;
using System;

namespace OpenClosePrinciple
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            Cart carrello = new Cart();
            carrello.Add(new OrderItem() { Quantity = 500, Sku = "WEIGHT_PEANUTS" });
            var luca= carrello.TotalAmount();
        }
    }
}