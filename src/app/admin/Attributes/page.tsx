"use client";

import { AdminLayout } from "@/components";
import { Category } from "@/constant/types";
import { getCategory } from "@/fetch/category";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const Attributes = () => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });
  return (
    <AdminLayout>
      <h2 className="font-bold text-xl my-2">Attributes</h2>
      <div className="grid grid-cols-2 gap-3 w-full">
        <div>
          <select title="parent category" className="w-3/4">
            <option value="" className="text-gray-700">
              Select category
            </option>
            {categories?.map((cat, index) => (
              <option key={index} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Attributes;
