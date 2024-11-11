"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import _ from "lodash";
import { FilterList } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { Product } from "@/constant/types";
import { useScreenSize } from "@/components/Hooks";
import ListFilter from "@/components/ListFilter";
import Link from "next/link";
import ImageRenderer from "@/components/ImageRenderer";
import Spinner from "@/components/Spinner";
import BottomSheet from "@/components/BottomSheet";
import { getSearch } from "@/app/actions/search";

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [isloading, setIsloading] = useState(false);
  const [openClose, setOpenClose] = useState(false);
  const [screenSize, setScreenSize] = useState(0);

  useScreenSize(() => {
    setScreenSize(window.innerWidth);
  });

  useEffect(() => {
    async function search() {
      if (query) {
        setIsloading(true);
        const response = await getSearch(query);
        setProducts(response);
        setIsloading(false);
      }
    }
    search();
  }, [query]);

  return (
    <>
      <div className="relative flex w-full min-h-0 overflow-hidden">
        <ListFilter openClose={openClose} setOpenClose={setOpenClose} />
        {/* <BottomSheet open={openClose} setOpen={setOpenClose} /> */}
        <div className="flex-1 lg:px-10">
          <div className="flex justify-between items-center p-2">
            <h2 className={``}>Search for: &quot;{query}&quot;</h2>
            {screenSize <= 1024 ? (
              <FilterList
                onClick={() => setOpenClose((openClose) => !openClose)}
              />
            ) : (
              ""
            )}
          </div>
          <div className="flex items-center bg-[#fafafa]">
            <div className=" w-full overflow-hidden bg-[#eee]">
              {isloading ? (
                <Spinner />
              ) : (
                <div>
                  {!products ? (
                    <div
                      className="flex justify-center items-center h-80 
                    text-xl font-semibold text-gray-600"
                    >
                      Not Found...
                    </div>
                  ) : (
                    products.map((product) => (
                      <div key={product._id} className="">
                        <Link
                          href={`/${product.url_slug}/details/${product.dsin}`}
                        >
                          <div className="flex gap-4 bg-white p-2 my-1 ">
                            <div>
                              <div className=" lg:h-60 h-44 lg:w-44 w-36 overflow-hidden bg-[#eee]">
                                {product.imageUrls && (
                                  <ImageRenderer image={product.imageUrls[0]} />
                                )}
                              </div>
                            </div>
                            <div>
                              <p className=" line-clamp-3 lg:text-xl text-lg font-medium ">
                                {product.productName}
                              </p>
                              <div className=" py-1">
                                <div>
                                  <span className=" text-sm pr-1">cfa</span>
                                  <span className=" font-bold pr-2">
                                    {product.price}
                                  </span>
                                  <span className=" text-sm pr-1">cfa</span>
                                </div>
                              </div>
                              {/* <div className=" ">
                              <AddToCart
                                id={product.product_id}
                                name={product.product_name}
                                price={product.price}
                                image={product.imageUrl}
                                width="60"
                                height="8"
                              />
                            </div> */}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <SearchPagination />
        </div>
      </div>
    </>
  );
};

function SearchPagination() {
  return (
    <div className="flex justify-center items-center my-5">
      <img
        src="/271220.png"
        alt=""
        className=" w-10 h-10 mx-3 hover:bg-[#efefef] p-2 border"
      />

      <ul className="flex font-medium w-64 overflow-hidden">
        <li className="p-2 rounded-full border m-2 hover:bg-[#efefef]">1</li>
        <li className="p-2 rounded-full border m-2 hover:bg-[#efefef]">2</li>
        <li className="p-2 rounded-full border m-2 hover:bg-[#efefef]">3</li>
        <li className="p-2 rounded-full border m-2 hover:bg-[#efefef]">4</li>
        <li className="p-2 rounded-full border m-2 hover:bg-[#efefef]">5</li>
        <li className="p-2 rounded-full border m-2 hover:bg-[#efefef]">6</li>
        <li className="p-2 rounded-full border m-2 hover:bg-[#efefef]">7</li>
        <li className="p-2 rounded-full border m-2 hover:bg-[#efefef]">8</li>
        <li className="p-2 rounded-full border m-2 hover:bg-[#efefef]">9</li>
        <li className="p-2 rounded-full border m-2 hover:bg-[#efefef]">10</li>
      </ul>
      <p>
        <img
          src="/271228.png"
          alt=""
          className=" w-10 h-10 mx-3 p-2 hover:bg-[#efefef] border"
        />
      </p>
    </div>
  );
}

export default Search;
