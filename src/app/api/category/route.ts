"use server";

import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { connection } from "@/utils/connection";
import Category from "@/models/Category";
import { storage } from "@/utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function generateSlug(name: string) {
  return slugify(name, { lower: true });
}

export async function GET(req: NextRequest) {
  await connection();

  const category = await Category.find();

  if (category) {
    return NextResponse.json({ results: category });
  } else {
    return NextResponse.json({ message: "Nothing found" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const categoryId = formData.get("categoryId") as string | null;
    const category_name = formData.get("category_name") as string | null;
    const description = formData.get("description") as string | null;

    if (!category_name) {
      return NextResponse.json(
        { error: "Category name is required." },
        { status: 400 }
      );
    }

    const url_slug = generateSlug(category_name + description);
    const files = formData.get("imageUrl") as File | null;

    if (!files) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 }
      );
    }

    const storageRef = ref(storage, `category/${files.name}`);
    await uploadBytes(storageRef, files);
    const downloadURL = await getDownloadURL(storageRef);

    await connection();
    const newCategory = new Category({
      url_slug: url_slug,
      categoryName: category_name,
      parent_id: categoryId,
      description: description,
      imageUrl: downloadURL,
    });
    const savedCategory = await newCategory.save();

    return NextResponse.json(
      {
        results: `Inserted successfully! ${savedCategory}`,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("Error while processing the request:\n", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
