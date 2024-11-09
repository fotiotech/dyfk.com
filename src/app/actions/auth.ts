"use server";
import {
  FormState,
  LoginFormState,
  SigninFormSchema,
  SignupFormSchema,
} from "@/app/lib/definitions";
import User from "@/models/users";
import { createSession, deleteSession, updateSession } from "../lib/session";
import { redirect } from "next/navigation";
import { connection } from "@/utils/connection";
import { verifySession } from "../lib/dal";
import Customer from "@/models/Customer";

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
    new Customer({ userId: user._id });
    // 5. Redirect user
    redirect("/auth/login");
  }
}

export async function signin(
  state:
    | false
    | { errors: { email?: string[]; password?: string[] } }
    | undefined,
  formData: FormData
) {
  const session = await verifySession();

  // Validate form fields
  const validatedFields = SigninFormSchema.safeParse({
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
  const { email, password } = validatedFields.data;

  await connection();

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (session) {
      await updateSession();
    } else {
      await createSession(user._id);
    }
    if (session) {
      new Customer({ userId: user._id });
      redirect("/");
    }
  } else {
    return false;
  }
}

export async function logout(id: string) {
  deleteSession(id);
  redirect("/auth/login");
}
