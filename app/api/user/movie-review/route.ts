import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decrypt } from "@/app/lib/session";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  // console.log("GET /api/user/watched-movies called");
  const sessionToken = request.cookies.get("session")?.value;
  // console.log("Session token:", sessionToken);
  if (!sessionToken) {
    return NextResponse.json(
      { error: "Session token is required" },
      { status: 400 }
    );
  }
  const payload = await decrypt(sessionToken);
  // console.log("Decrypted payload:", payload);
  if (!payload || !payload.userId) {
    return NextResponse.json(
      { error: "Invalid session token" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return NextResponse.json(
      { error: "Movie ID are required" },
      { status: 400 }
    );
  }

  const { data: watchedMovie, error } = await supabase
    .from("watched_movies")
    .select("rating, review, watched_at")
    .eq("user_id", payload.userId)
    .eq("movie_id", parseInt(movieId))
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned - user hasn't watched this movie
      return NextResponse.json(
        { error: "Movie not found in user's watched list" },
        { status: 404 }
      );
    }
    // console.error("Supabase error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user movie review" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    rating: watchedMovie.rating,
    review: watchedMovie.review,
    watchedAt: watchedMovie.watched_at,
  });
}
