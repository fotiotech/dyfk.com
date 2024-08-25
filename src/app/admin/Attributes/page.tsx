"use client";

import { AdminLayout } from "@/components";
import { Attributes as attr, Category } from "@/constant/types";
import { getAttributes, postAttributes } from "@/fetch/attributes";
import { getCategory } from "@/fetch/category";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, FormEvent, useState } from "react";

const Attributes = () => {
  const [categoryId, setCategoryId] = useState<string>("");
  const [formData, setFormData] = useState({
    attrName: "",
    attrValue: "",
  });

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  const { data: attributes, isLoading: loading } = useQuery<attr[]>({
    queryKey: ["attributes"],
    queryFn: getAttributes,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) => postAttributes(data),
  });

  const handleSubmitAttribute = async (ev: FormEvent) => {
    ev.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    data.append("categoryId", categoryId);

    mutation.mutate(data);
  };

  return (
    <AdminLayout>
      <h2 className="font-bold text-xl my-2">Attributes</h2>

      <form onSubmit={handleSubmitAttribute}>
        <select
          title="Parent Category"
          name="categoryId"
          onChange={(e) => setCategoryId(e.target.value)}
          value={categoryId}
          className="w-3/4"
        >
          <option value="" className="text-gray-700">
            Select category
          </option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>
        <div className="lg:flex gap-3">
          <div>
            <label htmlFor="attrName">Attribute Name:</label>
            <input
              id="attrName"
              type="text"
              name="attrName"
              value={formData.attrName}
              onChange={handleChange}
              className="w-3/4"
            />
          </div>
          <div>
            <label htmlFor="attrValue">Attribute Value:</label>
            <input
              id="attrValue"
              type="text"
              name="attrValue"
              value={formData.attrValue}
              placeholder="Words, separated by commas"
              onChange={handleChange}
              className="w-3/4"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn my-2">
            Add Attribute
          </button>
        </div>
      </form>
      <div>
        <h3 className="font-bold text-lg">Attributes</h3>
        <ul
          className="flex flex-col gap-1 max-h-96 
            overflow-hidden overflow-y-auto scrollbar-none"
        >
          {attributes?.length &&
            attributes?.map((attr, index) => (
              <li
                key={index}
                className="flex justify-between cursor-pointer 
                    font-bold text-gray-700 hover:text-sec
                  hover:bg-gray-100 hover:bg-opacity-5 p-1"
              >
                {attr.names}
              </li>
            ))}
        </ul>
      </div>
    </AdminLayout>
  );
};

export default Attributes;
