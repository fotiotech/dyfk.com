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

// Utility function to generate variations
function generateVariations(variantAttributes: {
  [groupName: string]: { [attrName: string]: string[] };
}): Record<string, string>[] {
  // Flatten the attributes from all groups
  const flattenedAttributes: { [attrName: string]: string[] } = Object.entries(
    variantAttributes
  ).reduce((acc, [groupName, attributes]) => {
    Object.entries(attributes).forEach(([attrName, attrValues]) => {
      acc[attrName] = attrValues;
    });
    return acc;
  }, {} as { [attrName: string]: string[] });

  const keys = Object.keys(flattenedAttributes); // Attribute keys, e.g., ['Model', 'Weight']
  const values = Object.values(flattenedAttributes); // Attribute values, e.g., [['Galaxie S22', 'Galaxie A14'], ['1.5 kg', '250 g']]

  // Helper function to compute the cartesian product
  const cartesian = (arr: string[][]): string[][] =>
    arr.reduce<string[][]>(
      (acc, curr) => acc.flatMap((d) => curr.map((e) => [...d, e])),
      [[]] // Initial value is an array of empty arrays
    );

  // Generate combinations
  const combinations = cartesian(values);

  // Convert combinations into objects
  return combinations.map((combination) =>
    combination.reduce((obj, value, index) => {
      obj[keys[index]] = value;
      return obj;
    }, {} as Record<string, string>)
  );
}

export async function createProduct(
  categoryId: string,
  attributes: { [groupName: string]: { [attrName: string]: string[] } },
  variants: VariantState[], // Original structure
  files: string[],
  formData: Prod
) {
  const {
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
    upc,
    ean,
    gtin,
    stockQuantity,
    status,
  } = formData;

  if (productName === "" || categoryId === "") {
    return { error: "Product name and category ID are required." };
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

  // Create the new product
  const newProduct = new Product({
    url_slug: urlSlug,
    dsin: dsin,
    sku: sku,
    productName: productName,
    category_id: new mongoose.Types.ObjectId(categoryId),
    brand_id: new mongoose.Types.ObjectId(brand_id as string),
    department: department,
    description: description,
    basePrice,
    finalPrice,
    taxRate,
    discount,
    currency,
    upc: upc || null,
    ean: ean || null,
    gtin: gtin || null,
    stockQuantity,
    attributes: cleanedAttributes.length > 0 ? cleanedAttributes : null, // Set formatted attributes
    imageUrls: files,
    status: status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const savedProduct = await newProduct.save();

  // Saving variants using Promise.all to handle async correctly
  await Promise.all(
    variants.map(async (variant) => {
      const newVariant = new Variant({
        product: savedProduct._id,
        ...variant,
      });
      await newVariant.save();
    })
  );

  return savedProduct; // Optionally, return the saved product object
}

export async function updateProduct(
  id: string,
  categoryId: string,
  attributes: { [groupName: string]: { [attrName: string]: string[] } }, // Original structure
  files: string[],
  formData: Prod
) {
  await connection();

  if (id && formData) {
    const {
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
      upc,
      ean,
      gtin,
      stockQuantity,
      status,
    } = formData;

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
          productName,
          category_id: new mongoose.Types.ObjectId(categoryId) || null,
          brand_id: new mongoose.Types.ObjectId(brand_id as string) || null,
          department: department,
          description: description,
          basePrice,
          finalPrice,
          attributes: cleanedAttributes.length > 0 ? cleanedAttributes : null, // Set cleaned attributes
          imageUrls: files || null,
          taxRate,
          discount,
          currency,
          upc: upc || null,
          ean: ean || null,
          gtin: gtin || null,
          stockQuantity,
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
