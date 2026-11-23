using System;
using System.Collections.Generic;
using System.Text;

namespace FivePrincipleOOP.Models
{
    public class PoSCashOrder : Order
    {
        public PoSCashOrder(Cart cart)
            : base(cart)
        {
        }
    }
}
