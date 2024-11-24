"use client";

import { updateOrderStatus } from "@/app/actions/monetbil_payment";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const transaction_id = params.get("transaction_id");
  const firstName = params.get("first_name");
  const LastName = params.get("last_name");
  const status = params.get("status");

  useEffect(() => {
    async function updatePaymentInfos() {
      await updateOrderStatus(transaction_id as string, status as string);
    }
    updatePaymentInfos();
  }, [transaction_id, status]);

  return (
    <div>
      <h1>Payment Details!</h1>
      <p>Transaction ID: {transaction_id}</p>
      <p>
        Initialized by: {firstName} {LastName}
      </p>
      <p>Payment status: {status}</p>
    </div>
  );
}
