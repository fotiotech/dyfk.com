import { useRouter } from "next/router";

export default function PaymentSuccess() {
  const router = useRouter();
  const { transaction_id, amount } = router.query;

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Transaction ID: {transaction_id}</p>
      <p>Amount Paid: {amount}</p>
    </div>
  );
}
