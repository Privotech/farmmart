import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "BUYER" | "SELLER" | "ADMIN";
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("farmmart_session_token")?.value;

    if (!token || !process.env.JWT_SECRET) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
