import { Category as Cat } from "@/constant/types";
import { getCategory } from "@/fetch/category";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

type CategoryProps = {
  setCategoryId: (arg: string) => void;
  categoryId: string;
};

const Category = ({ categoryId, setCategoryId }: CategoryProps) => {
  const { data: categories, isLoading } = useQuery<Cat[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  return (
    <div className={` p-2 mt-4`}>
      <div>
        <select
          title="categories"
          name="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-[90%] "
        >
          <option value="" className="text-gray-700">
            Select Category
          </option>
          {categories &&
            categories.map((item, index) => (
              <option key={index} value={item._id}>
                {item.categoryName}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default Category;
