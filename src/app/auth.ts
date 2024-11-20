import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import User from "@/models/users";
import type { Users } from "@/constant/types";
import { connection } from "@/utils/connection";
import bcrypt from "bcrypt";
import { verifySession } from "./lib/dal";
import { updateSession, createSession } from "./lib/session";

// async function getUserData(email: string): Promise<Users | undefined> {
//   try {
//     await connection();
//     // Find the user by their id from the session
//     const currentUser = await User.findOne({ email });

//     return currentUser;
//   } catch (error) {
//     console.error("Failed to fetch user:", error);
//     throw new Error("Failed to fetch user.");
//   }
// }

// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         if (!credentials) return null;

//         const parsedCredentials = z
//           .object({
//             email: z
//               .string()
//               .email({ message: "Please enter a valid email." })
//               .trim(),
//             password: z
//               .string()
//               .min(8, { message: "Be at least 8 characters long" })
//               .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
//               .regex(/[0-9]/, { message: "Contain at least one number." })
//               .regex(/[^a-zA-Z0-9]/, {
//                 message: "Contain at least one special character.",
//               })
//               .trim(),
//           })
//           .safeParse(credentials);

//         if (parsedCredentials.success) {
//           const { email, password } = parsedCredentials.data;
//           const user = await getUserData(email as string);
//           if (!user) return null;
//           const passwordsMatch = await bcrypt.compare(
//             password as string,
//             user.password as string
//           );

//           if (passwordsMatch) {
//             console.log("password match");
//             return null;
//           }

//           if (!passwordsMatch) {
//             console.log("Invalid credentials");
//             return null;
//           }

//           const session = await verifySession();
//           if (session) {
//             const res = await updateSession();
//             console.log(res);
//           } else {
//             await createSession(user._id as string);
//           }
//           // Ensure the user is returned to NextAuth for a successful login
//           return {
//             id: user._id,
//             email: user.email,
//             name: user.username, // Include fields required by your app
//             role: user.role, // Include fields required by your app
//           };
//         }

//         console.log("Invalid credentials");
//         return null;
//       },
//     }),
//   ],
// });
