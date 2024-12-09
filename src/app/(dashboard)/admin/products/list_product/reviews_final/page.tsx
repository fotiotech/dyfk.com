"use client";
import { createProduct } from "@/app/actions/products";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import React, { useEffect, useState } from "react";
import { Product } from "@/constant/types";
import Link from "next/link";
// import { persistor } from "@/app/store/store";
import { clearProduct, ProductState } from "@/app/store/slices/productSlice";

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
    variantAttributes,
  } = useAppSelector((state) => state.product);

  const dispatch = useAppDispatch();
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
      const res = await createProduct({
        category_id,
        attributes,
        variants,
        imageUrls,
        sku,
        product_name,
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
        variantAttributes,
      } as unknown as ProductState);

      if (res) {
        alert("Product submitted successfully!");

        // Clear Redux persisted data and reset state
        //persistor.purge(); // Clear persisted data
        //dispatch(clearProduct()); // Reset Redux state
      }
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
