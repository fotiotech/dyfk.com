"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FilterList } from "@mui/icons-material";
import { Product } from "@/constant/types";
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

  const filters = useMemo(() => products?.filters, [products]);

  const handleFilterClick = (key: string, value: string) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set(key, value);
    window.location.href = `/search?${queryParams.toString()}`;
    setOpenClose(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Filter Sidebar */}
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

      {/* Search Results Section */}
      <div className="flex-1 px-4 py-6">
        {/* Search Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Search Results for: <span className="text-blue-600 ">{query}</span>
          </h2>
          <button
            className="lg:hidden flex items-center space-x-2 text-blue-500"
            onClick={() => setOpenClose((prev) => !prev)}
          >
            <FilterList fontSize="medium" />
            <span>Filters</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-60">
            <Spinner />
          </div>
        )}

        {/* No Results */}
        {!isLoading && !products && (
          <div className="flex justify-center items-center h-60 text-lg text-gray-500">
            No results found.
          </div>
        )}

        {/* Product List */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products?.products.map((product) => (
            <Link
              key={product._id}
              href={`/${product.url_slug}/details/${product.dsin}`}
              className="bg-white shadow rounded-md overflow-hidden hover:shadow-lg transition"
            >
              <div>
                <ImageRenderer image={product.imageUrls[0]} />
                <div className="p-2">
                  <p className="text-sm font-medium line-clamp-2">
                    {product.productName}
                  </p>
                  <p className="mt-1 text-blue-600 font-bold text-sm">
                    CFA {product.finalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
