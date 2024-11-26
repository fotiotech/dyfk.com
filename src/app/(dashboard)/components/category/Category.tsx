import { getCategory } from "@/app/actions/category";
import { updateCategoryId, nextStep } from "@/app/store/slices/productSlice";
import { Category as Cat } from "@/constant/types";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";

const Category = () => {
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState<Cat[]>([]);
  const { categoryId } = useAppSelector((state) => state.product);

  // Fetch categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategory();
        setCategory(res || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  // Handle category selection
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = event.target.value;
    dispatch(updateCategoryId(selectedCategoryId)); // Update Redux store with selected category ID
  };

  // Handle next step
  const handleNext = () => {
    if (categoryId) {
      dispatch(nextStep()); // Navigate to next step if category is selected
    }
  };

  return (
    <div className="p-2 mt-4">
      <div>
        <select
          title="categories"
          name="categoryId"
          onChange={handleChange}
          value={categoryId}
          className="w-[90%] bg-[#eee] dark:bg-sec-dark"
        >
          <option value="" className="text-gray-700">
            Select Category
          </option>
          {category.map((item) => (
            <option key={item._id} value={item._id}>
              {item.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Next button */}
      <div className="text-end mt-4">
        <button
          onClick={handleNext}
          disabled={!categoryId} // Disable if no category is selected
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Category;
