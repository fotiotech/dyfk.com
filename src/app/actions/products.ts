"use server";

import { Product as Prod } from "@/constant/types";
import Product from "@/models/Product";
import "@/models/Brand";
import { connection } from "@/utils/connection";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { VariantState } from "../store/slices/productSlice";
import { Variant } from "@/models/Variant";

// Generate a slug from the product name and department
function generateSlug(name: string, department: string | null) {
  return slugify(`${name}${department ? `-${department}` : ""}`, {
    lower: true,
  });
}

// Generate a random DSIN (Digital Serial Identification Number)
function generateDsin() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWYZ0123456789";
  let dsin = "";
  for (let i = 0; i < 10; i++) {
    dsin += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return dsin;
}

export async function getProductsByAttributes(filters: {
  brand?: string;
  priceRange?: [number, number];
  tags?: string[];
}) {
  await connection();

  const query: any = {};

  if (filters.brand) query.brand = filters.brand;
  if (filters.priceRange)
    query.price = { $gte: filters.priceRange[0], $lte: filters.priceRange[1] };
  if (filters.tags && filters.tags.length > 0)
    query.tags = { $in: filters.tags };

  const products = await Product.find(query).populate("tags", "name");
  return products;
}

export async function findProducts(id?: string) {
  await connection();

  if (id) {
    const product = await Product.findOne({ _id: id });
    if (product) {
      console.log(product);
      return {
        ...product.toObject(),
        _id: product._id?.toString(),
        category_id: product.category_id?.toString(),
        brand_id: product.brand_id?.toString(),
        attributes: product.attributes?.map((attr: any) => ({
          ...attr.toObject(),
          _id: attr._id?.toString(),
        })),
      };
    } else {
      console.log("Error");
    }
  } else {
    const products = await Product.find().sort({ created_at: -1 });
    if (products) {
      return products.map((prod) => ({
        ...prod.toObject(),
        _id: prod._id.toString(),
        category_id: prod.category_id?.toString(),
        brand_id: prod.brand_id?.toString(),
        attributes: prod.attributes?.map((attr: any) => ({
          ...attr.toObject(),
          _id: attr._id?.toString(),
        })),
      }));
    } else {
      console.log("Nothing found");
    }
  }
}

export async function findProductDetails(dsin?: string) {
  try {
    await connection();
    console.log(mongoose.modelNames());
    if (dsin) {
      const product = await Product.findOne({ dsin }).populate(
        "brand_id",
        "name"
      );
      const variants = await Variant.find({ product_id: product._id });
      if (product) {
        return {
          ...product.toObject(),
          _id: product._id?.toString(),
          category_id: product.category_id?.toString() ?? null,
          brand_id: product.brand_id?._id
            ? {
                _id: product.brand_id._id.toString(),
                name: product.brand_id.name,
              }
            : null,
          attributes: product.attributes?.map((attr: any) => ({
            ...attr.toObject(),
            _id: attr._id?.toString(),
          })),
          variants: variants.map((variant: any) => ({
            ...variant.toObject(),
            _id: variant._id.toString(),
            product_id: variant.product_id.toString(),
          })),
        };
      }
    }
    // Explicitly return null if no product is found
    return null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    // Throw an error or return null to ensure consistent return type
    // throw new Error("Failed to fetch product details");
  }
}

export async function createProduct(formData: Prod) {
  const {
    category_id,
    attributes,
    variants,
    imageUrls,
    sku,
    productName,
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
  } = formData;

  if (productName === "" || category_id === "") {
    return { error: "Product name and category ID are required." };
  }

  if (imageUrls) {
    console.log(category_id, attributes, imageUrls, formData);
  }

  const urlSlug = generateSlug(productName as string, department);
  const dsin = generateDsin();

  // Reformat and clean up the attributes to remove unwanted keys
  const cleanedAttributes = Object.keys(attributes as unknown as any)
    .filter((groupName) => groupName !== "0") // Remove invalid group names like '0'
    .map((groupName) => {
      const group = attributes![groupName as unknown as number];

      // Ensure that each group only contains valid attributes
      const cleanedAttributesObj = Object.fromEntries(
        Object.entries(group).filter(([key]) => key !== "undefined") // Remove 'undefined' keys
      );

      return {
        groupName: groupName, // The group name itself
        attributes: cleanedAttributesObj, // Cleaned attributes inside that group
      };
    });

  await connection();

  // Create the new product
  const newProduct = new Product({
    url_slug: urlSlug,
    dsin: dsin,
    sku: sku,
    productName: productName,
    category_id: new mongoose.Types.ObjectId(category_id),
    brand_id: new mongoose.Types.ObjectId(brand_id as string),
    department: department,
    description: description,
    basePrice,
    finalPrice,
    taxRate,
    discount,
    currency,
    productCode,
    stockQuantity,
    attributes: cleanedAttributes.length > 0 ? cleanedAttributes : null, // Set formatted attributes
    imageUrls,
    status: status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const savedProduct = await newProduct.save();

  // Saving variants using Promise.all to handle async correctly
  await Promise.all(
    variants.map(async (variant) => {
      const newVariant = new Variant({
        product_id: savedProduct._id,
        ...variant,
      });
      await newVariant.save();
    })
  );
}

export async function updateProduct(id: string, formData: Prod) {
  try {
    // Connect to the database
    await connection();

    if (!id || !formData) throw new Error("Invalid product ID or formData");

    const {
      category_id,
      attributes,
      variants,
      imageUrls,
      sku,
      productName,
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
    } = formData;

    // Clean attributes
    const cleanedAttributes = Object.keys(attributes || {})
      .filter((groupName) => groupName !== "0")
      .map((groupName) => {
        const group = attributes![groupName as keyof typeof attributes];

        const cleanedAttributesObj = Object.fromEntries(
          Object.entries(group || {}).filter(([key]) => key !== "undefined")
        );

        return {
          groupName,
          attributes: cleanedAttributesObj,
        };
      });

    // Update product
    const response = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          sku,
          productName,
          category_id: category_id
            ? new mongoose.Types.ObjectId(category_id)
            : null,
          brand_id: brand_id
            ? new mongoose.Types.ObjectId(brand_id as string)
            : null,
          department,
          description,
          basePrice,
          finalPrice,
          attributes: cleanedAttributes.length > 0 ? cleanedAttributes : null,
          imageUrls,
          taxRate,
          discount,
          currency,
          productCode,
          stockQuantity,
          status,
          updated_at: new Date(),
        },
      },
      { new: true }
    );

    if (!response) throw new Error("Product not found");

    // Update variants
    if (variants?.length > 0) {
      await Promise.all(
        variants.map(async (variant) => {
          await Variant.findByIdAndUpdate(
            variant._id, // Ensure _id exists in variant
            {
              $set: { ...variant, product_id: response._id },
            },
            { new: true, upsert: true } // Upsert to create a new variant if it doesn't exist
          );
        })
      );
    }

    // Revalidate cache for updated product list
    await revalidatePath("/admin/products/products_list");

    return response; // Return the updated product
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string) {
  await connection();
  await Product.findByIdAndDelete(id);
}
