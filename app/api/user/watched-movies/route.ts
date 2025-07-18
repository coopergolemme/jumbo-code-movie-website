import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const { data: watchedMovies, error } = await supabase
      .from("watched_movies")
      .select("*")
      .eq("user_id", userId)
      .order("watched_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch watched movies" },
        { status: 500 },
      );
    }

    return NextResponse.json({ watchedMovies });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const { userId, movieId, title, posterPath, rating, review } =
      await request.json();

    if (!userId || !movieId) {
      return NextResponse.json(
        { error: "User ID and Movie ID are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("watched_movies")
      .upsert(
        {
          user_id: userId,
          movie_id: movieId,
          movie_title: title,
          movie_poster: posterPath,
          rating: rating,
          review: review,
          watched_at: new Date().toISOString(),
        },
        { onConflict: "user_id,movie_id" },
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to add watched movie" },
        { status: 500 },
      );
    }

    return NextResponse.json({ watchedMovie: data }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, movieId, title, posterPath, rating, review } =
      await request.json();

    if (!userId || !movieId) {
      return NextResponse.json(
        { error: "User ID and Movie ID are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("watched_movies")
      .update({
        movie_title: title,
        movie_poster: posterPath,
        rating: rating,
        review: review,
        watched_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("movie_id", movieId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to update watched movie" },
        { status: 500 },
      );
    }

    return NextResponse.json({ watchedMovie: data });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
