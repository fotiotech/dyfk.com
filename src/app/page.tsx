"use client";

import Hero from "@/components/Hero";
import ImageRenderer from "@/components/ImageRenderer";
import Layout from "@/components/Layout";
import { Category, Product } from "@/constant/types";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { findProducts } from "./actions/products";
import { useEffect, useState } from "react";
import { getCategory } from "./actions/category";

export default function Home() {
  const [newArrival, setNewArrival] = useState<Product[]>([])
  const [electronics, setElectronics] = useState<Category[]>([])
  

  useEffect(() => {
    async function findProd() {
    const p = await findProducts();
    setNewArrival(p ?? []);
  }
  findProd()
  async function findCategory() {
    const p = await getCategory(null, null, 'Electronics');
    setElectronics(p);
  }
  
  findCategory()
  })

  return (
    <Layout>
      <main className="">
        <Hero />
        <div className={`w-full p-2 lg:px-10 lg:mt-1 mb-1 bg-pri border-y `}>
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
              <Spinner />
            )}
          </div>
        </div>
        <div className={`w-full p-2 lg:px-10 lg:mt-1 mb-1 bg-pri border-y `}>
          <h2 className=" lg:mb-4 mb-2 font-bold  text-xl lg:text-3xl">
          Electronics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 mx-auto gap-3 lg:gap-5 ">
            {electronics?.length! > 0 ? (
              electronics?.slice(0, 4).map((category, index) => (
                <div key={index} className=" mb-1 rounded">
                  <Link href={`/search?query=${category._id}`}>
                    <div className=" lg:h-60 content-center bg-[#eee] h-52 rounded-lg overflow-hidden  ">
                      {category.imageUrl && (
                        <ImageRenderer image={category.imageUrl?.[0]} />
                      )}
                    </div>
                    <p className=" mt-2 w-full line-clamp-2  ">
                      {category.categoryName}
                    </p>
                    
                  </Link>
                </div>
              ))
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
