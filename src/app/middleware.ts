// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the paths that need protection
const protectedPaths = ["/admin"];

// Function to check if the user is authenticated
const isAuthenticated = (request: NextRequest) => {
  // Example: Check if user has a valid token stored in cookies
  const token = request.cookies.get("authToken")?.value;
  return token !== undefined; // Replace this with your actual authentication logic
};

// Function to check if the user has admin role (optional)
const isAdmin = (request: NextRequest) => {
  // Example: Check user role stored in cookies or headers
  const role = request.cookies.get("userRole")?.value;
  return role === "admin"; // Replace with your role-checking logic
};

// Middleware function
export function middleware(request: NextRequest) {
  // Check if the request path starts with any of the protected paths
  if (
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    // Check if the user is authenticated
    if (!isAuthenticated(request) || !isAdmin(request)) {
      // Redirect to login page if not authenticated or not an admin
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Continue to the requested route
  return NextResponse.next();
}

// Configure which paths the middleware should be applied to
export const config = {
  matcher: ["/admin/:path*"], // Protect /admin and all its subroutes
};
