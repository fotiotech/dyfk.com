"use client";

import { getCategory } from "@/app/actions/category";
import { updateCategoryId } from "@/app/store/slices/productSlice";
import { Category as Cat } from "@/constant/types";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import Link from "next/link";

const Category = () => {
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState<Cat[]>([]);
  const { productId, category_id } = useAppSelector((state) => state.product);
  const [parentId, setParentId] = useState<string>(category_id);
  useEffect(() => {
    // Update parentId whenever categoryId changes
    setParentId(category_id);
  }, [category_id]); // Trigger whenever categoryId changes in the Redux store

  // Fetch categories on mount or when parentId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (parentId) {
          const res = await getCategory(undefined, parentId, undefined);
          if (res.length === 0) return null;
          setCategory(res || []);
        } else {
          const res = await getCategory();
          setCategory(res || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, [parentId]); // Ensure it re-fetches whenever parentId changes

  // Handle category selection
  const handleSelect = (catId: string) => {
    setParentId(catId); // Update local state with the selected category ID
    dispatch(updateCategoryId(catId)); // Update Redux store with selected category ID
  };

  return (
    <div className="p-2 mt-4">
      <ul
        className="flex flex-col gap-2 bg-[#eee]
        h-[500px] scrollbar-none overflow-clip 
        overflow-y-auto dark:bg-sec-dark"
      >
        {category.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center rounded-lg bg-slate-600 p-2"
          >
            <p
              onClick={() => handleSelect(item?._id as string)} // Ensure handleSelect is called
              className="flex-1 cursor-pointer"
            >
              {item.categoryName}
            </p>
            <span
              onClick={(e) => {
                e.stopPropagation(); // Prevent event propagation to parent <li> on button click
                handleSelect(item?._id as string); // Ensure the category is selected
              }}
              className={`${
                parentId === item._id ? "bg-blue-400" : ""
              } px-2 rounded-lg border`}
            >
              Select This
            </span>
          </li>
        ))}
      </ul>

      {/* Next button */}
      <div className="text-end mt-4">
        <Link
          href={parentId ? "/admin/products/list_product/basic_infos" : ""}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default Category;