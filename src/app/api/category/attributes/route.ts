"use server";

import { NextRequest, NextResponse } from "next/server";
import { connection } from "@/utils/connection";

import Attribute from "@/models/Attributes";
import Attr_values from "@/models/Attr_values";

// GET request to fetch all attributes
export async function GET(req: NextRequest) {
  try {
    await connection();

    const attributes = await Attribute.find();

    if (attributes && attributes.length > 0) {
      return NextResponse.json({ results: attributes });
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
    const formData = await req.formData();

    const categoryId = formData.get("categoryId") as string | null;
    const attrName = formData.get("attrName") as string | null;
    const attrValue = formData.get("attrValue") as string | null;

    if (!attrName) {
      return NextResponse.json(
        { error: "Attribute name is required." },
        { status: 400 }
      );
    }

    await connection();

    // Create new attribute
    const newAttribute = new Attribute({
      category_id: categoryId,
      names: attrName,
      status: "active",
    });
    const savedAttribute = await newAttribute.save();

    // Save attribute values
    const attrValues = attrValue?.split(",").map((value) => value.trim());
    const savedAttrValues = [];

    if (attrValues && attrValues.length > 0) {
      for (const value of attrValues) {
        const newAttrValue = new Attr_values({
          id_attributes: savedAttribute._id,
          attr_values: value,
        });
        const savedValue = await newAttrValue.save();
        savedAttrValues.push(savedValue);
      }
    }

    return NextResponse.json(
      {
        message: "Attribute and values inserted successfully!",
        attribute: savedAttribute,
        attrValues: savedAttrValues,
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
