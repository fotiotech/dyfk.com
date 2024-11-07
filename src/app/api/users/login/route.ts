// app/api/auth/login/route.ts
"use server";

import { generateToken } from "@/utils/jwt";
import { connection } from "@/utils/connection";
import User from "@/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Connect to the database
  await connection();

  console.log(NextResponse);

  // Parse the request body
  const { email, password } = await req.json();

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generate a JWT token
      const token = generateToken({
        ...user.toObject(),
      });

      // Respond with user details and success message
      return NextResponse.json({
        token,
        result: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        message: "Login successfully",
      });
    } else {
      // Respond with an error if credentials are invalid
      return NextResponse.json({ message: "Invalid credentials" });
    }
  } catch (error) {
    // Handle any errors during the process
    console.error(error);
    return NextResponse.json({ message: "Internal server error" });
  }
}
