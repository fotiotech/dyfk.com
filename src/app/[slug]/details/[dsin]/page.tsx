"use client";
import Loading from "@/app/loading";
import DetailImages from "@/components/DetailImages";
import Layout from "@/components/Layout";
import { Product } from "@/constant/types";
import { getProductDetail } from "@/fetch/products";
import { useQuery } from "@tanstack/react-query";
import React from "react";

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
    <Layout>
      <div className="relative w-full overflow-hidden bg-[#efefef]">
        <div className="xl:flex w-full  bg-white lg:px-10 ">
          {isLoading ? (
            <Loading loading={isLoading} />
          ) : (
            <div
              key={details?._id}
              className="xl:flex-1
           lg:grid grid-cols-2 gap-6 relative  "
            >
              <div>
                <div className="p-2 lg:hidden ">
                  <p className=" lg:m-3 m-1 font-medium font-sans ">
                    {details?.productName}
                  </p>
                </div>
                <div>
                  <DetailImages file={details?.imageUrls} />
                </div>
              </div>

              <div className="flex flex-col gap-2 p-2 lg:p-0 ">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-gray-700">cfa</span>
                  <span className=" font-bold text-xl">{details?.price}</span>
                </div>
                <div className="border-b">
                  <span className="font-bold text-blue-700">
                    {/* {products?.stockAvailability} */}
                  </span>
                </div>

                {/* <div className="flex justify-between items-center gap-3  w-full py-2">
                  <CheckoutButton width={"1/2"} height={"10"}>
                    Check Out
                  </CheckoutButton>

                  <AddToCart
                    id={products?.product_id}
                    name={products?.product_name}
                    image={products?.imageUrl}
                    price={products?.price}
                    width="1/2"
                    height="10"
                  >
                    Add To Cart
                  </AddToCart>
                </div> */}
                <div className=" border-t mt-2">
                  <p className="m-2 text-lg font-medium">Description</p>
                  <p className="lg:w-[600px] w-full py-5 p-2">
                    {details?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="xl:w-72 ">
            <h2 className="font-bold text-lg xl:text-2xl p-2 ">
              Items in Your Cart
            </h2>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetailsPage;