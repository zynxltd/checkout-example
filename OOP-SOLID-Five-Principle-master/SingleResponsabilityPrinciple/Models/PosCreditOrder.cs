using FivePrincipleOOP.InterfaceImplementation;
using FivePrincipleOOP.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace FivePrincipleOOP.Models
{
    public class PoSCreditOrder : Order
    {
        private readonly PaymentDetails _paymentDetails;
        private readonly IPaymentProcessor _paymentProcessor;

        public PoSCreditOrder(Cart cart, PaymentDetails paymentDetails)
            : base(cart)
        {
            _paymentDetails = paymentDetails;
            _paymentProcessor = new PaymentProcessor();
        }

        public override void Checkout()
        {
            _paymentProcessor.ProcessCreditCard(_paymentDetails, _cart.TotalAmount);

            base.Checkout();
        }
    }
}
