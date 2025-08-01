const topRatedUrl =
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US";
const discoverUrl =
  "https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false";
const popularUrl = "https://api.themoviedb.org/3/movie/popular?language=en-US";

const nowPlayingUrl =
  "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";

const movieUrl = "https://api.themoviedb.org/3/movie/movie_id?language=en-US";
const reviewUrl = "https://api.themoviedb.org/3/movie/movie_id/reviews";
const similarUrl =
  "https://api.themoviedb.org/3/movie/{movie_id}/recommendations";

const providersUrl =
  "https://api.themoviedb.org/3/movie/{movie_id}/watch/providers";

const allProvidersUrl =
  "https://api.themoviedb.org/3/watch/providers/movie?watch_region=US";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      `Bearer ${process.env.TMDB_API}`,
  },
};

export async function getMovie(id: number): Promise<Movie | null> {
  try {
    const response = await fetch(
      movieUrl.replace("movie_id", id.toString()),
      options
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}

export async function getDetailedMovie(
  id: number
): Promise<DetailedMovie | null> {
  try {
    const response = await fetch(
      movieUrl.replace("movie_id", id.toString()) +
        "?append_to_response=videos",
      options
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching detailed movie:", error);
    return null;
  }
}
export async function getMovieList(
  page = 1,
  movieType: "new" | "popular" | "highly-rated"
): Promise<Movie[]> {
  let url = "";
  switch (movieType) {
    case "new":
      url = nowPlayingUrl;
      break;
    case "popular":
      url = popularUrl;
      break;
    case "highly-rated":
      url = topRatedUrl;
      break;
    default:
      url = discoverUrl;
  }

  try {
    const response = await fetch(url + `&page=${page}`, options);

    if (!response.ok) return [];

    return response.json().then((data) => data.results || []);
  } catch (error) {
    console.error("Error fetching movie list:", error);
    return [];
  }
}

export async function getMovieReviews(
  id: number
): Promise<{ author: string; content: string }[]> {
  try {
    const response = await fetch(
      reviewUrl.replace("movie_id", id.toString()),
      options
    );

    if (!response.ok) return [];
    const data = await response.json();
    return data.results.map((review: any) => ({
      author: review.author,
      content: review.content,
      rating: review.author_details?.rating, // Optional rating field
    }));
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    return [];
  }
}

export async function getSimilarMovies(id: number): Promise<Movie[]> {
  try {
    const response = await fetch(
      similarUrl.replace("{movie_id}", id.toString()),
      options
    );

    if (!response.ok) return [];
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return [];
  }
}

export async function getWatchProviders(id: number): Promise<Provider[] | {}> {
  try {
    const response = await fetch(
      providersUrl.replace("{movie_id}", id.toString()),
      options
    );

    if (!response.ok) return {};
    const data = await response.json();
    console.log("Watch providers data:", data);
    const usProviders = data.results?.US || {};
    // If US providers are not available, return an empty object
    if (!usProviders) return {};
    // Return only the US providers

    return (
      usProviders.flatrate?.map((provider: any) => ({
        provider_id: provider.provider_id,
        provider_name: provider.provider_name,
        logo_path: provider.logo_path,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching watch providers:", error);
    return {};
  }
}

export async function getAllWatchProviders(): Promise<Provider[] | null> {
  try {
    const response = await fetch(allProvidersUrl, options);
    s
    if (!response.ok) return null;
    const data = await response.json();
    
    const sortedProviders = data.results.sort(
      (a: any, b: any) => a.display_priority - b.display_priority
    );
    return sortedProviders;
  } catch (error) {
    console.error("Error fetching all watch providers:", error);
    return null;
  }
}

export interface Provider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface Review {
  author: string;
  content: string;
  rating?: number;
}

interface Movie {
  id: number;
  title: string;
  overview?: string;
  year: string;
  poster_path: string;
}

export interface DetailedMovie extends Movie {
  backdrop_path?: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  release_date?: string;
  vote_average?: number;
}
