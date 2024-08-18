// middleware/auth.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
import { connection } from "@/utils/connection";
import User from "@/models/users";

export async function protectRoute(
  req: NextRequest
): Promise<NextResponse | null> {
  await connection();

  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Not authorized, no token" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as { id: string };
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { message: "Not authorized, user not found" },
        { status: 401 }
      );
    }
    (req as any).user = user; // Attach user to the request object
    return null;
  } catch (error) {
    return NextResponse.json(
      { message: "Not authorized, token failed" },
      { status: 401 }
    );
  }
}
