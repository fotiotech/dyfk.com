export { auth as middleware } from "./auth";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./lib/dal";

export default async function middleware(req: NextRequest) {
  const session = await verifySession();
  console.log(session);
  const userRole = session?.role;

  // If there is no token, redirect to login page
  if (userRole !== "admin") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/admin/:path*"],
};
