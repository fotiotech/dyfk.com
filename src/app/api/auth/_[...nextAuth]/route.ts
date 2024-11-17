import User from "@/models/users";
import { connection } from "@/utils/connection";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.AUTH_SECRET, // Add this if you're using AUTH_SECRET
  pages: {
    signIn: "/auth/login", // Optional: Customize sign-in page
  },
  callbacks: {
    async session({ session, token }) {
      // "use server";
      // Customize session object if needed
      return session;
    },
    async signIn({ user, account, profile }) {
      // "use server";
      await connection();
      // Check if the user already exists
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Create a new user if they don't exist
        const newUser = new User({
          username: user.name,
          email: user.email,
          image: user.image,
          googleId: account?.providerAccountId,
        });

        await newUser.save();
      } else {
        // Optional: Update existing user data if needed
        existingUser.username = user.name;
        existingUser.email = user.email;
        existingUser.image = user.image;
        existingUser.googleId = account?.providerAccountId;

        await existingUser.save();
      }

      // Allow the sign-in process to continue
      return true;
    },
    async redirect({ url, baseUrl }) {
      // "use server";
      // Redirect to the home page after sign-in
      return baseUrl; // This redirects to the base URL (home page)
    },
  },
});
