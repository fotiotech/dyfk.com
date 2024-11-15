"use server";

import Attribute from "@/models/Attributes";
import AttributeValue from "@/models/AttributeValue";
import Category from "@/models/Category";
import { connection } from "@/utils/connection";
import mongoose from "mongoose";

// Function to fetch category attributes and values
export async function findCategoryAttributesAndValues(categoryId: string) {
  await connection();

  const response = await Category.aggregate([
    // Match the specified category by _id
    { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },

    // Lookup attributes directly associated with the selected category
    {
      $lookup: {
        from: "attributes",
        localField: "_id",
        foreignField: "category_id",
        as: "directAttributes",
      },
    },

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

    // Lookup attributes within the ancestry hierarchy
    {
      $lookup: {
        from: "attributes",
        localField: "ancestry._id",
        foreignField: "category_id",
        as: "inheritedAttributes",
      },
    },

    // Merge direct and inherited attributes
    {
      $addFields: {
        allAttributes: {
          $concatArrays: ["$directAttributes", "$inheritedAttributes"],
        },
      },
    },

    // Unwind allAttributes to fetch attribute values per attribute
    { $unwind: "$allAttributes" },

    // Lookup attribute values for each attribute
    {
      $lookup: {
        from: "attributevalues",
        localField: "allAttributes._id",
        foreignField: "attribute_id",
        as: "allAttributes.attributeValues",
      },
    },

    // Group attributes by the 'group' field to organize by attribute groups
    {
      $group: {
        _id: {
          categoryId: "$_id",
          groupName: "$allAttributes.group",
        },
        categoryName: { $first: "$categoryName" },
        attributes: {
          $push: {
            attributeId: "$allAttributes._id",
            attributeName: "$allAttributes.name",
            attributeValues: "$allAttributes.attributeValues",
          },
        },
      },
    },

    // Group again to combine all groups under the category
    {
      $group: {
        _id: "$_id.categoryId",
        categoryName: { $first: "$categoryName" },
        groupedAttributes: {
          $push: {
            groupName: "$_id.groupName",
            attributes: "$attributes",
          },
        },
      },
    },

    // Project the final format
    {
      $project: {
        _id: 0,
        categoryId: "$_id",
        categoryName: 1,
        groupedAttributes: 1,
      },
    },
  ]);

  return response;
}

// Function to create a new attribute or select an existing attribute group
export async function createAttribute(formData: FormData) {
  await connection();

  const categoryId = formData.get("catId") as string;
  const groupName = formData.get("groupName") as string; // New field to handle group selection
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

  if (!categoryId || !attrNames.length || !attrValues.length) {
    console.error("Missing required data:", {
      categoryId,
      groupName,
      attrNames,
      attrValues,
    });
    return;
  }

  // Save attributes and associate them with the group
  const savedAttributes = await Promise.all(
    attrNames.map((name, index) =>
      new Attribute({
        name,
        category_id: categoryId,
        group: groupName, // Associate attribute with the group
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
