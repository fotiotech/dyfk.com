import { getCategory } from "@/app/actions/category";
import { updateCategoryId } from "@/app/store/slices/productSlice";
import { Category as Cat } from "@/constant/types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nextStep } from "@/app/store/slices/productSlice"; // Import nextStep if not already imported

const Category = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState<Cat[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch categories on mount
  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategory();
      setCategory(res);
    };

    fetchData();
  }, []);

  // Handle category selection
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = event.target.value;
    setSelectedCategory(selectedCategoryId);
    dispatch(updateCategoryId(selectedCategoryId)); // Update Redux store with selected category ID
  };

  // Handle next step
  const handleNext = () => {
    if (selectedCategory) {
      dispatch(nextStep()); // Navigate to next step if category is selected
    }
  };

  return (
    <div className="p-2 mt-4">
      <div>
        <select
          title="categories"
          name="category_id"
          onChange={handleChange}
          value={selectedCategory}
          className="w-[90%] bg-[#eee] dark:bg-sec-dark"
        >
          <option value="" className="text-gray-700">
            Select Category
          </option>
          {category &&
            category.map((item, index) => (
              <option key={index} value={item._id} className="">
                {item.categoryName}
              </option>
            ))}
        </select>
      </div>

      {/* Next button */}
      <div className="text-end mt-4">
        <button
          onClick={handleNext}
          disabled={!selectedCategory} // Disable if no category is selected
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Category;
