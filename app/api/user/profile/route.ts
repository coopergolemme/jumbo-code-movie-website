import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decrypt } from "@/app/lib/session";

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only
);

export async function GET(request: NextRequest) {
  try {
    // extract token from cookies
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    const payload = await decrypt(sessionToken);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Invalid session token" },
        { status: 401 }
      );
    }

    const { data: watchedMovies, error } = await supabase
      .from("watched_movies")
      .select("*")
      .eq("user_id", payload.userId)
      .order("watched_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch watched movies" },
        { status: 500 }
      );
    }

    return NextResponse.json({ watchedMovies });
  } catch (error) {
    console.error("Error fetching watched movies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
