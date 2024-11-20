"use client"

import {  useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const transaction_id = params.get("transaction_id");
  const amount = params.get("amount");

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Transaction ID: {transaction_id}</p>
      <p>Amount Paid: {amount}</p>
    </div>
  );
}
