'use client'
// pages/checkout.tsx
import PayPalButton from '@/components/payments/PaypalButton';
import { useState } from 'react';

const CheckoutPage = () => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const handleSuccess = (details: any) => {
    setPaymentStatus('Payment successful! Transaction completed by ' + details.payer.name.given_name);
  };

  const handleError = (error: any) => {
    setPaymentStatus('Payment failed! ' + error);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <PayPalButton amount="0.01" onSuccess={handleSuccess} onError={handleError} />
      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
};

export default CheckoutPage;
