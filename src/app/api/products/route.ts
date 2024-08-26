"use server";
import Product from "@/models/Products";
import { connection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connection();

  const products = await Product.find();

  if (products) {
    return NextResponse.json({ results: products });
  } else {
    return NextResponse.json({ message: "Nothing found" }, { status: 401 });
  }
}
