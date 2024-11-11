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
  const handlePlaceOrder = (e: any) => {
    setTransactionId((prevId) => prevId + 1); // Update transactionId safely
    handleOrderData(e); // Call the order handler before navigation
  };

  console.log(transactionId);

  return (
    <div className="text-center">
      {orderNumber ? (
        <Link href={`/payment?orderNumber=${orderNumber}`} passHref>
          <button
            title="Place Order"
            type="button"
            onClick={handlePlaceOrder}
            className="btn border rounded-2xl w-full p-2 text-white font-bold"
          >
            Place Order
          </button>
        </Link>
      ) : (
        <p>Order number is missing</p>
      )}
    </div>
  );
};

export default OrderButton;
