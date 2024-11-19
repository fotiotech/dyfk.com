import { useRouter } from 'next/router';

export default function PaymentFailed() {
  const router = useRouter();
  const { transaction_id } = router.query;

  return (
    <div>
      <h1>Payment Failed!</h1>
      <p>Transaction ID: {transaction_id}</p>
      <p>Please try again or contact support.</p>
    </div>
  );
}
