"use client";

import { useUser } from "@/app/context/UserContext";
import Loading from "@/app/loading";
import AddToCart from "@/components/AddToCart";
import CheckoutButton from "@/components/CheckoutButton";
import DetailImages from "@/components/DetailImages";
import { Prices } from "@/components/cart/Prices";
import { Product } from "@/constant/types";
import { getProductDetail } from "@/fetch/products";
import { LocationOn } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const DetailsPage = ({
  params,
}: {
  params: { slug: string; dsin: string };
}) => {
  const { customerInfos } = useUser();
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

            <div className="flex flex-col gap-3 p-2 lg:p-0">
              <div className="flex items-baseline gap-2">
                <div className="font-bold text-xl">
                  <Prices amount={details?.price as number} />
                </div>
              </div>
              {details?.attributes && (
                <div className="">
                  {details.attributes.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-3">
                      {Object.entries(group)
                        .filter(([groupName]) =>
                          ["general"].includes(groupName)
                        ) // Only include "general" and "display"
                        .map(([groupName, attributes]) => (
                          <div key={groupName}>
                            <h4 className="font-semibold capitalize">
                              {/* {groupName} */}
                            </h4>
                            {Object.entries(attributes).map(
                              ([attrName, values], idx) => (
                                <div
                                  key={`${attrName}-${idx}`}
                                  className="border-b my-2"
                                >
                                  <strong>{attrName}</strong>
                                  <span className="ml-10">
                                    {Array.isArray(values)
                                      ? values.join(", ")
                                      : values}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              )}
              {customerInfos && (
                <Link href={"/checkout/billing_address"}>
                  <div className="flex gap-2">
                    <LocationOn />
                    <p>
                      Shipping to {customerInfos?.billingAddress.lastName},{" "}
                      {customerInfos?.shippingAddress.city}
                    </p>
                  </div>
                </Link>
              )}
              <div className="flex justify-between items-center gap-3 w-full py-2">
                <CheckoutButton width="1/2" height="10">
                  Check Out
                </CheckoutButton>
                {details && <AddToCart product={details} />}
              </div>

              <div className="mt-2 border-t">
                <h3 className="font-bold text-lg mt-2">Details</h3>
                {details?.attributes && (
                  <div className="p-2">
                    {details.attributes.map((group, groupIndex) => (
                      <div key={groupIndex} className="mb-3">
                        {Object.entries(group)
                          .filter(([groupName]) =>
                            ["general", "display"].includes(groupName)
                          ) // Only include "general" and "display"
                          .map(([groupName, attributes]) => (
                            <div key={groupName}>
                              <h4 className="font-semibold capitalize">
                                {/* {groupName} */}
                              </h4>
                              {Object.entries(attributes).map(
                                ([attrName, values], idx) => (
                                  <div
                                    key={`${attrName}-${idx}`}
                                    className="grid grid-cols-2 my-2"
                                  >
                                    <strong>{attrName}</strong>
                                    <span>
                                      {Array.isArray(values)
                                        ? values.join(", ")
                                        : values}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t">
                <p className="m-2 text-lg font-medium">Description</p>
                <p className="lg:w-[600px] w-full py-2 p-2">
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
