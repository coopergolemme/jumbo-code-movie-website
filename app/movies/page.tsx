"use client";

import { useState, useEffect } from "react";
import { getMovieList } from "@/lib/movie-api";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie, WatchedMovie } from "@/types/database";
import { getUserWatchedMovies } from "@/lib/user-api";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [movieType, setMovieType] = useState<
    "new" | "popular" | "highly-rated"
  >("new");

  useEffect(() => {
    loadMovies();
  }, [currentPage, movieType]);

  useEffect(() => {
    loadWatchedMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const movieData = await getMovieList(currentPage, movieType);
      setMovies(movieData);
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWatchedMovies = async () => {
    try {
      const data = await getUserWatchedMovies();
      setWatchedMovies(data || []);
    } catch (error) {}
  };

  const isMovieWatched = (movieId: number) => {
    return watchedMovies.some((wm) => wm.movie_id === movieId);
  };

  const getMovieRating = (movieId: number) => {
    const watchedMovie = watchedMovies.find((wm) => wm.movie_id === movieId);
    return watchedMovie?.rating;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Browse Movies</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={movieType === "new" ? "default" : "outline"}
            onClick={() => {
              setCurrentPage(1);
              setMovieType("new");
            }}>
            New Movies
          </Button>
          <Button
            variant={movieType === "popular" ? "default" : "outline"}
            onClick={() => {
              setCurrentPage(1);
              setMovieType("popular");
            }}>
            Popular
          </Button>
          <Button
            variant={movieType === "highly-rated" ? "default" : "outline"}
            onClick={() => {
              setCurrentPage(1);
              setMovieType("highly-rated");
            }}>
            Highly Rated
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of 10
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
            disabled={currentPage === 10}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isWatched={isMovieWatched(movie.id)}
            userRating={getMovieRating(movie.id)}
            onWatchedChange={loadWatchedMovies}
          />
        ))}
      </div>
    </div>
  );
}
