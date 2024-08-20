"use client";

import { AdminLayout } from "@/components";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Category } from "../../../constant/types";
import { AttachFile } from "@mui/icons-material";
import Link from "next/link";
import { getCategory, getSubcategories } from "@/fetch/category";
import { useQuery } from "@tanstack/react-query";

const Categories = () => {
  const [category, setCategory] = useState({
    categoryId: 0,
    category_name: "",
    description: "",
  });
  const [imageUrl, setImageUrl] = useState<FileList | null>(null);
  const [id, setId] = useState<number | null>(null);
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

  const data = new FormData();

  const handleSubmitCategory = async (ev: FormEvent) => {
    ev.preventDefault();

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
      // setCategories((prevCategories) => [...prevCategories, newCategory]);

      alert(response.data.message);
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Failed to create category! " + error);
    }
  };

  return (
    <AdminLayout>
      <div className=" p-2 pb-10">
        <h2 className="text-2xl font-bold my-2">Create Category</h2>

        {/* Form to create a new category */}
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
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
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
          <div>
            <label htmlFor="imageUrl" className="font-bold">
              Image Url :
            </label>
            <div
              className="flex justify-center items-center gap-3 whitespace-nowrap 
          p-4 bg-pri dark:bg-pri-dark overflow-auto rounded-xl mb-2"
            >
              <div className="inline-block">
                <div
                  className="flex justify-center items-center w-40 h-40 
              border-2 border-gray-300 hover:border-thi rounded-lg"
                >
                  <button
                    title="Upload Images"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      imageInputRef.current?.click();
                    }}
                    className="text-gray-300"
                  >
                    <AttachFile style={{ fontSize: 32 }} />
                    <p>Attach Files</p>
                  </button>
                  <input
                    ref={imageInputRef}
                    title="name of product"
                    type="file"
                    accept=".png, .jpg, .jpeg, .webp, .mp4"
                    name="imageUrl"
                    multiple
                    onChange={(e) => {
                      const file = e.target.files;
                      if (file && file.length > 0) {
                        setImageUrl(file);
                      } else {
                        setImageUrl(null);
                      }
                    }}
                    className="w-3/4 hidden "
                  />
                </div>
              </div>
            </div>
          </div>

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

        {/* Form to create an attribute */}

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
                    onClick={() => setId(cat.category_id)}
                    className="flex justify-between cursor-pointer font-bold text-gray-300 hover:text-pri
               hover:bg-gray-100 hover:bg-opacity-5 p-1"
                  >
                    <span className="">{cat.category_name}</span>
                    <Link
                      href={`/admin/categories_edit/${cat.category_id}`}
                      className=""
                    >
                      Edit
                    </Link>
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
                      {sub.category_name}
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
