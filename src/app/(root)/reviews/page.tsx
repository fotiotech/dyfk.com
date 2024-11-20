"use client";

import ProductReviews from "@/components/reviews/ProductReviews";
import { useSearchParams } from "next/navigation";

export default function ProductReviewPage() {
  const productId = useSearchParams().get("productId");

  return (
    <div>
      <ProductReviews productId={productId as string} />
    </div>
  );
}
