using System;
using System.Collections.Generic;
using System.Text;
using OpenClosePrinciple.Models;

namespace OpenClosePrinciple.Interfaces
{
    public interface IPriceRule
    {
        bool IsMatch(OrderItem item);
        decimal CalculatePrice(OrderItem item);
    }
}
