"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "../auth";
import { FormState, SigninFormSchema, SignupFormSchema } from "./definitions";
import { redirect, useRouter } from "next/navigation";
import { createSession, deleteSession } from "./session";
import Customer from "@/models/Customer";
import User from "@/models/users";
import { connection } from "@/utils/connection";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Call the provider or db to create a user...

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data;

  await connection();

  const data = await User.findOne({ email });

  if (data) {
    return redirect("/auth/login");
  } else {
    // 3. Insert the user into the database or call an Auth Library's API
    const newUser = new User({
      username: name,
      email: email,
      password: password,
      role: "customer",
      status: "active",
    });

    const user = await newUser.save();

    if (!user) {
      return {
        message: "An error occurred while creating your account.",
      };
    }

    // Current steps:
    // 4. Create user session
    await createSession(user._id);

    const newCustomer = new Customer({ userId: user._id });
    await newCustomer.save();

    // 5. Redirect user
    redirect("/auth/login");
  }
}

export async function authenticate(
  state:
    | false
    | { errors: { email?: string[]; password?: string[] } }
    | undefined,
  formData: FormData
) {
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const response = await signIn("credentials", {
    ...Object.fromEntries(formData.entries()),
    redirect: false,
    callbackUrl: process.env.NEXT_PUBLIC_API_URL, // Replace with your desired callback URL
  });

  if (!response) {
    // Handle sign-in error
    throw new AuthError("Invalid credentials");
  }

  if (response) {
    redirect("/"); // Redirect on success
  } else {
    console.error("Login failed:", response?.error);
  }
}

export async function logout(id: string) {
  deleteSession(id);
  const response = await signOut();
  console.log(response);
  if (response) {
    redirect("/auth/login");
  }
}
