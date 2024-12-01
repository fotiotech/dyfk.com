"use client";
import Category from "@/app/(dashboard)/components/category/Category";
import Details from "@/app/(dashboard)/components/products/Details";
import GeneralAttribute from "@/app/(dashboard)/components/products/GeneralAttributes";
import BasicInformation from "@/app/(dashboard)/components/products/BasicInfos";
import Offer from "@/app/(dashboard)/components/products/Offer";
import { createProduct } from "@/app/actions/products";
import { useAppSelector } from "@/app/hooks";
import React from "react";
import Information from "@/app/(dashboard)/components/products/Information";
import { Product } from "@/constant/types";

const AddProduct = () => {
  const {
    step,
    sku,
    product_name,
    brandId,
    department,
    description,
    finalPrice,
    imageUrls,
    categoryId,
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
  } = useAppSelector((state) => state.product);

  const validateForm = () => {
    return (
      categoryId &&
      attributes &&
      imageUrls.length > 0 &&
      sku &&
      product_name &&
      brandId &&
      department &&
      description
      // price > 0
    );
  };

  const files = imageUrls;

  const handleSubmit = async () => {
    // if (validateForm()) {
    try {
      await createProduct(categoryId, attributes, files, {
        sku,
        productName: product_name,
        brand_id: brandId,
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
        {step === 1 && <Category />}
        {step === 2 && <Information />}
        {step === 3 && <GeneralAttribute />}
        {step === 4 && <BasicInformation />}
        {step === 5 && <Offer />}
        {step === 6 && <Details handleSubmit={handleSubmit} />}
      </div>
    </div>
  );
};

export default AddProduct;
