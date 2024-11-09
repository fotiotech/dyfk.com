"use client";

import Loading from "@/app/loading";
import AddToCart from "@/components/AddToCart";
import CheckoutButton from "@/components/CheckoutButton";
import DetailImages from "@/components/DetailImages";
import {Prices} from "@/components/cart/Prices";
import { Product } from "@/constant/types";
import { getProductDetail } from "@/fetch/products";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const RenderAttribute = ({
  keyName,
  value,
}: {
  keyName: string;
  value: any;
}) => {
  return (
    <div className="flex flex-col ml-2">
      <strong>{keyName}:</strong>
      {typeof value === "object" && !Array.isArray(value) && value !== null ? (
        <div className="ml-4">
          {Object.entries(value).map(([nestedKey, nestedValue]) => (
            <RenderAttribute
              key={nestedKey}
              keyName={nestedKey}
              value={nestedValue}
            />
          ))}
        </div>
      ) : Array.isArray(value) ? (
        value.map((item, index) => (
          <RenderAttribute
            key={index}
            keyName={`${keyName} ${index + 1}`}
            value={item}
          />
        ))
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
};

const DetailsPage = ({
  params,
}: {
  params: { slug: string; dsin: string };
}) => {
  const { data: details, isLoading } = useQuery<Product>({
    queryKey: ["new-Arrival"],
    queryFn: () => getProductDetail(params.dsin),
  });

  return (
    <div className="relative w-full overflow-hidden bg-[#efefef]">
      <div className="xl:flex w-full bg-white lg:px-10">
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <div
            key={details?._id}
            className="xl:flex-1 lg:grid grid-cols-2 gap-6 relative"
          >
            <div>
              <div className="p-2 lg:hidden">
                <p className="lg:m-3 m-1 font-medium font-sans">
                  {details?.productName}
                </p>
              </div>
              <DetailImages file={details?.imageUrls} />
            </div>

            <div className="flex flex-col gap-2 p-2 lg:p-0">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-xl">
                  <Prices amount={details?.price as number} />
                </span>
              </div>

              <div className="flex justify-between items-center gap-3 w-full py-2">
                <CheckoutButton width="1/2" height="10">
                  Check Out
                </CheckoutButton>
                {details && <AddToCart product={details} />}
              </div>

              <div>
                <h3>Details</h3>
                <div>
                  {details?.attributes &&
                    Object.entries(details.attributes).map(([key, value]) => (
                      <RenderAttribute key={key} keyName={key} value={value} />
                    ))}
                </div>
              </div>
              <div className="border-t mt-2">
                <p className="m-2 text-lg font-medium">Description</p>
                <p className="lg:w-[600px] w-full py-5 p-2">
                  {details?.description}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="xl:w-72">
          <h2 className="font-bold text-lg xl:text-2xl p-2">
            Items in Your Cart
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
