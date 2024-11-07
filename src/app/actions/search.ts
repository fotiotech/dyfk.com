import Product from "@/models/Product";
import { connection } from "@/utils/connection";
import mongoose from "mongoose";

export async function getSearch(query: string) {
  try {
    await connection();

    if (query) {
      const products = await Product.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { category_id: new mongoose.Types.ObjectId(query) }
        ]
      });

      return products.length > 0 ? products : []; // Return empty array if no products found
    } else {
      return []; // Return empty array if no query provided
    }
  } catch (error) {
    console.error(error);
    return []; // Return empty array in case of error
  }
}
