// export { auth as middleware } from "./auth";
import { NextRequest } from "next/server";
import { verifySession } from "./lib/dal";

export async function middleware(request: NextRequest) {
  const session = await verifySession();

  if (
    session?.role === "admin" &&
    !request.nextUrl.pathname.startsWith("/admin")
  ) {
    return Response.redirect(new URL("/admin", request.url));
  }

  if (
    session?.role !== "admin" &&
    !request.nextUrl.pathname.startsWith("/login")
  ) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/path:*"],
};
