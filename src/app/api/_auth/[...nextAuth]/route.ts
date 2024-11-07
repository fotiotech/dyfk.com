import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authOptions = {
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
};

export default NextAuth(authOptions);
