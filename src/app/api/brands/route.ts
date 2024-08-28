import Brand from "@/models/Brand";
import { connection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connection();

  const brand = await Brand.find();

  if (brand) {
    return NextResponse.json({ results: brand });
  } else {
    return NextResponse.json({ message: "Nothing found" }, { status: 401 });
  }
}
