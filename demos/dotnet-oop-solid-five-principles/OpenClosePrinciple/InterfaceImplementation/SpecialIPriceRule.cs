using OpenClosePrinciple.Interfaces;
using OpenClosePrinciple.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OpenClosePrinciple.InterfaceImplementation
{
    public class SpecialPriceRule : IPriceRule
    {
        public bool IsMatch(OrderItem item)
        {
            return item.Sku.StartsWith("SPECIAL");
        }

        //LD STEP3
        public decimal CalculatePrice(OrderItem item)
        {
            decimal total = 0m;
            // $0.40 each; 3 for a $1.00
            total += item.Quantity * .4m;
            int setsOfThree = item.Quantity / 3;
            total -= setsOfThree * .2m;
            return total;
        }
    }
}
