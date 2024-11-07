"use server";
import Product from "../../../../../models/Product";
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
  await connection();

  const products = await Product.find({ _id: params.id });

  if (products) {
    return NextResponse.json({ results: products[0] });
  } else {
    return NextResponse.json({ message: "Nothing found" }, { status: 401 });
  }
}
