import { triggerNotification } from "@/app/actions/notifications";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/constant/types";

const AddToCart = ({ product }: { product: Product }) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product._id,
        name: product.productName,
        imageUrl: product.imageUrls?.[0],
        price: product.price,
        quantity: 1,
      },
    });
  };

  return (
    <button
      type="button"
      title="add to cart"
      onClick={() => {
        handleAddToCart();
        triggerNotification("A Customer Added a Product to the Cart!");
      }}
      className="border rounded-lg p-2 bg-blue-600
      hover:bg-blue-700 w-1/2 shadow-lg font-semibold
      text-pri"
    >
      Add To Cart
    </button>
  );
};

export default AddToCart;
