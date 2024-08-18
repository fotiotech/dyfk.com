"use server";

// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users";
import { connection } from "@/utils/connection";

export async function GET(req: NextRequest) {
  await connection();

  const result = await User.find();

  if (result) {
    return NextResponse.json({ results: result }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Nothing found" }, { status: 401 });
  }
}
