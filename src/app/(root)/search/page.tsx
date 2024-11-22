"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FilterList } from "@mui/icons-material";
import { Brand, Category, Product } from "@/constant/types";
import ListFilter from "@/components/ListFilter";
import Link from "next/link";
import ImageRenderer from "@/components/ImageRenderer";
import Spinner from "@/components/Spinner";
import { getSearch } from "@/app/actions/search";

type SearchProductType = {
  products: Product[];
  filters: {
    categories: { id: string; name: string; count: number }[];
    brands: { id: string; name: string; count: number }[];
    priceRange: { min: number; max: number };
  };
};

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query")?.toLowerCase();
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");

  const [products, setProducts] = useState<SearchProductType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openClose, setOpenClose] = useState(false);
  const [screenSize, setScreenSize] = useState(0);

  console.log(products);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenSize(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    async function fetchSearchResults() {
      if (query) {
        setIsLoading(true);
        const response = await getSearch(
          query,
          category as string,
          brand as string,
          priceMin as string,
          priceMax as string
        );
        setProducts(response as unknown as SearchProductType);
        setIsLoading(false);
      }
    }
    fetchSearchResults();
  }, [query, category, brand, priceMin, priceMax]);

  // Memoize filters to avoid unnecessary recalculations
  const filters = useMemo(() => products?.filters, [products]);

  const handleFilterClick = (key: string, value: string) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set(key, value);

    // Use window.location.href to update the URL and manually reload the page
    window.location.href = `/search?${queryParams.toString()}`;
    setOpenClose(false);
  };

  return (
    <div className="relative flex w-full min-h-0 overflow-hidden">
      <ListFilter
        openClose={openClose}
        setOpenClose={setOpenClose}
        filters={
          (filters as unknown as any) || {
            categories: [],
            brands: [],
            priceRange: {},
          }
        }
        handleFilterClick={handleFilterClick}
      />
      <div className="flex-1 lg:px-10">
        <div className="flex justify-between items-center p-2">
          <h2>Search for: &quot;{query}&quot;</h2>
          {screenSize <= 1024 && (
            <FilterList onClick={() => setOpenClose((prev) => !prev)} />
          )}
        </div>
        <div className="flex items-center bg-[#fafafa]">
          <div className="w-full overflow-hidden bg-[#eee]">
            {isLoading ? (
              <Spinner />
            ) : (
              <div>
                {!products ? (
                  <div className="flex justify-center items-center h-80 text-xl font-semibold text-gray-600">
                    Not Found...
                  </div>
                ) : (
                  products.products.map((product) => (
                    <div key={product._id} className="">
                      <Link
                        href={`/${product.url_slug}/details/${product.dsin}`}
                      >
                        <div className="flex gap-4 bg-white p-2 my-1">
                          <div className="lg:h-60 h-44 lg:w-44 w-36 overflow-hidden bg-[#eee]">
                            {product.imageUrls && (
                              <ImageRenderer image={product.imageUrls[0]} />
                            )}
                          </div>
                          <div>
                            <p className="line-clamp-3 lg:text-xl text-lg font-medium">
                              {product.productName}
                            </p>
                            <div className="py-1">
                              <span className="text-sm pr-1">CFA</span>
                              <span className="font-bold pr-2">
                                {product.price}
                              </span>
                            </div>
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
      </div>
    </div>
  );
};

export default Search;
