import { updateBillingAddresses } from "@/app/actions/customer";
import { useUser } from "@/app/context/UserContext";
import React from "react";

const BillingAddresses: React.FC = () => {
  const { user } = useUser();
  const toUpdateBillingAddresses = updateBillingAddresses.bind(
    null,
    user?._id as string
  );

  console.log(toUpdateBillingAddresses);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
      <form action={toUpdateBillingAddresses}>
        <div>
          <label>First Name</label>
          <input title="firstName" type="text" name="firstName" required />
        </div>
        <div>
          <label>Last Name</label>
          <input title="lastName" type="text" name="lastName" required />
        </div>
        <div>
          <label>Email</label>
          <input title="email" type="email" name="email" required />
        </div>
        <div>
          <label>Phone</label>
          <input title="phone" type="tel" name="phone" />
        </div>
        <div>
          <label>Address</label>
          <input title="address" type="text" name="address" />
        </div>
        <div>
          <label>City</label>
          <input title="city" type="text" name="city" />
        </div>
        <div>
          <label>Country</label>
          <input title="country" type="text" name="country" />
        </div>
        <div>
          <label>Postal Code</label>
          <input title="postalCode" type="text" name="postalCode" />
        </div>
        <div>
          <label>Preferences</label>
          <input title="preferences" type="text" name="preferences" />
        </div>
        <div className="text-center">
          <button type="submit" className="btn px-10">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingAddresses;
