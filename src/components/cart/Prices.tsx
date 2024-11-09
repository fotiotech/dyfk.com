import { CartItem } from "@/app/reducer/cartReducer";

export function Prices({ amount }: { amount: number }) {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
  }).format(amount);
}

export const TotalPrice = ({ cart }: { cart: CartItem[] }) => {
  const amount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return <Prices amount={amount} />;
};
