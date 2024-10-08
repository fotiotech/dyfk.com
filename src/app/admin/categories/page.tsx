"use client";

import { AdminLayout } from "@/components";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Category } from "../../../constant/types";
import { AttachFile } from "@mui/icons-material";
import Link from "next/link";
import { getCategory, getSubcategories } from "@/fetch/category";
import { useQuery } from "@tanstack/react-query";
import FilesUploader from "@/components/FilesUploader";

const Categories = () => {
  const [category, setCategory] = useState({
    categoryId: "",
    category_name: "",
    description: "",
  });
  const [imageUrl, setImageUrl] = useState<File[]>([]);
  const [id, setId] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  const { data: subCategory, isLoading: loading } = useQuery<Category[]>({
    queryKey: ["subcategory"],
    queryFn: () => getSubcategories(id),
  });

  const handleCategoryChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCategory((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmitCategory = async (ev: FormEvent) => {
    ev.preventDefault();

    const data = new FormData();
    Object.entries(category).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (imageUrl) {
      Array.from(imageUrl).forEach((file) => data.append("imageUrl", file));
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newCategory = response.data;
      console.log(newCategory);
      alert(response.data);
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Failed to create category! " + error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-2 pb-10">
        <h2 className="text-2xl font-bold my-2">Create Category</h2>

        <form onSubmit={handleSubmitCategory}>
          <div className="lg:flex gap-3 mb-2">
            <div className="lg:flex gap-3 mb-5">
              <div>
                <label htmlFor="categoryId">Parent Category:</label>
                <select
                  title="parentCategory"
                  name="categoryId"
                  onChange={handleCategoryChange}
                  className="w-full"
                  value={category.categoryId}
                >
                  <option value="">Select Parent Category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="category">New Category:</label>
              <input
                id="category"
                type="text"
                name="category_name"
                value={category.category_name}
                onChange={handleCategoryChange}
                className="w-full"
              />
            </div>
          </div>
          <FilesUploader images={imageUrl} setImages={setImageUrl} />

          <div>
            <label htmlFor="description">Description:</label>
            <input
              id="description"
              type="text"
              name="description"
              value={category.description}
              onChange={handleCategoryChange}
              className="w-full h-20 "
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn block my-2">
              Add Category
            </button>
          </div>
        </form>

        <div>
          <h2 className="font-bold text-xl my-2">Categories</h2>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div>
              <ul
                className="flex flex-col gap-1 max-h-96 
            overflow-hidden overflow-y-auto scrollbar-none"
              >
                {categories?.map((cat, index) => (
                  <li
                    key={index}
                    onClick={() => setId(cat._id)}
                    className="flex justify-between cursor-pointer font-bold text-gray-700
               hover:text-sec hover:bg-opacity-5 p-1"
                  >
                    <span>{cat.categoryName}</span>
                    <span className="flex gap-2">
                      <Link href={`/admin/categories/category_edit/${cat._id}`}>
                        Edit
                      </Link>
                      <Link
                        href={`/admin/categories/category_delete/${cat._id}`}
                      >
                        Delete
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ul
                className="flex flex-col gap-1 max-h-96 
            overflow-hidden overflow-y-auto scrollbar-none"
              >
                {subCategory?.length &&
                  subCategory?.map((sub, index) => (
                    <li
                      key={index}
                      className="flex justify-between cursor-pointer 
                    font-bold text-gray-300 hover:text-pri
                  hover:bg-gray-100 hover:bg-opacity-5 p-1"
                    >
                      {sub.categoryName}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Categories;
