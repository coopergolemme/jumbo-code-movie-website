import { UserMovieReview } from "@/types/database";

export interface User {
  id: string;
  email?: string;
  streaming_providers?: string[];
}

// Get user's streaming providers
export async function getUserStreamingProviders(): Promise<string[]> {
  try {
    const response = await fetch("/api/user/streaming-providers");

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
  providers: string[]
): Promise<boolean> {
  try {
    const response = await fetch("/api/user/streaming-providers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
export async function getUserProfile(
  sessionToken: string
): Promise<User | null> {
  try {
    const response = await fetch("/api/user/profile", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

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

export async function getUserWatchedMovies(): Promise<any[]> {
  try {
    const response = await fetch("/api/user/watched-movies");

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
  movieId: number
): Promise<UserMovieReview | null> {
  try {
    const response = await fetch(`/api/user/movie-review?movieId=${movieId}`);

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
  movieId: number,
  title?: string,
  posterPath?: string,
  rating?: number,
  review?: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/user/watched-movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
  movieId: number,
  title?: string,
  posterPath?: string,
  rating?: number,
  review?: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/user/watched-movies", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
