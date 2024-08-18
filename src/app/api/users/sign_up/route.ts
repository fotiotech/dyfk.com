"use server";

import { connection } from "@/utils/connection";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, email, password, role } = await req.json();

  try {
    await connection();
    const newUser = new User({
      username,
      email,
      password,
      role,
      status: "active",
    });

    const savedUser = await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        user: savedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user", error);
    return NextResponse.json(
      { message: "Error creating user", error: error.message },
      { status: 500 }
    );
  }
}
