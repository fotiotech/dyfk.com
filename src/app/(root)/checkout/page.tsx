"use client";

import { findCustomer } from "@/app/actions/customer";
import ShippingForm from "@/components/customers/ShippingForm";
import PayPalButton from "@/components/payments/PaypalButton";
import { useUser } from "@/app/context/UserContext";
import { useState, useEffect } from "react";
import { Customer } from "@/constant/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/cart/OrderSummary";
import { createOrder } from "@/app/actions/order";
import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/app/reducer/cartReducer";

const CheckoutPage = () => {
  const { user } = useUser();
  const { cart } = useCart();
  const [customer, setCustomer] = useState<Customer>();
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [shippingAddressCheck, setShippingAddressCheck] =
    useState<boolean>(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const router = isClient ? useRouter() : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function getCustomer() {
      if (user?._id) {
        const cust = await findCustomer(user._id);
        setCustomer(cust);
      }
    }
    getCustomer();
  }, [user?._id]);

  const handleSuccess = (details: any) => {
    setPaymentStatus(
      "Payment successful! Transaction completed by " +
        details.payer.name.given_name
    );
  };

  const handleError = (error: any) => {
    setPaymentStatus("Payment failed! " + error);
  };

  async function handleOrderData(e: any) {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      return null;
    }

    const processingDays = 3;
    const transitDays = 5;
    const orderDate = new Date();
    const estimatedShippingDate = new Date(orderDate);
    estimatedShippingDate.setDate(orderDate.getDate() + processingDays);

    const estimatedDeliveryDate = new Date(estimatedShippingDate);
    estimatedDeliveryDate.setDate(
      estimatedShippingDate.getDate() + transitDays
    );

    await createOrder(orderNumber, {
      orderNumber,
      userId: user?._id,
      products: cart?.map((item) => ({
        productId: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: calculateTotal(cart),
      tax: 0,
      shippingCost: 0,
      total: calculateTotal(cart),
      paymentStatus: "pending",
      paymentMethod: selectedPaymentMethod,
      transactionId: "",
      shippingAddress: {
        street: customer?.shippingAddress?.street || "",
        city: customer?.shippingAddress?.city || "",
        state: customer?.shippingAddress?.state || "",
        postalCode: customer?.shippingAddress?.postalCode || "",
        country: customer?.shippingAddress?.country || "",
      },
      shippingStatus: "pending",
      shippingDate: estimatedShippingDate,
      deliveryDate: estimatedDeliveryDate,
      orderStatus: "processing",
      notes: "",
      couponCode: "",
      discount: 0,
    });

    if (router) {
      router.push("/payment");
    }
  }

  const calculateTotal = (cartItems: any) => {
    // Assuming each cart item has a `price` and `quantity` property
    return cartItems.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold">Checkout Page</h1>
      <div>
        <p className="font-bold">Products Summary</p>
        <OrderSummary setOrderNumber={setOrderNumber} />
      </div>

      <div className="flex flex-col gap-3 my-2">
        <div>
          <p className="font-bold">Billing Address</p>
          {customer ? (
            <Link href={`/profile/edit_billing_addresses/${customer._id}`}>
              <div className="border rounded-lg p-2 cursor-pointer">
                <p>
                  {customer.billingAddress.lastName}{" "}
                  {customer.billingAddress.firstName}
                </p>
                <p>
                  {customer.billingAddress.email},{" "}
                  {customer.billingAddress.address},{" "}
                  {customer.billingAddress.city}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href={"/profile/billing_addresses"}
              className="p-2 rounded-lg cursor-pointer"
            >
              <p>Complete Billing Address</p>
            </Link>
          )}
        </div>

        <div>
          <p className="font-bold">Shipping Information</p>
          <div className="flex items-center gap-3">
            <span> Same as Billing address?</span>
            <input
              title="check"
              type="checkbox"
              checked={shippingAddressCheck}
              onChange={(e) => setShippingAddressCheck(e.target.checked)}
            />
          </div>

          {!shippingAddressCheck && (
            <ShippingForm shippingAddressCheck={shippingAddressCheck} />
          )}
        </div>

        <div>
          <p className="font-bold">Payment Method</p>
          <div className="my-2">
            <label
              className="flex gap-3 justify-between
            border-b text-gray-800"
            >
              Monetbil (Mobile Money)
              <input
                type="radio"
                name="paymentMethod"
                value="Mobile Money"
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />
            </label>
            <label
              className="flex gap-3 justify-between
            border-b text-gray-800"
            >
              PayPal
              <input
                type="radio"
                name="paymentMethod"
                value="Paypal"
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />
            </label>
            <label
              className="flex gap-3 justify-between
            border-b text-gray-800"
            >
              Credit Card
              <input
                type="radio"
                name="paymentMethod"
                value="Credit Card"
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* PayPal button example, uncomment if needed */}
      {/* <PayPalButton amount="0.01" onSuccess={handleSuccess} onError={handleError} /> */}
      {/* {paymentStatus && <p>{paymentStatus}</p>} */}
      <div className="text-center">
        <button
          title="place order"
          type="button"
          onClick={handleOrderData}
          className="btn border rounded-2xl w-full p-2 text-white font-bold"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
