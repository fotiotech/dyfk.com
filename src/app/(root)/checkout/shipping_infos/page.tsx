"use client";
import ShippingForm from "@/components/customers/ShippingForm";
import React, { useState } from "react";

const ShippingInfos = () => {
  const [shippingAddressCheck, setShippingAddressCheck] =
    useState<boolean>(true);
  return (
    <div>
      <h2 >Shipping Infos</h2>
      <ShippingForm shippingAddressCheck={shippingAddressCheck} />
    </div>
  );
};

export default ShippingInfos;