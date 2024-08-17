"use server";

import { connection } from "@/db/connection";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  try {
    await connection();
    const newUser = new User({
      username: username,
      email: email,
      password: password,
      role: "customer",
    });

    const savedUser = await newUser.save();
    return new NextResponse("User saved successfully:", savedUser);
  } catch (error) {
    console.error("Error creating user", error);
  }
}
