"use client";

import { AdminLayout } from "@/components";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { AttachFile } from "@mui/icons-material";
import { getCategory, putCategory } from "@/fetch/category";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Category } from "@/constant/types";
import FilesUploader from "@/components/FilesUploader";

const CategoryEdit = ({ params }: { params: { id: string } }) => {
  const [category, setCategory] = useState({
    categoryId: "",
    category_name: "",
    description: "",
  });
  const [imageUrl, setImageUrl] = useState<File[]>([]);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCategory({
        ...category,
        category_name: categories?.[0].categoryName as unknown as string,
        categoryId: categories?.[0].parent_id as unknown as string,
        description: categories?.[0].description as unknown as string,
      });
    }
  }, [category, categories]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => putCategory(data),
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

    data.append("id", params.id);

    mutation.mutate(data);
  };
  return (
    <AdminLayout>
      <div className="p-2 pb-10">
        <h2 className="text-2xl font-bold my-2">Edit Category</h2>

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CategoryEdit;
