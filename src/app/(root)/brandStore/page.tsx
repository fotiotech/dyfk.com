"use client";

import { findProductsByBrand, getBrands } from "@/app/actions/brand";
import { Prices } from "@/components/cart/Prices";
import ImageRenderer from "@/components/ImageRenderer";
import Spinner from "@/components/Spinner";
import { Brand, Product } from "@/constant/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const BrandStore = () => {
  const brandId = useSearchParams().get("brandId");

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchBrands() {
      if (!brandId) return null;
      const data = await getBrands(brandId as string);
      setBrand(data);
    }
    async function getProds() {
      const res = await findProductsByBrand(brandId as string);
      setProducts(res as Product[]);
    }
    fetchBrands();
    getProds();
  }, [brandId]);

  console.log(brand);

  return (
    <div className="min-h-screen ">
      <div
        className="flex gap-5 
      items-center p-3 border-b mb-3 bg-slate-50"
      >
        <div
          className="w-20 h-20 rounded-full
        border bg-slate-100"
        >
          <ImageRenderer image={brand?.logoUrl} />
        </div>

        <h2
          className=" text-lg 
    font-bold mb-4"
        >
          {brand?.name} Store
        </h2>
      </div>

      <div
        className="grid grid-cols-2 p-2
      lg:grid-cols-4 mx-auto gap-3 lg:gap-5 "
      >
        {products?.length > 0 ? (
          products?.map((product, index) => (
            <div key={index} className=" mb-1 rounded">
              <Link
                href={`/${product.url_slug}/details/${product.dsin}`}
                aria-label="new arrivals products"
              >
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
                    <span className=" font-bold mr-1">
                      <Prices amount={product.price} />
                    </span>
                    {product.discount && (
                      <div>
                        <span className=" text-sm line-through ">
                          <Prices amount={product.discount} />
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
  );
};

export default BrandStore;
