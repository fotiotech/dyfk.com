"use server"

import Category from "@/models/Category";
import { connection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connection();
  const { id } = params;

  const category = await Category.find({ _id: id });

  if (category) {
    return NextResponse.json({ results: category });
  } else {
    return NextResponse.json({ message: "Nothing found" }, { status: 401 });
  }
}
