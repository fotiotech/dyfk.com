"use server";

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

export async function findProducts(id?: string) {
  await connection();

  if (id) {
    const products = await Product.find({ _id: id }).sort({ created_at: -1 });
    if (products) {
      return products;
    } else {
      console.log('Error');
    }
  } else {
    const products = await Product.find().sort({ created_at: -1 });
    if (products) {
      return products;
    } else {
      console.log("Nothing found");
    }
  }
}

export async function createProduct(
  categoryId: string,
  attributes: {},
  files: string[],
  formData: FormData,
) {
  const sku = formData.get("sku") as string | null;
  const product_name = formData.get("product_name") as string | null;
  const brandId = formData.get("brandId") as string;
  const department = formData.get("department") as string | null;
  const description = formData.get("description") as string | null;
  const price = formData.get("price") as string | null;
  const status = formData.get("status") as string | null;

  if (product_name === '' || categoryId === '') {
    return { error: "Product name is required." };
  }

  const urlSlug = generateSlug(product_name as string, department);
  const dsin = generateDsin();

  await connection();
  const newProduct = new Product({
    url_slug: urlSlug,
    dsin: dsin,
    sku: sku,
    productName: product_name,
    category_id: new mongoose.Types.ObjectId(categoryId),
    brand_id: new mongoose.Types.ObjectId(brandId),
    department: department,
    description: description,
    price: price,
    attributes: attributes,
    imageUrls: files,
    status: status,
    created_at: new Date().toISOString(),
    updated_ad: new Date().toISOString(),
  });

  const savedProduct = await newProduct.save();

  return savedProduct;
}

export async function updateProduct(
  id: string,
  categoryId: string,
  attributes: {},
  files: string[],
  formData: FormData,) {
    
  await connection();
  if(id && formData) {
  const sku = formData.get("sku") as string | null;
  const product_name = formData.get("product_name") as string | null;
  const brandId = formData.get("brandId") as string;
  const department = formData.get("department") as string | null;
  const description = formData.get("description") as string | null;
  const price = formData.get("price") as string | null;
  const status = formData.get("status") as string | null;



    const updatedProduct = await Product.findByIdAndUpdate( id, {
      $set: {
    sku: sku,
    productName: product_name,
    category_id: new mongoose.Types.ObjectId(categoryId),
    brand_id: new mongoose.Types.ObjectId(brandId),
    department: department,
    description: description,
    price: price,
    attributes: attributes,
    imageUrls: files,
    status: status,
    created_at: new Date().toISOString(),
    updated_ad: new Date().toISOString(),
      }
    }, {
    new: true,
  });
  return updatedProduct;
  }
  
}

export async function deleteProduct(id: string) {
  await connection();
  return await Product.findByIdAndDelete(id);
}
