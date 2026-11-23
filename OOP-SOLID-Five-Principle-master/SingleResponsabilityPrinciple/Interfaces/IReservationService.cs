using FivePrincipleOOP.InterfaceImplementation;
using FivePrincipleOOP.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FivePrincipleOOP.Interfaces
{
    public interface IReservationService
    {
        void ReserveInventory(IEnumerable<OrderItem> items);
    }
}
