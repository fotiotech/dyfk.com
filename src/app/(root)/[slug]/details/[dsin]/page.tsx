"use client";

import { findProductDetails } from "@/app/actions/products";
import { useUser } from "@/app/context/UserContext";
import Loading from "@/app/loading";
import AddToCart from "@/components/AddToCart";
import CheckoutButton from "@/components/CheckoutButton";
import DetailImages from "@/components/DetailImages";
import { Prices } from "@/components/cart/Prices";
import { Product } from "@/constant/types";
import { LocationOn } from "@mui/icons-material";
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
      if (params.dsin) {
        const response = await findProductDetails(params.dsin);
        if (response) {
          setDetails(response);
          setIsLoading(false);
        }
      }
    }
    getDetails();
  }, []);

  console.log(details?.attributes);

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
                  {details?.attributes
                    .filter(
                      (attributeGroup) => attributeGroup.groupName === "general"
                    )
                    .map((attributeGroup, groupIndex) => (
                      
                      <div key={groupIndex} className="mb-3">
                        {/* <h4 className="font-semibold capitalize">
                          {attributeGroup.groupName}
                        </h4> */}
                        {Object.entries(attributeGroup.attributes)
                          .filter(
                            ([attributeName]) =>
                              attributeName !== "_id" && attributeName !== "0"
                          ) // Exclude _id and 0
                          .map(([attributeName, attributeValues], idx) => (
                            <div
                              key={`${attributeName}-${idx}`}
                              className="border-b my-2"
                            >
                              <strong>{attributeName}</strong>
                              <span className="ml-10">
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
                  <div className="">
                    {details.attributes.map((attributeGroup, groupIndex) => (
                      <div key={groupIndex} className="mb-3">
                        <h4 className="font-semibold capitalize">
                          {/* {attributeGroup.groupName} */}
                        </h4>
                        {Object.entries(attributeGroup.attributes)
                          .filter(
                            ([attributeName]) =>
                              attributeName !== "_id" && attributeName !== "0"
                          ) // Exclude _id and 0
                          .map(([attributeName, attributeValues], idx) => (
                            <div
                              key={`${attributeName}-${idx}`}
                              className="grid grid-cols-2 w-3/4"
                            >
                              <strong className="my-1">{attributeName}</strong>
                              <span className="ml-10">
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
