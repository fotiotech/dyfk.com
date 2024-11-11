import Product from "@/models/Product";
import { connection } from "@/utils/connection";

export async function getSearch(query: string) {
  await connection();
  try {
    if (query) {
      const products = await Product.find({
        productName: { $regex: query, $options: "i" },
      });
      console.log(products);
      return products.length > 0
        ? products.map((prod) => ({
            ...prod?.toObject(),
            _id: prod._id?.toString(),
            category_id: prod.category_id?.toString(),
            brand_id: prod.brand_id?.toString(),
          }))
        : []; // Return empty array if no products found
    } else {
      return []; // Return empty array if no query provided
    }
  } catch (error) {
    console.error(error);
    return []; // Return empty array in case of error
  }
}
