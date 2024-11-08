"use server";
import { cookies } from "next/headers";
import Session from "@/models/Session";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "@/app/lib/definitions";
import { ObjectId } from "mongoose";
import { connection } from "@/utils/connection";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export async function createSession(id: ObjectId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await connection();

  // 1. Create a session in the database
  const newSession = new Session({
    userId: id,
    expiresAt,
  });

  const sess = await newSession.save();

  const sessionId = sess._id;

  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId, expiresAt });

  // 3. Store the session in cookies for optimistic auth checks
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = cookies().get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  cookies().delete("session");
}
