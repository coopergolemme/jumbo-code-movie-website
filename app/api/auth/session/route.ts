import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decrypt } from "@/app/lib/session";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("session")?.value;
  if (!cookie) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  const payload = await decrypt(cookie);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.auth.admin.getUserById(payload.userId);
  if (error || !data) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({ user: data }, { status: 200 });
}
