using FivePrincipleOOP.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FivePrincipleOOP.Interfaces
{
    internal interface INotificationService
    {
        void NotifyCustomerOrderCreated(Cart cart);
    }
}
