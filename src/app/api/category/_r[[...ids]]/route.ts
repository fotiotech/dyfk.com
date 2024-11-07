import Brand from "@/models/Brand";
import Category from "@/models/Category";
import { connection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { ids: string[] };
  }
) {
  try {
    await connection();

    if (params.ids) {
      const category = await Category.findById({ _id: params.ids[0] });
      const subcategory = await Category.findById({ parent_id: params.ids[1] });
      const brand = await Brand.findById({ _id: params.ids[2] });

      return NextResponse.json({
        results: category,
        attributes: category.attributes,
        subcategory: subcategory,
        brand: brand,
      });
    } else {
      const category = await Category.find();
      const brand = await Brand.find();

      return NextResponse.json({ results: category, brand: brand });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
