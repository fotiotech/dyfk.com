"use server";

// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users";
import { generateToken } from "@/utils/jwt";
import { connection } from "@/utils/connection";

export async function POST(req: NextRequest) {
  await connection();

  const { email, password } = await req.json();

  const result = await User.findOne({ email });

  if (result && (await result.matchPassword(password))) {
    const token = generateToken(result._id.toString());
    return NextResponse.json({ token, result, message: "Login successfully" }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
