using System;
using System.Collections.Generic;
using System.Text;

namespace FivePrincipleOOP.Models
{
    public class Cart
    {
        public decimal TotalAmount { get; set; }
        public IEnumerable<OrderItem> Items { get; set; }

        public string CustomerEmail { get; set; }
    }
}
