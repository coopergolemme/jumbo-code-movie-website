export interface Movie {
  id: number;
  title: string;
  overview?: string;
  year: string;
  poster_path: string;
  backdrop_path?: string;
  genres?: number[];
}

export interface WatchedMovie {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  movie_year: number;
  movie_poster: string;
  watched_at: string;
  rating?: number;
  review?: string;
}

export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  streaming_providers?: string[];
}

export interface MovieList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserMovieReview {
  rating?: number;
  review?: string;
  isWatched: boolean;
  watchedAt?: string;
}
