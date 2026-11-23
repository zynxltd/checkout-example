using FivePrincipleOOP.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FivePrincipleOOP.Interfaces
{
    public interface IPaymentProcessor
    {
        void ProcessCreditCard(PaymentDetails paymentDetails, decimal amount);
    }
}
