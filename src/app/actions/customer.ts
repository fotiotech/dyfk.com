"use server";
import Customer from "@/models/Customer";
import { connection } from "@/utils/connection";
import { redirect } from "next/navigation";

export async function findCustomer(_id: string) {
  await connection();
  if (_id) {
    const data = await Customer.findOne({ userId: _id });
    return {
      ...data.toObject(),
      _id: data._id.toString(),
      userId: data.userId.toString(),
      timestamps: data.timestamps?.toISOString(),
    };
  }
}

export async function updateBillingAddresses(_id: string, formData: FormData) {
  console.log(formData);
  if (!_id || !formData) {
    return { success: false, error: "Invalid data" };
  }

  const firstName = (formData.get("firstName") as string) || ""; // Fallback to empty string if null
  const lastName = (formData.get("lastName") as string) || "";
  const email = (formData.get("email") as string) || "";
  const phone = (formData.get("phone") as string) || "";
  const address = (formData.get("address") as string) || "";
  const city = (formData.get("city") as string) || "";
  const country = (formData.get("country") as string) || "";
  const postalCode = (formData.get("postalCode") as string) || "";
  const preferences = formData.get("preferences")
    ? (formData.get("preferences") as string).split(",")
    : []; // Assuming preferences is a comma-separated string, adjust as needed

  try {
    await connection();

    // Check if the customer exists
    let customer = await Customer.findOne({ userId: _id });

    if (customer) {
      // If customer exists, update their billing address
      customer.billingAddress = {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        postalCode,
        preferences,
      };

      // Save the updated customer
      customer = await customer.save();
    } else {
      // If customer doesn't exist, create a new customer
      customer = new Customer({
        userId: _id,
        billingAddress: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          country,
          postalCode,
          preferences,
        },
      });

      // Save the new customer
      customer = await customer.save();
    }

    return { success: true, customer }; // Return the saved/updated customer
  } catch (error: any) {
    console.error("Error updating billing address:", error);
    return { success: false, error: error.message };
  }
}

export async function updateShippingInfos(
  userId: string,
  useBillingAsShipping: boolean,
  formData: FormData
) {
  if (!userId || !formData) {
    return null;
  }
  await connection();
  // If using billing address as shipping address, retrieve billing address fields
  let shippingAddress;
  if (useBillingAsShipping) {
    const customer = await Customer.findOne({ userId });
    if (!customer) {
      throw new Error("Customer not found");
    }

    shippingAddress = {
      street: customer.billingAddress.address,
      city: customer.billingAddress.city,
      state: "", // Assuming state isn’t in billing address
      postalCode: customer.billingAddress.postalCode,
      country: customer.billingAddress.country,
      carrier: formData.get("carrier"),
      shippingMethod: formData.get("shippingMethod"),
    };
  } else {
    // Use values from formData for shipping address if not using billing address
    shippingAddress = {
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      postalCode: formData.get("postalCode"),
      country: formData.get("country"),
      carrier: formData.get("carrier"),
      shippingMethod: formData.get("shippingMethod"),
    };
  }

  try {
    const customer = await Customer.findOneAndUpdate(
      { userId },
      { $set: { shippingAddress } },
      { new: true, runValidators: true }
    );

    if (!customer) {
      throw new Error("Customer not found");
    }

    redirect("/checkout/order_summary");
  } catch (error: any) {
    console.error("Error updating shipping address:", error);
    return { success: false, error: error.message };
  }
}