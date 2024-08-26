"use server";

import Product from "../../../../models/Product";
import { connection } from "@/utils/connection";
import { storage } from "@/utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const categoryId = formData.get("categoryId") as string | null;
    const sku = formData.get("sku") as string | null;
    const productName = formData.get("product_name") as string | null;
    const brandId = formData.get("brandId") as string | null;
    const department = formData.get("department") as string | null;
    const description = formData.get("description") as string | null;
    const price = formData.get("price") as string | null;
    const status = formData.get("status") as string | null;
    const files = formData.getAll("files") as File[];

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required." },
        { status: 400 }
      );
    }

    if (!productName) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    const urlSlug = generateSlug(productName, department);
    const dsin = generateDsin();

    await connection();

    const uploadedFiles: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const storageRef = ref(storage, `products/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedFiles.push(downloadURL);
      }
    }

    if (uploadedFiles && uploadedFiles.length > 0) {
      const newProduct = new Product({
        url_slug: urlSlug,
        dsin: dsin,
        sku: sku,
        productName: productName,
        category_id: new mongoose.Types.ObjectId(categoryId),
        price: price,
        imageUrls: uploadedFiles,
        department: department,
        description: description,
        // brand_id: new mongoose.Types.ObjectId(brandId as string),
        status: status,
        created_at: new Date().toISOString(),
        updated_ad: new Date().toISOString(),
      });

      console.log(newProduct);

      const savedProduct = await newProduct.save();

      return NextResponse.json(
        { message: "Product created successfully!", results: savedProduct },
        { status: 201 }
      );
    }
  } catch (e: any) {
    console.error("Error while processing the request:", e);
    return NextResponse.json(
      { error: e.message || "Something went wrong.", details: e },
      { status: 500 }
    );
  }
}
