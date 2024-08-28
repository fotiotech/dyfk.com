"use server";

// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/utils/jwt";
import { connection } from "@/utils/connection";
import User from "@/models/users";

export async function POST(req: NextRequest) {
  await connection();

  const { email, password } = await req.json();

  const result = await User.findOne({ email });

  if (result && (await result.matchPassword(password))) {
    // Generate a JWT token
    const token = generateToken(result._id.toString());

    // Set cookies with the token and user role (if applicable)
    const response = NextResponse.json(
      { token, result, message: "Login successfully" },
      { status: 200 }
    );

    // Set authentication token in cookies
    response.cookies.set("authToken", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      path: "/", // Cookie is available across the entire site
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Set user role (adjust according to your data structure)
    response.cookies.set("userRole", result.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } else {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
