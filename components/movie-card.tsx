"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Movie } from "@/types/database";
import { getMovieImageUrl } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface MovieCardProps {
  movie: Movie;
  isWatched?: boolean;
  userRating?: number;
  onWatchedChange?: () => void;
}

export function MovieCard({
  movie,
  isWatched = false,
  userRating,
  onWatchedChange,
}: MovieCardProps) {
  const [loading, setLoading] = useState(false);

  const toggleWatched = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (isWatched) {
        await supabase
          .from("watched_movies")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie.id);
      } else {
        await supabase.from("watched_movies").insert({
          user_id: user.id,
          movie_id: movie.id,
          movie_title: movie.title,
          movie_year: movie.year,
          movie_poster: getMovieImageUrl(movie.poster_path),
        });
      }

      onWatchedChange?.();
    } catch (error) {
      console.error("Error toggling watched status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/movie/${movie.id}`}>
            <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
              <Image
                src={getMovieImageUrl(movie.poster_path) || "/placeholder.svg"}
                alt={movie.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          </Link>

          <div className="absolute top-2 right-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant={isWatched ? "default" : "secondary"}
                  onClick={toggleWatched}
                  disabled={loading}
                  className={`h-8 px-2 ${
                    !isWatched ? "opacity-0 group-hover:opacity-100" : ""
                  } transition-opacity duration-200`}>
                  {isWatched ? (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="ml-1 text-xs">Watched</span>
                    </>
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isWatched ? "Remove from watched" : "Add to watch list"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {isWatched && userRating && (
            <div className="absolute top-2 left-2 group-hover:opacity-100 opacity-0 transition-opacity duration-200">
              <Badge
                variant="secondary"
                className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{userRating}</span>
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <Link href={`/movie/${movie.id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 hover:text-purple-600 transition-colors">
              {movie.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">{movie.year}</p>
        </div>
      </CardContent>
    </Card>
  );
}
