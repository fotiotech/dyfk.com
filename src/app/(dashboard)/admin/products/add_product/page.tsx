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

  const files = imageUrls;

  const handleSubmit = async () => {
    // if (validateForm()) {
    try {
      await createProduct(category_id, attributes, variants, files, {
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
        upc,
        ean,
        gtin,
        stockQuantity,
        status,
      } as Product);
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
      <h3 className="text-lg font-bold mb-4">Add Product</h3>
      <div>
        <Category />
      </div>
      {validateForm() && (
        <button title="submit" type="submit" onClick={handleSubmit}>
          Save and Finish
        </button>
      )}
    </div>
  );
};

export default AddProduct;
