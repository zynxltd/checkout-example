using OpenClosePrinciple.InterfaceImplementation;
using OpenClosePrinciple.Interfaces;
using System.Collections.Generic;

namespace OpenClosePrinciple.Models
{
    public class Cart
    {
        private readonly List<OrderItem> _items;
        private readonly IPricingCalculator _pricingCalculator;

        public Cart() : this(new PricingCalculator())
        {
        }

        public Cart(IPricingCalculator pricingCalculator)
        {
            _pricingCalculator = pricingCalculator;
            _items = new List<OrderItem>();
        }

        public IEnumerable<OrderItem> Items
        {
            get { return _items; }
        }

        public string CustomerEmail { get; set; }

        public void Add(OrderItem orderItem)
        {
            _items.Add(orderItem);
        }

        public decimal TotalAmount()
        {
            decimal total = 0m;
            foreach (OrderItem orderItem in Items)
            {
                //LD STEP1 - whith the current implementation is possible add as much rules needed without change the code
                total += _pricingCalculator.CalculatePrice(orderItem); 
            }
            return total;
        }
    }
}
