"use client";
import Category from "@/app/(dashboard)/components/category/Category";
import Details from "@/app/(dashboard)/components/products/Details";
import BasicInformation from "@/app/(dashboard)/components/products/Information";
import { createProduct } from "@/app/actions/products";
import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

const AddProduct = () => {
  const {
    step,
    sku,
    product_name,
    brandId,
    department,
    description,
    price,
    imageUrls,
    categoryId,
    attributes,
  } = useSelector((state: RootState) => state.product);

  console.log('images urls:',{imageUrls}, categoryId, attributes);

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
          price,
        });
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
        {step === 2 && <BasicInformation />}
        {step === 3 && <Details handleSubmit={handleSubmit} />}
      </div>
    </div>
  );
};

export default AddProduct;
