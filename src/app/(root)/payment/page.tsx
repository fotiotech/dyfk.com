"use client";

import { findOrders } from "@/app/actions/order";
import { useUser } from "@/app/context/UserContext";
import PaypalPayment from "@/components/payments/PaypalPayment";
import { Customer, Orders } from "@/constant/types";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PaymentPage = () => {
  const { user } = useUser();
  const orderNumber = useSearchParams().get("orderNumber")?.toLowerCase();
  const [method, setMethod] = useState<string>("");
  const [order, setOder] = useState<Orders>();

  useEffect(() => {
    async function getOrder() {
      if (orderNumber) {
        const response = await findOrders(orderNumber);
        setOder(response);
      }
    }
    getOrder();
  }, [orderNumber]);

  let content;

  switch (order?.paymentMethod) {
    case "Mobile Money":
      content = <PaypalPayment />;
      break;

    default:
      break;
  }
  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold">Payment Page</h2>
      <p>Order Number: {orderNumber}</p>
      <div className="my-2">{content}</div>
    </div>
  );
};

export default PaymentPage;
