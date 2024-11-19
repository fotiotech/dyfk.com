import { triggerNotification } from "@/app/page";
import Link from "next/link";
import React from "react";

interface OrderButtonProps {
  orderNumber: string | null;
  transactionId: number;
  setTransactionId: React.Dispatch<React.SetStateAction<number>>;
  handleOrderData: (e: any) => void;
}

const OrderButton: React.FC<OrderButtonProps> = ({
  orderNumber,
  transactionId,
  setTransactionId,
  handleOrderData,
}) => {
  const handlePlaceOrder = (e: React.SyntheticEvent) => {
    setTransactionId(Math.floor(Math.random() * 1000000)); // Update transactionId safely
    handleOrderData(e); // Call the order handler before navigation
  };

  console.log(transactionId);

  return (
    <div className="text-center">
      {orderNumber ? (
        <div onClick={handlePlaceOrder}>
          <Link href={`/checkout/payment?orderNumber=${orderNumber}`} passHref>
            <button
              title="Place Order"
              type="button"
              onClick={() => triggerNotification("Customer Placed an Order!")}
              className="btn border rounded-2xl w-full p-2 text-white font-bold"
            >
              Place Order
            </button>
          </Link>
        </div>
      ) : (
        <p>Order number is missing</p>
      )}
    </div>
  );
};

export default OrderButton;
