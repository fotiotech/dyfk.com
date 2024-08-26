"use client";

import { AdminLayout } from "@/components";
import React, { FormEvent, useRef, useState, ChangeEvent } from "react";
import { AttachFile } from "@mui/icons-material";
import { Attributes, Brands } from "@/constant/types";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import Category from "@/components/admin/category/Category";
import { postProducts } from "@/fetch/products";
import { getAttributes } from "@/fetch/attributes";
import { getBrands } from "@/fetch/category";

const AddProduct = () => {
  const initialState = {
    sku: "",
    product_name: "",
    brandId: "",
    department: "",
    description: "",
    price: 0.0,
  };

  const [categoryId, setCategoryId] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [selectedAttrIds, setSelectedAttrIds] = useState<
    Record<string, number>
  >({});
  const [files, setFiles] = useState<FileList | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: attributes, isLoading: loading } = useQuery<Attributes[]>({
    queryKey: ["attributes"],
    queryFn: getAttributes,
  });

  const { data: brands, isLoading: isLoading } = useQuery<Brands[]>({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedAttrIds((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) => postProducts(data),
    onSuccess: () => {
      router.push("/admin/products"); // Redirect after successful product creation
    },
  });

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (files) {
      Array.from(files).forEach((file) => data.append("files", file));
    }

    if (categoryId) {
      data.append("categoryId", categoryId.toString());
    }

    data.append("status", "pending");

    Object.entries(selectedAttrIds).forEach(([key, value]) => {
      data.append(`attribute_${key}`, value.toString());
    });

    mutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-2xl font-bold">Add Product</h2>
      </div>
      <div className="dark:text-pri">
        <form
          onSubmit={handleSubmit}
          className="md:flex justify-between gap-3 p-2 bg-[#eee] dark:bg-sec-dark w-full"
        >
          <div className="flex-1">
            <div className="flex justify-center items-center gap-3 whitespace-nowrap p-4 bg-pri dark:bg-pri-dark overflow-auto rounded-xl mb-2">
              <div className="inline-block">
                <div className="flex justify-center items-center w-40 h-40 border-2 border-thi rounded-lg">
                  <button
                    title="Upload Images"
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="text-gray-300"
                  >
                    <AttachFile style={{ fontSize: 32 }} />
                    <p>Attach Files</p>
                  </button>
                  <input
                    title="images"
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept=".png, .jpg, .jpeg, .webp, .mp4"
                    onChange={(e) => setFiles(e.target.files)}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            <div className="p-2 bg-pri dark:bg-pri-dark rounded-xl mb-2">
              <h2 className="font-semibold text-xl m-2 mt-5">Category</h2>
              <Category categoryId={categoryId} setCategoryId={setCategoryId} />
            </div>
            <div className="p-2 bg-pri dark:bg-pri-dark rounded-xl mb-2">
              <h2 className="font-semibold text-xl m-2 mt-5">
                Basic Information
              </h2>
              <div className="flex flex-col gap-4 p-2">
                {[
                  {
                    label: "SKU",
                    name: "sku",
                    type: "text",
                    placeholder: "e.g ABC123-XL",
                  },
                  {
                    label: "Product Name",
                    name: "product_name",
                    type: "text",
                    placeholder: "e.g iPhone 13",
                  },
                  {
                    label: "Price in (CFA)",
                    name: "price",
                    type: "number",
                    min: "0",
                    step: "0.01",
                  },
                  {
                    label: "Department",
                    name: "department",
                    type: "text",
                    placeholder: "e.g Electronics",
                  },
                ].map(({ label, name, type, placeholder, ...rest }) => (
                  <div key={name}>
                    <label
                      htmlFor={name}
                      className="text-lg font-semibold block"
                    >
                      {label}:
                    </label>
                    <input
                      name={name}
                      type={type}
                      value={formData[name as keyof typeof formData]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-[90%] p-2 rounded-lg"
                      {...rest}
                    />
                  </div>
                ))}
                <div>
                  <label
                    htmlFor="brandId"
                    className="text-lg font-semibold block"
                  >
                    Brand:
                  </label>
                  <select
                    title="brand Id"
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleChange}
                    className="w-[90%] p-2 rounded-lg"
                  >
                    <option value="" className="text-gray-500">
                      Select brand
                    </option>
                    {brands?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.brandName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="text-lg font-semibold block"
                  >
                    Description:
                  </label>
                  <textarea
                    title="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-[90%] p-2 rounded-lg"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="p-2 bg-pri dark:bg-pri-dark rounded-xl mb-2">
              <h2 className="font-semibold text-xl m-2 mt-5">
                Product Attributes
              </h2>
              {/* Product Attributes */}
              {/* <div className="md:grid grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                {Object.keys(attributes).map((attributeName) => (
                  <div key={attributeName} className="md:my-4">
                    <label className="text-lg font-semibold block">
                      {attributeName.charAt(0).toUpperCase() + attributeName.slice(1)}:
                    </label>
                    <select
                    title="attributes"
                      name={attributeName}
                      value={selectedAttrIds[attributeName] || ""}
                      onChange={handleSelectChange}
                      className="w-[90%] p-2 rounded-lg"
                    >
                      <option value="" disabled>Select {attributeName}</option>
                      {attributes[attributeName].map((attr) => (
                        <option key={attr.id} value={attr.id}>{attr.attr_values}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div> */}
            </div>
            <div className="p-2 bg-pri dark:bg-pri-dark rounded-xl mb-2">
              <div className="flex justify-end items-center p-2">
                <button
                  type="submit"
                  className="border-2 border-thi font-bold p-2 px-20 bg-thi hover:bg-opacity-90 transition-all rounded-lg"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;
