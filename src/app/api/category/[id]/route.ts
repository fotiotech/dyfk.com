import Category from "@/models/Category";
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
      const category = await Category.findById({ _id: params.id });

      if (category) {
        return NextResponse.json({ results: category });
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
