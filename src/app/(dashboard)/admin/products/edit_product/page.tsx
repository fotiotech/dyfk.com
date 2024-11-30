"use client";

import React, { useEffect, useState } from "react";

import {
  findProducts,
  deleteProduct,
  updateProduct,
} from "@/app/actions/products";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setProductData, resetProduct } from "@/app/store/slices/productSlice";
import { useSelector } from "react-redux";
import BasicInformation from "@/app/(dashboard)/components/products/BasicInfos";
import { RootState } from "@/app/store/store";
import Category from "@/app/(dashboard)/components/category/Category";
import Details from "@/app/(dashboard)/components/products/Details";

const EditDeleteProduct = () => {
  const productId = useSearchParams().get("id")?.toLowerCase();
  const router = useRouter();
  const dispatch = useAppDispatch();
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
  } = useAppSelector((state) => state.product);

  useEffect(() => {
    async function fetchData() {
      if (productId) {
        const productData = await findProducts(productId);
        if (productData) {
          dispatch(
            setProductData({
              sku: productData.sku || "",
              product_name: productData.productName || "",
              categoryId: productData.category_id || "",
              brandId: productData.brand_id || "",
              department: productData.department || "",
              description: productData.description || "",
              finalPrice: productData.price || 0.0,
              attributes: productData.attributes?.map((attr: any) => ({
                groupName: attr.groupName || "",
                values: attr.values || [],
              })),
              imageUrls: productData.imageUrls || [],
              step: 1,
            })
          );
        }
      }
    }

    fetchData();

    // Cleanup function when unmounting or when productId changes
    return () => {
      dispatch(resetProduct()); // Directly dispatch resetProduct
    };
  }, [productId, dispatch]); // Add dispatch as a dependency

  const handleDeleteProduct = async () => {
    if (productId) {
      await deleteProduct(productId);
      router.push("/dashboard/products");
    }
  };

  const files = imageUrls;

  const handleSubmit = async () => {
    // if (validateForm()) {
    try {
      await updateProduct(productId as string, categoryId, attributes, files, {
        sku,
        productName: product_name,
        brand_id: brandId,
        department,
        description,
        price: finalPrice,
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

  if (!step) {
    console.warn("Step is not set!");
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Edit Product</h3>
      <div>
        {step === 1 && <Category />}
        {step === 2 && <BasicInformation />}
        {step === 3 && <Details handleSubmit={handleSubmit} />}
      </div>
    </div>
  );
};

export default EditDeleteProduct;
