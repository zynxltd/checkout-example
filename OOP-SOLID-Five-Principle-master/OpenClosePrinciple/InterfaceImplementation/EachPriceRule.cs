using OpenClosePrinciple.Interfaces;
using OpenClosePrinciple.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OpenClosePrinciple.InterfaceImplementation
{
    public class EachPriceRule : IPriceRule
    {
        public bool IsMatch(OrderItem item)
        {
            return item.Sku.StartsWith("EACH");
        }

        //LD STEP3
        public decimal CalculatePrice(OrderItem item)
        {
            return item.Quantity * 5m; //LD STEP3
        }
    }
}
