"use client";
import Category from "./category/page";
import { createProduct } from "@/app/actions/products";
import { useAppSelector } from "@/app/hooks";
import React from "react";
import { Product } from "@/constant/types";

const AddProduct = () => {
  const {
    sku,
    product_name,
    brand_id,
    department,
    description,
    finalPrice,
    imageUrls,
    category_id,
    attributes,
    basePrice,
    taxRate,
    discount,
    currency,
    upc,
    ean,
    gtin,
    stockQuantity,
    status,
    variants,
  } = useAppSelector((state) => state.product);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Add Product</h3>
      <div>
        <Category />
      </div>
    </div>
  );
};

export default AddProduct;
