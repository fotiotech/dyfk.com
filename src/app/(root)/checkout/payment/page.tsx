"use client";

import { findOrders } from "@/app/actions/order";
import { useUser } from "@/app/context/UserContext";
import MonetBilPayment from "@/components/payments/MonetBilPayment";
import PaypalPayment from "@/components/payments/PaypalPayment";
import { Customer, Orders } from "@/constant/types";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PaymentPage: React.FC = () => {
  const transactionId = useSearchParams().get("transactionId");
  const [order, setOrder] = useState<Orders | null>(null);

  useEffect(() => {
    async function getOrder() {
      if (transactionId) {
        const response = await findOrders(transactionId, null);

        setOrder(response);
      }
    }
    getOrder();
  }, [transactionId]);

  let content;

  switch (order?.paymentMethod) {
    case "Mobile Money":
      content = <MonetBilPayment />;
      break;

    case "Paypal":
      content = <PaypalPayment />;
      break;

    default:
      content = <p>Invalid payment method or no payment method selected.</p>;
      break;
  }

  return (
    <div className=" p-2">
      <h2 className="text-2xl font-bold">Payment Page</h2>
      <div className="my-2 ">
        <p>
          Payment Method:{" "}
          <span className="font-semibold">{order?.paymentMethod}</span>{" "}
        </p>
      </div>

      <div className="h-screen  my-2">{content}</div>
    </div>
  );
};

export default PaymentPage;
