"use client";

import { findCustomer } from "@/app/actions/customer";
import BillingAddresses from "@/components/customers/BillingInfosForm";
import ShippingForm from "@/components/customers/ShippingForm";
import PayPalButton from "@/components/payments/PaypalButton";
import { useUser } from "@/app/context/UserContext";
import { useState, useEffect } from "react";
import { Customer } from "@/constant/types";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer>();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [shippingAddressCheck, setShippingAddressCheck] =
    useState<boolean>(true);

  console.log(customer);

  useEffect(() => {
    async function getCustomer() {
      if (user?._id) {
        const cust = await findCustomer(user?._id as string);
        // setCustomer(cust);
      }
    }
    getCustomer();
  }, [user]);

  if (customer?.billingAddress && customer?.shippingAddress) {
    return router.push("/checkout/order_summary");
  }

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
      <h1 className="text-xl font-bold">Checkout Page</h1>
      <div>
        <BillingAddresses />
      </div>

      <div>
        <ShippingForm
          shippingAddressCheck={shippingAddressCheck}
          setShippingAddressCheck={setShippingAddressCheck}
        />
      </div>
      <PayPalButton
        amount="0.01"
        onSuccess={handleSuccess}
        onError={handleError}
      />
      {paymentStatus && <p>{paymentStatus}</p>}
      <div className="text-center">
        <button
          title="order"
          type="button"
          onClick={() => {
            customer?.billingAddress && customer?.shippingAddress
              ? router.push("/checkout/order_summary")
              : alert("Please fill in your shipping and billing address");
          }}
          className="btn border rounded-lg w-3/4 p-2"
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
