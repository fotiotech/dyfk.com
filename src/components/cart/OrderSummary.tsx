import { useCart } from "@/app/context/CartContext";
import { Prices, TotalPrice } from "@/components/cart/Prices";
import { useState, useEffect } from "react";

const OrderSummary = ({
  setOrderNumber,
}: {
  setOrderNumber: (num: string) => void;
}) => {
  const { cart } = useCart();
  const [ordNumber, setOrdNumber] = useState("");

  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString(); // Current timestamp in milliseconds
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random alphanumeric string
    return `ORD${timestamp}${randomStr}`;
  };

  useEffect(() => {
    if (cart && cart.length > 0) {
      const orderNumber = generateOrderNumber();
      setOrdNumber(orderNumber);
      setOrderNumber(orderNumber);
    }
  }, [cart, setOrderNumber]); // Runs on component mount or when cart changes

  return (
    <div className="border rounded-lg p-2">
      <p>Order number: {ordNumber}</p>
      <ul>
        {cart &&
          cart.map((items) => (
            <li key={items.id} className="flex justify-between">
              <div>
                <p>{items.name}</p>
                {items.quantity > 1 && (
                  <div className="">
                    <p>Quantity: {items.quantity}</p>
                    <p>
                      Subtotal: <Prices amount={items.price * items.quantity} />
                    </p>
                  </div>
                )}
              </div>
              <div className=" ">
                <p className="font-bold">
                  <Prices amount={items.price} />
                </p>
              </div>
            </li>
          ))}
      </ul>
      <div>
        Total Prices:{" "}
        <span className="text-lg font-bold mr-1">
          <TotalPrice cart={cart} />
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
