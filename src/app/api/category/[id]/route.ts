import Product from "@/models/Product";
import { connection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    await connection();

    if (params.id) {
      const products = await Product.findById(params.id);

      if (products.length > 0) {
        return NextResponse.json({ results: products });
      } else {
        return NextResponse.json({ message: "Nothing found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
