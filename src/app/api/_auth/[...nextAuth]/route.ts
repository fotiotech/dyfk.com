import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connection } from "@/utils/connection";
import User from "@/models/users";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      return session;
    },
    async signIn({ user, account, profile }: any) {
      await connection();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        const newUser = new User({
          username: user.name,
          email: user.email,
          image: user.image,
          googleId: account?.providerAccountId,
        });

        await newUser.save();
      } else {
        existingUser.username = user.name;
        existingUser.email = user.email;
        existingUser.image = user.image;
        existingUser.googleId = account?.providerAccountId;

        await existingUser.save();
      }

      return true;
    },
  },
};

// Directly export the NextAuth handler with options
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
