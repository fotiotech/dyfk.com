"use server";

import { NextRequest, NextResponse } from "next/server";
import { connection } from "@/utils/connection";

import Category from "@/models/Category";

// GET request to fetch all attributes
export async function GET(req: NextRequest) {
  try {
    await connection();

    const attrs = await Category.find();

    if (attrs) {
      return NextResponse.json({ results: attrs });
    } else {
      return NextResponse.json({ message: "Nothing found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching attributes:\n", error);
    return NextResponse.json(
      { error: "Failed to fetch attributes." },
      { status: 500 }
    );
  }
}

// POST request to create a new attribute and its values
export async function POST(req: NextRequest) {
  try {
    const { categoryId, attributes } = await req.json();

    if (!categoryId || !attributes) {
      return NextResponse.json(
        { error: "Attribute name or category is required." },
        { status: 400 }
      );
    }

    await connection();

    // Create new attribute

    const savedAttribute = await Category.findOneAndUpdate(
      { _id: categoryId },
      {
        attributes: attributes,
      }
    );

    console.log(savedAttribute);

    return NextResponse.json(
      {
        message: "Attribute and values inserted successfully!",
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
