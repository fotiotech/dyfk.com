"use client";

import { findProductDetails } from "@/app/actions/products";
import { useUser } from "@/app/context/UserContext";
import Loading from "@/app/loading";
import AddToCart from "@/components/AddToCart";
import CheckoutButton from "@/components/CheckoutButton";
import DetailImages from "@/components/DetailImages";
import { Prices } from "@/components/cart/Prices";
import ProductReviews from "@/components/reviews/ProductReviews";
import ReviewForm from "@/components/reviews/ReviewForm";
import { Product } from "@/constant/types";
import { LocationOn } from "@mui/icons-material";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DetailsPage = ({
  params,
}: {
  params: { slug: string; dsin: string };
}) => {
  const { customerInfos } = useUser();
  const [details, setDetails] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getDetails() {
      setIsLoading(true);
      try {
        if (params.dsin) {
          const response = await findProductDetails(params.dsin);
          setDetails(response);
        } else {
          console.warn("DSIN is undefined, skipping fetch.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false); // Always reset loading state
      }
    }
    getDetails();
  }, [params.dsin]);

  const brand =
    typeof details?.brand_id === "object"
      ? { _id: details?.brand_id?._id, name: details?.brand_id?.name }
      : null;

  return (
    <div className="relative w-full bg-gray-100 overflow-hidden">
      <NextSeo
        title={`${details?.productName} | dyfkCameroun.com E-Commerce Store in Cameroun`}
        description={
          details?.description ??
          "Find the best products at dyfk.com. Shop now for quality and value."
        }
        canonical={`https://dyfk-com.vercel.app/${details?.url_slug}/details/${params.dsin}`}
        openGraph={{
          title: details?.productName,
          description:
            details?.description ??
            "Explore high-quality products and unbeatable prices.",
          url: `https://dyfk-com.vercel.app/${details?.url_slug}/details/${params.dsin}`,
          images: details?.imageUrls?.map((imageUrl) => ({
            url: imageUrl,
            width: 800,
            height: 600,
            alt: details?.productName ?? "Product image",
          })),
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <div className="flex flex-col xl:flex-row bg-white">
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <div
            key={details?._id?.toString()}
            className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-3"
          >
            {/* Product Images */}
            <div>
              <div className="lg:hidden mb-4">
                <h1 className="text-xl font-semibold">
                  {details?.productName}
                </h1>
                <Link
                  href={`/brandStore?brandId=${brand?._id}`}
                  className="text-blue-600 text-sm underline"
                >
                  Visit {brand?.name} Store
                </Link>
              </div>
              <DetailImages file={details?.imageUrls} />
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-6">
              <div className="text-2xl font-bold text-gray-800">
                <Prices amount={details?.finalPrice as number} />
              </div>
              {details?.attributes?.length! > 0 && (
                <div>
                  {details?.attributes
                    ?.filter(
                      (attributeGroup) => attributeGroup.groupName === "general"
                    )
                    .map((attributeGroup, groupIndex) => (
                      <div key={groupIndex} className="mb-4">
                        {Array.from(attributeGroup.attributes as any)
                          .filter(
                            ([attributeName]: any) =>
                              attributeName !== "_id" && attributeName !== "0"
                          )
                          .map(([attributeName, attributeValues]: any, idx) => (
                            <div
                              key={`${attributeName}-${idx}`}
                              className="flex gap-10 border-b pb-2 text-sm"
                            >
                              <strong>{attributeName}</strong>
                              <span>
                                {Array.isArray(attributeValues)
                                  ? attributeValues.join(", ")
                                  : attributeValues}
                              </span>
                            </div>
                          ))}
                      </div>
                    ))}
                </div>
              )}
              {customerInfos && (
                <Link href="/checkout/billing_address">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <LocationOn />
                    <span>
                      Shipping to {customerInfos?.billingAddress.lastName},{" "}
                      {customerInfos?.shippingAddress.city}
                    </span>
                  </div>
                </Link>
              )}
              <div className="flex gap-4">
                <CheckoutButton width="full" height="12">
                  Check Out
                </CheckoutButton>
                {details && <AddToCart product={details} />}
              </div>
              <div>
                {details?.stockQuantity! > 0 ? (
                  <p className="text-green-600">In Stock</p>
                ) : (
                  <p className="text-red-500">Order this Item</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="p-3">
          {details?.attributes?.length! > 0 && (
            <div>
              {details?.attributes?.map((attributeGroup, groupIndex) => (
                <div key={groupIndex} className="mb-4">
                  {Array.from(attributeGroup.attributes as any)
                    .filter(
                      ([attributeName]: any) =>
                        attributeName !== "_id" && attributeName !== "0"
                    )
                    .map(([attributeName, attributeValues]: any, idx) => (
                      <div
                        key={`${attributeName}-${idx}`}
                        className="grid grid-cols-2 pb-2 text-sm"
                      >
                        <strong>{attributeName}</strong>
                        <span>
                          {Array.isArray(attributeValues)
                            ? attributeValues.join(", ")
                            : attributeValues}
                        </span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="xl:w-1/4 bg-gray-50 p-6">
          <h2 className="font-bold text-lg xl:text-2xl mb-4">
            Items in Your Cart
          </h2>
          {/* Cart items could go here */}
        </div>
      </div>

      {/* Product Gallery */}
      <div className="py-8 px-6">
        <h2 className="text-lg font-semibold mb-4">Product Gallery</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {details?.imageUrls?.map((image, idx) => (
            <Image
              key={idx}
              src={image}
              alt="Product image"
              width={500}
              height={500}
              className="rounded-md shadow-md"
            />
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="p-6 border-t">
        <ReviewForm productId={details?._id as string} />
        <ProductReviews productId={details?._id as string} />
      </div>
    </div>
  );
};

export default DetailsPage;
