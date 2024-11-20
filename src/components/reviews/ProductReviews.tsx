"use client";

import { findReviews } from "@/app/actions/review";
import { useEffect, useState } from "react";

type Review = {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  reviewText: string;
  mediaUrl: string[];
  helpfulCount: number;
  createdAt: string;
};

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (productId) {
        const response = await findReviews(productId);
        setReviews(response ?? []);
      }
    };

    fetchReviews();
  }, [productId]);

  return (
    <div className="p-2">
      <h2 className="text-lg font-semibold mb-2">Customer Reviews</h2>
      <div className="flex flex-col gap-2 ">
        {reviews.length > 0 ? (
          reviews.map((review: any) => (
            <div key={review._id}>
              <h3>{review.userId.username}</h3>
              <p>Rating: {review.rating}/5</p>
              <p>{review.reviewText}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
