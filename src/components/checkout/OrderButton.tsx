import { triggerNotification } from "@/app/actions/notifications";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import React from "react";

interface OrderButtonProps {
  transactionId: number;
  handleOrderData: (e: any) => void;
}

const OrderButton: React.FC<OrderButtonProps> = ({
  transactionId,
  handleOrderData,
}) => {
  const { user } = useUser();

  return (
    <div className="text-center">
      {transactionId && (
        <div
          onClick={(e) => {
            handleOrderData(e);
            triggerNotification(
              user?._id as string,
              "Customer Placed an Order!"
            );
          }}
        >
          <Link
            href={`/checkout/payment?transactionId=${transactionId}`}
            passHref
          >
            <button
              title="Place Order"
              type="button"
              className="btn border rounded-2xl w-full p-2 text-white font-bold"
            >
              Place Order
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderButton;
