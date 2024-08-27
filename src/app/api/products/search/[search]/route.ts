"use server";
import Product from "../../../../../models/Product";
import { connection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { search: string };
  }
) {
  try {
    await connection();

    if (params.search) {
      const products = await Product.find({
        productName: { $regex: params.search, $options: "i" },
      });

      if (products.length > 0) {
        return NextResponse.json({ results: products });
      } else {
        return NextResponse.json({ message: "Nothing found" }, { status: 404 });
      }
    } else {
      return NextResponse.json(
        { message: "Search parameter is missing" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
