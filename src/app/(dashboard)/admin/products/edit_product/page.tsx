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
import Category from "@/app/(dashboard)/components/category/Category";
import { Product } from "@/constant/types";

const EditDeleteProduct = () => {
  const productId = useSearchParams().get("id")?.toLowerCase();
  const router = useRouter();
  const dispatch = useAppDispatch();
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
              brand_id: productData.brand_id || "",
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
              category_id: productData.category_id || "",
              attributes: formattedAttributes,
              variants: variants,
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

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Edit Product</h3>
      <div>
        <Category />
      </div>
    </div>
  );
};

export default EditDeleteProduct;
