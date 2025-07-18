import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const movieId = searchParams.get("movieId");

    if (!userId || !movieId) {
      return NextResponse.json(
        { error: "User ID and Movie ID are required" },
        { status: 400 }
      );
    }

    const { data: watchedMovie, error } = await supabase
      .from("watched_movies")
      .select("rating, review, watched_at")
      .eq("user_id", userId)
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
      console.error("Supabase error:", error);
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
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
