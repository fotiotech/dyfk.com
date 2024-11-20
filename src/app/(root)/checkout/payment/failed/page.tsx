"use client"

import { useSearchParams } from "next/navigation";

export default function PaymentFailed() {
  const params = useSearchParams();
  const transaction_id = params.get("transaction_id");

  return (
    <div>
      <h1>Payment Failed!</h1>
      <p>Transaction ID: {transaction_id}</p>
      <p>Please try again or contact support.</p>
    </div>
  );
}
