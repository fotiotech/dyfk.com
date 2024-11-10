// components/ShippingForm.tsx
import { updateShippingInfos } from "@/app/actions/customer";
import { useUser } from "@/app/context/UserContext";
import { useState, FormEvent } from "react";

export interface ShippingData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  carrier: string;
  shippingMethod: "standard" | "express" | "overnight";
}

const ShippingForm = ({
  shippingAddressCheck,
}: {
  shippingAddressCheck: boolean;
}) => {
  const { user } = useUser();
  const toUpdateShippingInfos = updateShippingInfos.bind(
    null,
    user?._id as string,
    shippingAddressCheck
  );

  return (
    <div>
      <form
        action={toUpdateShippingInfos}
        className={"space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow"}
      >
        {/* Address Fields */}
        <label>
          Street Address:
          <input type="text" name="street" required className="input" />
        </label>

        <label>
          City:
          <input type="text" name="city" required className="input" />
        </label>

        <label>
          State/Province:
          <input type="text" name="state" required className="input" />
        </label>

        <label>
          Postal Code:
          <input type="text" name="postalCode" required className="input" />
        </label>

        <label>
          Country:
          <input type="text" name="country" required className="input" />
        </label>

        {/* Carrier Selection */}
        <label>
          Carrier:
          <input type="text" name="carrier" required className="input" />
        </label>

        {/* Shipping Method Selection */}
        <label>
          Shipping Method:
          <select name="shippingMethod" required className="input">
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="overnight">Overnight</option>
          </select>
        </label>

        <button type="submit" className="btn w-1/2">
          Save
        </button>
      </form>
    </div>
  );
};

export default ShippingForm;
