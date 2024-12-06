"use client";
import { createProduct } from "@/app/actions/products";
import { useAppSelector } from "@/app/hooks";
import React from "react";
import { Product } from "@/constant/types";
import Link from "next/link";

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
    productCode,
    stockQuantity,
    status,
    variants,
  } = useAppSelector((state) => state.product);

  const prod = useAppSelector((state) => state.product)

  const validateForm = () => {
    return (
      category_id &&
      attributes &&
      imageUrls.length > 0 &&
      sku &&
      product_name &&
      brand_id &&
      department &&
      description
    );
  };

  const handleSubmit = async () => {
    // if (validateForm()) {
    try {
      await createProduct({
        category_id,
        attributes,
        variants,
        imageUrls,
        sku,
        productName: product_name,
        brand_id,
        department,
        description,
        basePrice,
        finalPrice,
        taxRate,
        discount,
        currency,
        productCode,

        stockQuantity,
        status,
      } as unknown as any);
      alert("Product submitted successfully!");
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Failed to submit the product. Please try again.");
    }
    // } else {
    //   alert("Please fill all required fields!");
    // }
  };

  return (
    <div>
      <div className="flex justify-between items-center space-x-4 mt-6">
        <Link
          href={finalPrice ? "/admin/products/list_product/information" : ""}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Back
        </Link>
        <button
          title="submit"
          type="submit"
          onClick={handleSubmit}
          className="btn"
        >
          Save and Finish
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
