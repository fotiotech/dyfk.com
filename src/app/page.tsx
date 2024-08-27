"use client";

import Hero from "@/components/Hero";
import ImageRenderer from "@/components/ImageRenderer";
import Layout from "@/components/Layout";
import { Product } from "@/constant/types";
import { getNewArrival } from "@/fetch/products";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAuth } from "./auth/UserContext";
import Spinner from "@/components/Spinner";

export default function Home() {
  const { data: newArrival, isLoading } = useQuery<Product[]>({
    queryKey: ["new-Arrival"],
    queryFn: getNewArrival,
  });

  const auth = useAuth();

  return (
    <Layout>
      <main className="">
        <Hero />
        <div className={`w-full  p-2 lg:px-10 lg:mt-1 mb-1 bg-pri border-y `}>
          <h2 className=" lg:mb-4 mb-2 font-bold  text-xl lg:text-3xl">
            New Arrivals
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 mx-auto gap-3 lg:gap-5 ">
            {newArrival?.length! > 0 ? (
              newArrival?.slice(0, 4).map((product, index) => (
                <div key={index} className=" mb-1 rounded">
                  <Link href={`/${product.url_slug}/details/${product.dsin}`}>
                    <div className=" lg:h-60 p-2 content-center bg-[#eee] h-52 rounded-lg overflow-hidden  ">
                      {product.imageUrls && (
                        <ImageRenderer image={product.imageUrls[0]} />
                      )}
                    </div>
                    <p className=" mt-2 w-full line-clamp-2  ">
                      {product.productName}
                    </p>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className=" font-bold text-gray-700 ">cfa</span>
                        <span className=" font-bold mr-1">{product.price}</span>
                        {product.discount && (
                          <div>
                            <span className=" font-bold text-gray-700 ">
                              cfa
                            </span>
                            <span className=" text-sm line-through ">
                              {product.discount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <Spinner loading={isLoading} />
            )}
          </div>
        </div>
        <div
          className="flex justify-center items-center
      h-40 w-full p-2"
        >
          <div className="w-1/2 text-center">
            <h2 className="font-bold text-lg">Hello there</h2>
            <p>
              Let&apos;s{" "}
              <Link href={"/auth/sign_up"} className="text-blue-400">
                Sign Up
              </Link>
              , our powerful E-commerce platform will start growing soon.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
