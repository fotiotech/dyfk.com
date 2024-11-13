import { getCategory } from "@/app/actions/category";
import { Category as Cat } from "@/constant/types";
import React, { useEffect, useState } from "react";

const Category = ({
  setCategoryId,
  selectedCategoryId,
}: {
  setCategoryId: (e: string) => void;
  selectedCategoryId?: string;
}) => {
  const [category, setCategory] = useState<Cat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategory();
      setCategory(res);
    };

    fetchData();
  }, []);

  return (
    <div className={` p-2 mt-4`}>
      <div>
        <select
          title="categories"
          name="category_id"
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-[90%] bg-[#eee] dark:bg-sec-dark
           "
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
    </div>
  );
};

export default Category;
