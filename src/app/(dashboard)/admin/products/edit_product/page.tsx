"use client";

import React, { useEffect } from "react";

import {
  findProducts,
  deleteProduct,
  updateProduct,
} from "@/app/actions/products";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setProductData, resetProduct } from "@/app/store/slices/productSlice";
import BasicInformation from "@/app/(dashboard)/components/products/BasicInfos";
import Category from "@/app/(dashboard)/components/category/Category";
import Details from "@/app/(dashboard)/components/products/Details";
import { Product } from "@/constant/types";
import Information from "@/app/(dashboard)/components/products/Information";
import GeneralAttribute from "@/app/(dashboard)/components/products/GeneralAttributes";
import Offer from "@/app/(dashboard)/components/products/Offer";

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

  useEffect(() => {
    async function fetchData() {
      if (productId) {
        const productData = await findProducts(productId);

        // Format the attributes according to the new structure
        const formattedAttributes =
          productData.attributes?.map(
            (group: {
              groupName: string;
              attributes: Map<string, string[]>;
            }) => {
              // Convert the Map to an array of { attrName, attrValue }
              const formattedAttributesArray = Array.from(
                group.attributes.entries()
              ).map(([key, value]) => ({
                attrName: key,
                attrValue: value, // No casting needed as Map's value is already string[]
              }));

              return {
                groupName: group.groupName,
                attributes: formattedAttributesArray, // Matches AttributeType
              };
            }
          ) || [];

        if (productData) {
          console.log(productData);
          dispatch(
            setProductData({
              sku: productData.sku || "",
              product_name: productData.productName || "",
              brandId: productData.brand_id || "",
              department: productData.department || "",
              description: productData.description || "",
              basePrice: productData.basePrice || 0.0,
              finalPrice: productData.price || 0.0,
              taxRate: productData.taxRate || 0,
              discount: productData.discount || null,
              currency: productData.currency || "XAF",
              upc: productData.upc || "",
              ean: productData.ean || "",
              gtin: productData.gtin || "",
              status: productData.status || "",
              stockQuantity: productData.stockQuantity || 0,
              imageUrls: productData.imageUrls || [],
              categoryId: productData.category_id || "",
              attributes: formattedAttributes,
              step: 1, // Reset to the first step
            })
          );
        }
      }
    }

    fetchData();

    // Cleanup function when unmounting or when productId changes
    return () => {
      dispatch(resetProduct());
    };
  }, [productId, dispatch]);

  // Add dispatch as a dependency

  const handleDeleteProduct = async () => {
    if (productId) {
      await deleteProduct(productId);
      router.push("/dashboard/products");
    }
  };

  const files = imageUrls;

  const handleSubmit = async () => {
    try {
      await updateProduct(productId as string, categoryId, attributes, files, {
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
      } as Product);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update the product. Please try again.");
    }
  };

  if (!step) {
    console.warn("Step is not set!");
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Edit Product</h3>
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

export default EditDeleteProduct;
