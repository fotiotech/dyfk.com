// app/actions/brand.ts
"use server";

import Brand from "@/models/Brand";
import { connection } from "@/utils/connection";
import slugify from "slugify";

// Fetch all brands
export async function getBrands() {
  await connection();
  return await Brand.find({}).lean();
}

// Create a new brand

function generateSlug(name: string, logoUrl: string) {
  return slugify(`${name}${logoUrl ? `-${logoUrl}` : ""}`, {
    lower: true,
  });
}

export async function createBrand(data: { name: string; logoUrl?: string; status?: "active" | "inactive" }) {
  await connection();

  // Exclude `_id` from the data to let MongoDB generate it automatically
  if(data){
    const { name, logoUrl, status } = data;
  const url_slug = generateSlug(name, logoUrl as string);

  const newBrand = new Brand({url_slug, name, logoUrl, status });
  
  return await newBrand.save();
  }
}


// Update an existing brand
export async function updateBrand(
  id: string,
  data: Partial<{
    name: string;
    logoUrl: string;
    status: "active" | "inactive";
  }>
) {
  await connection();
  return await Brand.findByIdAndUpdate(id, data, { new: true });
}

// Delete a brand
export async function deleteBrand(id: string) {
  await connection();
  await Brand.findByIdAndDelete(id);
}
