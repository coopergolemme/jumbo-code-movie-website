import { NextRequest, NextResponse } from "next/server";

export async function POST() {
    // Remove the session cookie by setting it to expire in the past
    // 
// 

  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        "Set-Cookie": `session=; Path=/; HttpOnly; SameSite=Lax; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      },
    }
  );
}
