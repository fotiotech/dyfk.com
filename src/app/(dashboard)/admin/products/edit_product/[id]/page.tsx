"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import Category from "@/app/(dashboard)/components/category/Category";
import FilesUploader from "@/components/FilesUploader";
import { Attribute as ProdAttributes } from "@/app/(dashboard)/components";
import {
  createProduct,
  updateProduct,
  findProducts,
  deleteProduct,
} from "@/app/actions/products";
import { getBrands } from "@/app/actions/brand";
import { getCategory } from "@/app/actions/category";
import { Brand, Product } from "@/constant/types";
import { useRouter, useSearchParams } from "next/navigation";
import { ObjectId } from "mongoose";
import { findCategoryAttributesAndValues } from "@/app/actions/attributes";

type AttributeType = {
  attrName: string;
  attrValue: string[];
};

interface PageProps {
  params: {
    id: string;
  };
}

const EditDeleteProduct: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const productId = id;
  const initialState = {
    sku: "",
    product_name: "",
    category_id: "",
    brandId: "",
    department: "",
    description: "",
    price: 0.0,
    attributes: {} as Record<string, string[]>,
  };

  const [formData, setFormData] = useState<typeof initialState>(initialState);
  const [attributes, setAttributes] = useState<AttributeType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const images = files?.length! > 1 ? files : files?.[0];

  const toupdateProduct = updateProduct.bind(
    null,
    productId || "", // Use empty string or default value if productId is falsy
    categoryId || "", // Default to empty string if categoryId is falsy
    formData.attributes || {}, // Default to empty object if formData.attributes is falsy
    images as string[] // Ensure images is treated as an array
  );

  useEffect(() => {
    const fetchData = async () => {
      // Load product data if editing
      if (productId) {
        const product = await findProducts(productId);
        if (product && !("message" in product)) {
          const productData = product[0];
          setFormData({
            sku: productData.sku || "",
            product_name: productData.productName || "",
            category_id: productData.category_id || "",
            brandId: productData.brand_id,
            department: productData.department || "",
            description: productData.description || "",
            price: productData.price || 0.0,
            attributes: productData.attributes || {},
          });
          setFiles(productData.imageUrls);
          setCategoryId(productData.category_id);
        }
      }

      // Load brands and attributes based on category
      if (categoryId !== "") {
        const response = await findCategoryAttributesAndValues(categoryId);
        if (response?.length > 0) {
          // Format response data to match AttributeType structure
          const formattedAttributes = response[0].allAttributes.map(
            (attr: any) => ({
              attrName: attr.name,
              attrValue: attr.attributeValues.map((val: any) => val.value),
            })
          );
          console.log(formattedAttributes);
          setAttributes(formattedAttributes);
        } // Ensure this is an array of attributes
      }
      const brandsData = await getBrands();
      setBrands(brandsData);
    };

    fetchData();
  }, [productId, categoryId]);

  const handleAttributeChange = (
    attrName: string,
    selectedValues: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [attrName]: selectedValues },
    }));
  };

  const handleDeleteProduct = async () => {
    if (productId) {
      await deleteProduct(productId);
      router.push("/dashboard/products"); // Redirect after deletion
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Edit Product</h2>
      <FilesUploader files={files} setFiles={setFiles} />
      <div className="p-2 bg-pri dark:bg-pri-dark rounded-xl mb-2">
        <h2 className="font-semibold text-xl m-2 mt-5">Category</h2>
        <Category
          setCategoryId={setCategoryId}
          selectedCategoryId={formData.category_id}
        />
      </div>
      <ProdAttributes
        attributes={attributes && attributes}
        handleAttributeChange={handleAttributeChange}
        formData={formData}
      />
      <form
        action={toupdateProduct}
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
                  <label htmlFor={name} className="text-lg font-semibold block">
                    {label}:
                  </label>
                  <input
                    name={name}
                    type={type}
                    defaultValue={String(
                      formData[name as keyof typeof formData] ?? ""
                    )}
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
                  title="brand id"
                  name="brandId"
                  defaultValue={formData.brandId}
                  className="w-[90%] p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
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
                  defaultValue={formData.description}
                  className="w-[90%] p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex justify-end p-2 px-5 bg-pri
         dark:bg-pri-dark rounded-xl mb-2"
        >
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Update Product
          </button>
        </div>
      </form>
      <div className="mt-4 flex gap-4">
        {productId && (
          <button
            onClick={handleDeleteProduct}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete Product
          </button>
        )}
      </div>
    </div>
  );
};

export default EditDeleteProduct;
