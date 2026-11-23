using FivePrincipleOOP.Interfaces;
using FivePrincipleOOP.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FivePrincipleOOP.InterfaceImplementation
{
    public class ReservationService : IReservationService
    {
        public void ReserveInventory(IEnumerable<OrderItem> items)
        {
            throw new NotImplementedException();
        }
    }
}
