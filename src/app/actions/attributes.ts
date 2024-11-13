"use server";

import Attribute from "@/models/Attributes";
import AttributeValue from "@/models/AttributeValue";
import Category from "@/models/Category";
import { connection } from "@/utils/connection";
import mongoose from "mongoose";

export async function findCategoryAttributesAndValues(categoryId: string) {
  await connection();

  const response = await Category.aggregate([
    // Match the specified category by _id
    { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },

    // Use $graphLookup to find the entire category hierarchy
    {
      $graphLookup: {
        from: "categories",
        startWith: "$parent_id",
        connectFromField: "parent_id",
        connectToField: "_id",
        as: "ancestry",
      },
    },

    // Lookup attributes within this hierarchy
    {
      $lookup: {
        from: "attributes",
        localField: "ancestry._id",
        foreignField: "category_id",
        as: "inheritedAttributes",
      },
    },

    // Unwind inheritedAttributes to fetch attribute values per attribute
    { $unwind: "$inheritedAttributes" },

    // Lookup attribute values for each attribute
    {
      $lookup: {
        from: "attributevalues",
        localField: "inheritedAttributes._id",
        foreignField: "attribute_id",
        as: "inheritedAttributes.attributeValues",
      },
    },

    // Group by category details and re-aggregate inheritedAttributes
    {
      $group: {
        _id: "$_id",
        categoryName: { $first: "$categoryName" },
        ancestry: { $first: "$ancestry" },
        inheritedAttributes: { $push: "$inheritedAttributes" },
      },
    },
  ]);

  console.log("Aggregated Response:", response);
  return response;
}

export async function createAttribute(formData: FormData) {
  await connection();

  const categoryId = formData.get("catId") as string;
  const attrNames: string[] = [];
  const attrValues: string[][] = []; // Array of arrays to hold multiple values per attribute

  // Process formData entries to manually collect attrNames and attrValues
  for (const [key, value] of formData.entries() as unknown as any) {
    if (key.startsWith("attrName")) {
      attrNames.push(value as string);
    } else if (key.startsWith("attrValue")) {
      // Split values by comma, trim extra spaces, and push as an array
      const values = (value as string).split(",").map((v) => v.trim());
      attrValues.push(values);
    }
  }

  console.log("Parsed Values:", { categoryId, attrNames, attrValues });

  if (!categoryId || !attrNames.length || !attrValues.length) {
    console.error("Missing required data:", {
      categoryId,
      attrNames,
      attrValues,
    });
    return;
  }

  // Save attributes asynchronously
  const savedAttributes = await Promise.all(
    attrNames.map((name, index) =>
      new Attribute({
        name,
        category_id: categoryId,
      }).save()
    )
  );

  // Save attribute values for each attribute
  const savedAttributeValues = await Promise.all(
    savedAttributes.flatMap((attribute, index) =>
      attrValues[index].map((value) =>
        new AttributeValue({
          attribute_id: attribute._id,
          value,
        }).save()
      )
    )
  );

  console.log("Saved Data:", { savedAttributes, savedAttributeValues });

  return { savedAttributes, savedAttributeValues };
}
