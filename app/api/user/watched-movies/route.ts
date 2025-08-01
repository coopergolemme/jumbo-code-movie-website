import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decrypt } from "@/app/lib/session";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  // console.log("GET /api/user/watched-movies called");
  // extract token from
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

  const { data: watchedMovies, error } = await supabase
    .from("watched_movies")
    .select("*")
    .eq("user_id", payload.userId)
    .order("watched_at", { ascending: false });

  if (error) {
    // console.error("Supabase error:", error);
    return NextResponse.json(
      { error: "Failed to fetch watched movies" },
      { status: 500 }
    );
  }

  return NextResponse.json({ watchedMovies });
}
export async function POST(request: NextRequest) {
  try {
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

    const { movieId, title, posterPath, rating, review } = await request.json();

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("watched_movies")
      .upsert(
        {
          user_id: payload.userId,
          movie_id: movieId,
          movie_title: title,
          movie_poster: posterPath,
          rating: rating,
          review: review,
          watched_at: new Date().toISOString(),
        },
        { onConflict: "user_id,movie_id" }
      )
      .select()
      .single();

    if (error) {
      // console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to add watched movie" },
        { status: 500 }
      );
    }

    return NextResponse.json({ watchedMovie: data }, { status: 201 });
  } catch (error) {
    // console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
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

    const { movieId, title, posterPath, rating, review } = await request.json();

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
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
      .eq("user_id", payload.userId)
      .eq("movie_id", movieId)
      .select()
      .single();

    if (error) {
      // console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to update watched movie" },
        { status: 500 }
      );
    }

    return NextResponse.json({ watchedMovie: data });
  } catch (error) {
    // console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
