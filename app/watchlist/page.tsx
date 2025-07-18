"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MovieCard } from "@/components/movie-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, Calendar, Eye } from "lucide-react";
import type { WatchedMovie } from "@/types/database";
import { getUserWatchedMovies } from "@/lib/user-api";

export default function WatchlistPage() {
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadWatchedMovies();
    }
  }, [user]);

  const loadWatchedMovies = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getUserWatchedMovies(user.id);

      setWatchedMovies(data || []);
    } catch (error) {
      console.error("Error loading watched movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const ratedMovies = watchedMovies.filter((movie) => movie.rating);
  const unratedMovies = watchedMovies.filter((movie) => !movie.rating);

  const averageRating =
    ratedMovies.length > 0
      ? ratedMovies.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
        ratedMovies.length
      : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">My Movies</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Watched
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchedMovies.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Year</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  watchedMovies.filter(
                    (movie) =>
                      new Date(movie.watched_at).getFullYear() ===
                      new Date().getFullYear()
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All Movies ({watchedMovies.length})
          </TabsTrigger>
          <TabsTrigger value="rated">Rated ({ratedMovies.length})</TabsTrigger>
          <TabsTrigger value="unrated">
            Unrated ({unratedMovies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="all"
          className="mt-6">
          {watchedMovies.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No movies watched yet</CardTitle>
                <CardDescription>
                  Start browsing movies and mark them as watched to build your
                  collection!
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {watchedMovies.map((watchedMovie) => (
                <MovieCard
                  key={watchedMovie.id}
                  movie={{
                    id: watchedMovie.movie_id,
                    title: watchedMovie.movie_title,
                    year: watchedMovie.movie_year,
                    poster_path: watchedMovie.movie_poster,
                  }}
                  isWatched={true}
                  userRating={watchedMovie.rating}
                  onWatchedChange={loadWatchedMovies}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="rated"
          className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {ratedMovies.map((watchedMovie) => (
              <MovieCard
                key={watchedMovie.id}
                movie={{
                  id: watchedMovie.movie_id,
                  title: watchedMovie.movie_title,
                  year: watchedMovie.movie_year,
                  poster_path: watchedMovie.movie_poster,
                }}
                isWatched={true}
                userRating={watchedMovie.rating}
                onWatchedChange={loadWatchedMovies}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="unrated"
          className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {unratedMovies.map((watchedMovie) => (
              <MovieCard
                key={watchedMovie.id}
                movie={{
                  id: watchedMovie.movie_id,
                  title: watchedMovie.movie_title,
                  year: watchedMovie.movie_year,
                  poster_path: watchedMovie.movie_poster,
                }}
                isWatched={true}
                userRating={watchedMovie.rating}
                onWatchedChange={loadWatchedMovies}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
