import { getCategory } from "@/app/actions/category";
import { updateCategoryId, nextStep } from "@/app/store/slices/productSlice";
import { Category as Cat } from "@/constant/types";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";

const Category = () => {
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState<Cat[]>([]);
  const { categoryId } = useAppSelector((state) => state.product);
  const [parentId, setParentId] = useState<string>(categoryId);

  // Fetch categories on mount or when parentId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (parentId) {
          const res = await getCategory(undefined, parentId, undefined);
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
  const handleSelect = (categoryId: string) => {
    setParentId(categoryId); // Update local state with the selected category ID
    dispatch(updateCategoryId(categoryId)); // Update Redux store with selected category ID
  };

  // Handle next step
  const handleNext = () => {
    if (parentId) {
      dispatch(nextStep()); // Navigate to next step if category is selected
    }
  };

  return (
    <div className="p-2 mt-4">
      <div>
        <ul className="w-[90%] bg-[#eee] dark:bg-sec-dark">
          {category.map((item) => (
            <li
              key={item._id}
              className={`flex justify-between items-center  ${
                parentId === item._id ? "bg-blue-200" : ""
              }`}
            >
              <p
                onClick={() => handleSelect(item?._id as string)} // Ensure handleSelect is called
                className={`cursor-pointer  ${
                  parentId === item._id ? "bg-blue-200" : ""
                }`}
              >
                {item.categoryName}
              </p>
              <button
                type="button"
                title="select this"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event propagation to parent <li> on button click
                  handleSelect(item?._id as string); // Ensure the category is selected
                }}
              >
                Select This
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Next button */}
      <div className="text-end mt-4">
        <button
          type="button"
          onClick={() => {
            handleNext(); // Proceed to next step
          }}
          disabled={!parentId} // Disable if no category is selected
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Category;
