import { MonetbilPaymentRequest } from "@/constant/types";
import axios from "axios";

export async function generatePaymentLink(
  paymentData: MonetbilPaymentRequest
): Promise<string | null> {
  try {
    const response = await axios.post(
      `https://api.monetbil.com/widget/v2.1/${paymentData.serviceKey}`,
      {
        amount: paymentData.amount,
        phone: paymentData.phone,
        phone_lock: paymentData.phoneLock || false,
        locale: paymentData.locale || "en",
        operator: paymentData.operator || "CM_MTNMOBILEMONEY",
        country: "CM",
        currency: "XAF",
        item_ref: paymentData.itemRef,
        payment_ref: paymentData.paymentRef,
        user: paymentData.user,
        first_name: paymentData.firstName,
        last_name: paymentData.lastName,
        email: paymentData.email,
        return_url: paymentData.returnUrl,
        notify_url: paymentData.notifyUrl,
        logo: paymentData.logo,
      }
    );

    if (response.data.success) {
      return response.data.payment_url;
    } else {
      console.error("Payment link generation failed:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error generating payment link:", error);
    return null;
  }
}
