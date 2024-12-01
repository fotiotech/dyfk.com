import { triggerNotification } from "@/app/actions/notifications";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import React from "react";

interface OrderButtonProps {
  orderCreated: boolean;
  orderNumber: string;
  handleOrderData: (e: any) => void;
}

const OrderButton: React.FC<OrderButtonProps> = ({
  orderCreated,
  orderNumber,
  handleOrderData,
}) => {
  const { user } = useUser();

  return (
    <div className="text-center">
      {orderNumber && (
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
            href={
              orderCreated ? `/checkout/payment?orderNumber=${orderNumber}` : ""
            }
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
