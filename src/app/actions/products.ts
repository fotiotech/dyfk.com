"use server";

import { Product as Prod } from "@/constant/types";
import Product from "@/models/Product";
import "@/models/Brand";
import { connection } from "@/utils/connection";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { Variant } from "@/models/Variant";
import { VariantAttribute } from "@/models/VariantAttributes";
import { ProductState } from "../store/slices/productSlice";

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

// Define return type for `findProductDetails`
interface ProductDetails {
  _id: string;
  category_id: string | null;
  brand_id: { _id: string; name: string } | null;
  attributes: Array<any>;
  variantAttributes: Array<any>;
  [key: string]: any;
}

export async function findProductDetails(
  dsin?: string
): Promise<ProductDetails | null> {
  try {
    // Ensure database connection is established
    await connection();

    if (dsin) {
      // Find product by dsin, and populate the brand information
      const product = await Product.findOne({ dsin }).populate(
        "brand_id",
        "name"
      );

      if (product) {
        // Find variant attributes related to the product
        const variantAttributes = await VariantAttribute.find({
          product_id: product._id,
        });

        console.log("Product details:", product);
        console.log("Variant attributes:", variantAttributes);

        // Return sanitized product details
        return {
          // Safely convert to object, and ensure proper conversion of fields
          ...product.toObject(),
          _id: product._id?.toString(),
          category_id: product.category_id?.toString() ?? null,
          brand_id: product.brand_id
            ? {
                _id: product.brand_id._id?.toString(),
                name: product.brand_id.name,
              }
            : null,
          variantAttributes: variantAttributes.map((variant: any) => ({
            ...variant.toObject(),
            _id: variant._id.toString(),
            product_id: variant.product_id.toString(),
          })),
        };
      }
    }

    // Return null if no product is found
    return null;
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching product details:", error);
    // Optionally, rethrow the error or return null
    throw new Error("Failed to fetch product details.");
  }
}

interface VariantDetails {
  _id: string;
  variantAttributesId: string;
  [key: string]: any;
}

export async function findVariantDetails(
  product_id: string,
  variantName: string
): Promise<VariantDetails | null> {
  try {
    await connection();

    if (product_id && variantName) {
      const variant = await Variant.findOne(
        { product_id, variantName } // Ensure proper filtering
      );

      if (variant) {
        return {
          ...variant.toObject(),
          _id: variant?._id.toString(),
          product_id: variant.product_id?.toString(),
        };
      }
    }

    return null; // Return null if no variant is found
  } catch (error) {
    console.error("Error fetching variant details:", error);
    throw new Error("Failed to fetch variant details.");
  }
}

export async function createProduct(formData: ProductState) {
  const {
    category_id,
    attributes,
    variants,
    variantAttributes,
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
  } = formData;

  if (!product_name || !category_id) {
    throw new Error("Product name and category ID are required.");
  }

  const urlSlug = generateSlug(product_name, department);
  const dsin = generateDsin();

  const cleanedAttributes = Object.entries(attributes || {})
    .filter(([groupName]) => groupName !== "0")
    .map(([groupName, group]) => ({
      groupName,
      attributes: Object.fromEntries(
        Object.entries(group).filter(([key]) => key !== "undefined")
      ),
    }));

  await connection();

  const newProduct = new Product({
    url_slug: urlSlug,
    dsin,
    sku,
    productName: product_name,
    category_id: category_id.toString(),
    brand_id: brand_id
      ? typeof brand_id === "string"
        ? brand_id.toString()
        : brand_id?._id.toString()
      : null,
    department,
    description,
    basePrice,
    finalPrice,
    taxRate,
    discount,
    currency,
    // productCode,
    stockQuantity,
    attributes: cleanedAttributes.length > 0 ? cleanedAttributes : null,
    imageUrls: imageUrls || [],
    status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const savedProduct = await newProduct.save();

  if (!savedProduct) throw new Error("Failed to save the product.");

  const flattenedAttributes = Object.entries(variantAttributes?.general!).map(
    ([name, values]) => ({
      name,
      values,
    })
  );

  const variantAttributesSaved = await Promise.all(
    flattenedAttributes.map(async (attribute) => {
      const variantAttribute = new VariantAttribute({
        product_id: savedProduct?._id.toString(),
        name: attribute.name,
        values: attribute.values,
      });

      return await variantAttribute.save();
    })
  );

  console.log(variants);

  const variantsSaved = await Promise.all(
    variants.map(async (variant) => {
      const newVariant = new Variant({
        product_id: savedProduct?._id.toString(), // Map relevant IDs
        url_slug: generateDsin(),
        dsin: generateDsin(),
        sku: generateDsin(),
        productName: variant?.productName,
        variantName: variant?.variantName,
        brand_id: variant?.brand_id ? variant?.brand_id.toString() : null,
        category_id: variant?.category_id?.toString(),
        department: variant.department,
        description: variant.description || "",
        basePrice: variant.basePrice,
        finalPrice: variant.finalPrice,
        taxRate: variant.taxRate || 0,
        discount: variant.discount || null,
        currency: variant.currency || "CFA",
        stockQuantity: variant.stockQuantity,
        attributes: variant.attributes || [],
        variantAttributes: variant.variantAttributes || [],
        imageUrls: variant.imageUrls || [],
        // VProductCode: generateDsin(),
        status: variant.status || "active",
      });

      return await newVariant.save();
    })
  );

  return { product: savedProduct, variantAttributesSaved, variantsSaved };
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
    revalidatePath("/admin/products/products_list");
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string) {
  await connection();
  await Product.findByIdAndDelete(id);
}
