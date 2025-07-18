import { UserMovieReview } from "@/types/database";

export interface User {
  id: string;
  email?: string;
  streaming_providers?: string[];
}

// Get user's streaming providers
export async function getUserStreamingProviders(
  userId: string,
): Promise<string[]> {
  try {
    const response = await fetch(
      `/api/user/streaming-providers?userId=${userId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch streaming providers");
    }

    const data = await response.json();
    return data.streaming_providers || [];
  } catch (error) {
    console.error("Error fetching user providers:", error);
    return [];
  }
}

// Update user's streaming providers
export async function updateUserStreamingProviders(
  userId: string,
  providers: string[],
): Promise<boolean> {
  try {
    const response = await fetch("/api/user/streaming-providers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        streaming_providers: providers,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error updating user providers:", error);
    return false;
  }
}

// Get complete user profile
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/user/profile?userId=${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// Create or update user profile
export async function upsertUserProfile(user: Partial<User>): Promise<boolean> {
  try {
    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return response.ok;
  } catch (error) {
    console.error("Error upserting user profile:", error);
    return false;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      console.warn("getCurrentUserId called on server side");
      return null;
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    console.log("Current user data:", user, error);
    if (error || !user) {
      return null;
    }
    return user.id;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}

// Get current authenticated user (still client-side for auth state)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getUserWatchedMovies(userId: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/user/watched-movies?userId=${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch watched movies");
    }

    const data = await response.json();
    return data.watchedMovies || [];
  } catch (error) {
    console.error("Error fetching watched movies:", error);
    return [];
  }
}

export async function getUserMovieReview(
  userId: string,
  movieId: number,
): Promise<UserMovieReview | null> {
  try {
    const response = await fetch(
      `/api/user/movie-review?userId=${userId}&movieId=${movieId}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { isWatched: false };
      }
      throw new Error("Failed to fetch user movie review");
    }

    const data = await response.json();
    return {
      rating: data.rating,
      review: data.review,
      isWatched: true,
    };
  } catch (error) {
    console.error("Error fetching user movie review:", error);
    return null;
  }
}

export async function addWatchedMovie(
  userId: string,
  movieId: number,
  title?: string,
  posterPath?: string,
  rating?: number,
  review?: string,
): Promise<boolean> {
  try {
    const response = await fetch("/api/user/watched-movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        movieId,
        title,
        posterPath,
        rating,
        review,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error adding watched movie:", error);
    return false;
  }
}

export async function updateWatchedMovie(
  userId: string,
  movieId: number,
  title?: string,
  posterPath?: string,
  rating?: number,
  review?: string,
): Promise<boolean> {
  try {
    const response = await fetch("/api/user/watched-movies", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        movieId,
        title,
        posterPath,
        rating,
        review,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error updating watched movie:", error);
    return false;
  }
}
