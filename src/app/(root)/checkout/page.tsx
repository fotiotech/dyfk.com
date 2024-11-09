"use client";

import { findCustomer } from "@/app/actions/customer";
import ShippingForm from "@/components/customers/ShippingForm";
import PayPalButton from "@/components/payments/PaypalButton";
import { useUser } from "@/app/context/UserContext";
import { useState, useEffect } from "react";
import { Customer } from "@/constant/types";
import Link from "next/link";
import { useRouter } from "next/router";
import OrderSummary from "@/components/cart/OrderSummary";

const CheckoutPage = () => {
  const { user } = useUser();
  const [customer, setCustomer] = useState<Customer>();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [shippingAddressCheck, setShippingAddressCheck] =
    useState<boolean>(true);

  useEffect(() => {
    async function getCustomer() {
      if (user?._id) {
        const cust = await findCustomer(user?._id as string);
        setCustomer(cust);
      }
    }
    getCustomer();
  }, [user?._id]);

  console.log(customer?.billingAddress);

  const handleSuccess = (details: any) => {
    setPaymentStatus(
      "Payment successful! Transaction completed by " +
        details.payer.name.given_name
    );
  };

  const handleError = (error: any) => {
    setPaymentStatus("Payment failed! " + error);
  };

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold">Checkout Page</h1>
      <ul className="flex flex-col gap-3 my-2">
        <li>
          <p className="font-bold">Order Summary</p>
          <OrderSummary />
        </li>
        <li>
          <div>
            <p className="text-md font-semibold">Billing Address</p>
            {customer ? (
              <Link href={`/profile/edit_billing_addresses/${customer._id}`}>
                <div className="border rounded-lg p-2 cursor-pointer">
                  <p className=" line-clamp-1">
                    {customer.billingAddress.lastName}{" "}
                    {customer.billingAddress.firstName}
                  </p>
                  <p className=" line-clamp-1">
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
        </li>
        <li>
          <div>
            <p className="text-md font-semibold">Shipping Information</p>
            <div className="flex gap-2 items-center border rounded-lg p-2 cursor-pointer">
              <p>Same as Billing address?</p>
              <Link
                href={!shippingAddressCheck ? "/profile/shipping_infos" : ""}
              >
                <input
                  title="shippingAddressCheck"
                  type="checkbox"
                  name="shippingAddressCheck"
                  checked={shippingAddressCheck}
                  onChange={(e) => setShippingAddressCheck(e.target.checked)}
                />
              </Link>
            </div>
          </div>
        </li>
        <li>
          <p className="text-md font-semibold">Payment Method</p>
          <ul className="flex flex-col gap-2 border rounded-lg p-2 cursor-pointer">
            <li className="flex justify-between items-center border-b pb-1">
              <p>Monetbil (Mobile Money)</p>{" "}
              <input title="check" type="checkbox" name="" id="" />
            </li>
            <li className="flex justify-between items-center border-b pb-1">
              <p>Paypal</p>
              <input title="check" type="checkbox" name="" id="" />
            </li>
            <li className="flex justify-between items-center border-b pb-1">
              <p>Credit Card</p>
              <input title="check" type="checkbox" name="" id="" />
            </li>
          </ul>
        </li>
      </ul>

      {/* <PayPalButton
        amount="0.01"
        onSuccess={handleSuccess}
        onError={handleError}
      />
      {paymentStatus && <p>{paymentStatus}</p>} */}
      <div className="text-center">
        <button
          title="order"
          type="button"
          className="btn border rounded-lg w-3/4 p-2 text-white font-bold"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
