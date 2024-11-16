import { updateBillingAddresses } from "@/app/actions/customer";
import { useUser } from "@/app/context/UserContext";
import React from "react";

const BillingAddresses: React.FC = () => {
  const { user } = useUser();
  const { customerInfos } = useUser();
  const toUpdateBillingAddresses = updateBillingAddresses.bind(
    null,
    user?._id as string
  );

  const billingAddress = customerInfos?.billingAddress;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
      <form action={toUpdateBillingAddresses}>
        <div>
          <label>First Name</label>
          <input
            title="firstName"
            type="text"
            name="firstName"
            defaultValue={billingAddress?.firstName}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            title="lastName"
            type="text"
            name="lastName"
            defaultValue={billingAddress?.lastName}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            title="email"
            type="email"
            name="email"
            defaultValue={billingAddress?.email}
            required
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            title="phone"
            type="tel"
            name="phone"
            defaultValue={billingAddress?.phone}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            title="address"
            type="text"
            name="address"
            defaultValue={billingAddress?.address}
          />
        </div>
        <div>
          <label>City</label>
          <input
            title="city"
            type="text"
            name="city"
            defaultValue={billingAddress?.city}
          />
        </div>
        <div>
          <label>Country</label>
          <input
            title="country"
            type="text"
            name="country"
            defaultValue={billingAddress?.country}
          />
        </div>
        <div>
          <label>Postal Code</label>
          <input
            title="postalCode"
            type="text"
            name="postalCode"
            defaultValue={billingAddress?.postalCode}
          />
        </div>
        <div>
          <label>Preferences</label>
          <input
            title="preferences"
            type="text"
            name="preferences"
            defaultValue={billingAddress?.preferences}
          />
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
