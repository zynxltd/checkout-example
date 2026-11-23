using OpenClosePrinciple.Models;

namespace OpenClosePrinciple.Interfaces
{
    public interface IPricingCalculator
    {
        decimal CalculatePrice(OrderItem item);
    }
}
