"use server";

import { Product as Prod } from "@/constant/types";
import Product from "@/models/Product";
import { connection } from "@/utils/connection";
import mongoose, { ObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

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
    const products = await Product.find({ _id: id }).sort({ created_at: -1 });
    if (products) {
      return products.map((product) => ({
        ...product.toObject(),
        _id: product._id?.toString(),
        category_id: product.category_id?.toString(),
        brand_id: product.brand_id?.toString(),
        created_at: product.created_at?.toString(),
        updated_at: product.updated_at?.toString(),
      }));
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

export async function findProductDetails(dsin?: string): Promise<Prod | null> {
  try {
    await connection();

    if (dsin) {
      const product = await Product.findOne({ dsin });
      if (product) {
        return {
          ...product.toObject(),
          _id: product._id?.toString(),
          category_id: product.category_id?.toString() ?? null,
          brand_id: product.brand_id?.toString() ?? null,
          attributes: product.attributes?.map((attr: any) => ({
            ...attr.toObject(),
            _id: attr._id?.toString(),
          })),
        };
      }
    }
    // Explicitly return null if no product is found
    return null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    // Throw an error or return null to ensure consistent return type
    throw new Error("Failed to fetch product details");
  }
}

export async function createProduct(
  categoryId: string,
  attributes: { [groupName: string]: { [attrName: string]: string[] } }, // Original structure
  files: string[],
  formData: Prod
) {
  const { sku, productName, brand_id, department, description, price, status } =
    formData;

  if (productName === "" || categoryId === "") {
    return { error: "Product name is required." };
  }
  if (files) {
    console.log(categoryId, attributes, files, formData);
  }

  const urlSlug = generateSlug(productName as string, department);
  const dsin = generateDsin();

  // Reformat and clean up the attributes to remove unwanted keys
  const cleanedAttributes = Object.keys(attributes)
    .filter((groupName) => groupName !== "0") // Remove invalid group names like '0'
    .map((groupName) => {
      const group = attributes[groupName];

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
  const newProduct = new Product({
    url_slug: urlSlug,
    dsin: dsin,
    sku: sku,
    productName: productName,
    category_id: new mongoose.Types.ObjectId(categoryId),
    brand_id: new mongoose.Types.ObjectId(brand_id),
    department: department,
    description: description,
    price: price,
    attributes: cleanedAttributes.length > 0 ? cleanedAttributes : null, // Set formatted attributes
    imageUrls: files,
    status: status,
    created_at: new Date().toISOString(),
    updated_ad: new Date().toISOString(),
  });

  await newProduct.save();
}

export async function updateProduct(
  id: string,
  categoryId: string,
  attributes: { [groupName: string]: { [attrName: string]: string[] } }, // Original structure
  files: string[],
  formData: FormData
) {
  await connection();

  if (id && formData) {
    const sku = formData.get("sku") as string | null;
    const product_name = formData.get("product_name") as string | null;
    const brandId = formData.get("brandId") as string;
    const department = formData.get("department") as string | null;
    const description = formData.get("description") as string | null;
    const price = formData.get("price") as string | null;
    const status = formData.get("status") as string | null;

    // Reformat and clean up the attributes to remove unwanted keys
    const cleanedAttributes = Object.keys(attributes)
      .filter((groupName) => groupName !== "0") // Remove invalid group names like '0'
      .map((groupName) => {
        const group = attributes[groupName];

        // Ensure that each group only contains valid attributes
        const cleanedAttributesObj = Object.fromEntries(
          Object.entries(group).filter(([key]) => key !== "undefined") // Remove 'undefined' keys
        );

        return {
          groupName: groupName, // The group name itself
          attributes: cleanedAttributesObj, // Cleaned attributes inside that group
        };
      });

    const response = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          sku: sku,
          productName: product_name,
          category_id: new mongoose.Types.ObjectId(categoryId) || null,
          brand_id: new mongoose.Types.ObjectId(brandId) || null,
          department: department,
          description: description,
          price: price,
          attributes: cleanedAttributes.length > 0 ? cleanedAttributes : null, // Set cleaned attributes
          imageUrls: files || null,
          status: status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        new: true,
      }
    );

    console.log(cleanedAttributes, response);
  }

  revalidatePath("/admin/products/products_list");
}

export async function deleteProduct(id: string) {
  await connection();
  await Product.findByIdAndDelete(id);
}
