import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/app/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, userId } = body;
  console.log("POST /api/auth called with body:", body);

  if (type === "create-session") {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          "Set-Cookie": `session=${session}; Path=/; HttpOnly; SameSite=Lax; Secure; Expires=${expiresAt.toUTCString()}`,
        },
      }
    );
  }

  return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
}
