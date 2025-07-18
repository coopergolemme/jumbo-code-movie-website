import { Suspense, use } from "react";
import Image from "next/image";
import {
  DetailedMovie,
  getDetailedMovie,
  getMovieReviews,
  getSimilarMovies,
  getWatchProviders,
  Provider,
  Review,
} from "@/lib/movie-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar } from "lucide-react";
import type { Movie } from "@/types/database";
import { getMovieImageUrl, getProviderLogo } from "@/lib/utils";
import { MovieCard } from "@/components/movie-card";
import ClientInteractiveSection from "@/components/client-interactive-section";
import { getCurrentUserId, getUserMovieReview } from "@/lib/user-api";

interface MovieDetailPageProps {
  params: {
    id: string;
  };
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const resolvedParams = await params;
  const movieId = Number.parseInt(resolvedParams.id);

  // Fetch all data in parallel
  const [movie, movieReviews, similarMovies, providers] = await Promise.all([
    getDetailedMovie(movieId),
    getMovieReviews(movieId),
    getSimilarMovies(movieId),
    getWatchProviders(movieId),
  ]);

  if (!movie) {
    throw new Error("Movie not found");
  }

  return (
    <>
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        <Image
          src={
            getMovieImageUrl(movie.backdrop_path ?? "", false) ||
            "/placeholder.svg"
          }
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 320px"
        />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">
                {movie.title}
              </h1>
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.release_date?.split("-")[0]}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold text-white">
                    {movie.vote_average?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-sm text-gray-400">/ 10</span>
                </div>
                {movie.genres && movie.genres.length > 0 && (
                  <span className="text-sm text-gray-400">
                    {movie.genres.map((genre) => genre.name).join(", ")}
                  </span>
                )}
                <Suspense fallback={<div>Loading interactive features...</div>}>
                  <ClientInteractiveSection movie={movie} />
                </Suspense>
              </div>

              <div className="mt-4">
                {providers && providers.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-300">
                      Watch on:
                    </span>
                    <div className="flex flex-wrap gap-4">
                      {providers.map((provider: Provider) => (
                        <div
                          key={provider.provider_id}
                          className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-700"
                        >
                          <Image
                            src={getProviderLogo(provider.logo_path)}
                            alt={provider.provider_name}
                            width={30}
                            height={30}
                            className="h-8 w-8 rounded"
                          />
                          <span className="text-sm font-medium text-white">
                            {provider.provider_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {movie.overview && (
              <div>
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Overview
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            {movieReviews.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Community Reviews
                </h2>
                <div className="max-h-96 overflow-y-auto space-y-4 border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <ul className="space-y-4">
                    {movieReviews.map((review) => (
                      <li key={review.author} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">
                            {review.author}
                          </span>
                          {review.rating && (
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-500"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-300">{review.content}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          People Also Watched
        </h2>
        <div className="relative">
          <div className="flex overflow-x-scroll space-x-4 scrollbar-hide">
            {similarMovies.map((similarMovie) => (
              <div key={similarMovie.id} className="flex-shrink-0 w-48">
                <MovieCard movie={similarMovie} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
