"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { Brand } from "@/constant/types"; // Assume AttributeType exists
import Category from "@/app/(dashboard)/components/category/Category";
import FilesUploader from "@/components/FilesUploader";
import { Attribute as ProdAttributes } from "@/app/(dashboard)/components";
import { createProduct } from "@/app/actions/products";
import { getBrands } from "@/app/actions/brand";
import { getCategory } from "@/app/actions/category";
import { findCategoryAttributesAndValues } from "@/app/actions/attributes";

type AttributeType = {
  attrName: string;
  attrValue: string[];
};

type FormDataType = {
  attributes: { [key: string]: string[] };
};

const AddProduct = () => {
  const initialState = {
    sku: "",
    product_name: "",
    category_id: "",
    brandId: "",
    department: "",
    description: "",
    price: 0.0,
    attributes: [{}] as unknown as Record<string, string[]>, // Support multiple selection
  };

  const [categoryId, setCategoryId] = useState<string>("");
  const [attributes, setAttributes] = useState<AttributeType[] | any>([]); // Type as array of attributes
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState<typeof initialState>(initialState);
  const [files, setFiles] = useState<string[]>([]);

  const images = files?.length! > 1 ? files : files?.[0];

  const toCreateProduct = createProduct.bind(
    null,
    categoryId,
    formData.attributes,
    images as string[]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (categoryId !== "") {
        const response = await findCategoryAttributesAndValues(categoryId);
        if (response?.length > 0) {
          // Format response data to match AttributeType structure
          const formattedAttributes = response[0].inheritedAttributes.map(
            (attr: any) => ({
              attrName: attr.name,
              attrValue: attr.attributeValues.map((val: any) => val.value),
            })
          );
          setAttributes(formattedAttributes);
        } // Ensure this is an array of attributes
      }
      const res = await getBrands();
      setBrands(res);
    };

    fetchData();
  }, [categoryId]);

  const handleAttributeChange = (
    attrName: string,
    selectedValues: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [attrName]: selectedValues },
    }));
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold">Add Product</h2>
        <FilesUploader files={files} setFiles={setFiles} />
        <div className="p-2 bg-pri dark:bg-pri-dark rounded-xl mb-2">
          <h2 className="font-semibold text-xl m-2 mt-5">Category</h2>
          <Category setCategoryId={setCategoryId} />
        </div>
        <ProdAttributes
          attributes={attributes}
          handleAttributeChange={handleAttributeChange}
          formData={formData}
        />
        <form
          action={toCreateProduct}
          className="md:flex justify-between gap-3 w-full"
        >
          <div className="flex-1">
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
                      placeholder={placeholder}
                      className="w-[90%] p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
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
                    className="w-[90%] p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
                  >
                    <option value="" className="text-gray-500">
                      Select brand
                    </option>
                    {brands?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
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
                    className="w-[90%] p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
                    rows={4}
                  />
                </div>
              </div>
            </div>
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
        </form>
      </div>
    </>
  );
};

export default AddProduct;
