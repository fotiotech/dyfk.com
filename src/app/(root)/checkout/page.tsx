"use client";

import { findCustomer } from "@/app/actions/customer";
import ShippingForm from "@/components/customers/ShippingForm";
import { useUser } from "@/app/context/UserContext";
import { useState, useEffect } from "react";
import { Customer } from "@/constant/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/cart/OrderSummary";
import { createOrder } from "@/app/actions/order";
import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/app/reducer/cartReducer";
import OrderButton from "@/components/checkout/OrderButton";

const CheckoutPage = () => {
  const { user, customerInfos } = useUser();
  const { cart } = useCart();
  const [orderNumber, setOrderNumber] = useState("");
  const [customer, setCustomer] = useState<Customer>();
  const [shippingAddressCheck, setShippingAddressCheck] =
    useState<boolean>(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [orderCreated, setOrderCreated] = useState<boolean>(false);

  useEffect(() => {
    async function customerData() {
      const customer = await findCustomer(user?._id as string);
      if (customer) {
        setCustomer(customer);
      }
    }

    customerData();
  }, [user?._id]);

  async function handleOrderData(e: React.SyntheticEvent) {
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

    if (!customer || !orderNumber) {
      return null;
    }
    const res = await createOrder(orderNumber, {
      orderNumber,
      userId: user?._id || "",
      email: customer?.billingAddress?.email || "",
      firstName: customer?.billingAddress?.firstName || "",
      lastName: customer?.billingAddress?.lastName || "",
      products: cart?.map((item) => ({
        productId: item?.id,
        name: item?.name,
        imageUrl: item?.imageUrl,
        quantity: item?.quantity,
        price: item?.price,
      })),
      subtotal: calculateTotal(cart),
      tax: 0,
      shippingCost: 0,
      total: calculateTotal(cart),
      paymentStatus: "pending",
      transactionId: Math.random().toString(36).substring(2, 8).toUpperCase(),
      paymentMethod: selectedPaymentMethod,
      shippingAddress: {
        street: customerInfos?.shippingAddress?.street || "",
        city: customerInfos?.shippingAddress?.city || "",
        state: customerInfos?.shippingAddress?.state || "",
        postalCode: customerInfos?.shippingAddress?.postalCode || "",
        country: customerInfos?.shippingAddress?.country || "",
      },
      shippingStatus: "pending",
      shippingDate: estimatedShippingDate,
      deliveryDate: estimatedDeliveryDate || "",
      orderStatus: "processing",
      notes: "",
      couponCode: "",
      discount: 0,
    });

    if (res) return setOrderCreated(true);
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
          {customerInfos ? (
            <Link
              href={`/checkout/edit_billing_addresses/${customerInfos?._id}`}
            >
              <div className="border rounded-lg p-2 cursor-pointer">
                <p>
                  {customerInfos?.billingAddress.lastName}{" "}
                  {customerInfos?.billingAddress.firstName}
                </p>
                <p>
                  {customerInfos?.billingAddress.email},{" "}
                  {customerInfos?.billingAddress.address},{" "}
                  {customerInfos?.billingAddress.city}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href={"/checkout/billing_addresses"}
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

      <div>
        <OrderButton
        orderCreated={orderCreated}
          orderNumber={orderNumber}
          handleOrderData={handleOrderData}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
