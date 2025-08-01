import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const posterImageUrl = "https://image.tmdb.org/t/p/w500/";
const providerLogoUrl = "https://image.tmdb.org/t/p/w500/";
const backdropImageUrl = "https://image.tmdb.org/t/p/original/";

export function getMovieImageUrl(path: string, poster = true): string {
  return path
    ? `${poster ? posterImageUrl : backdropImageUrl}${path}`
    : "/placeholder.svg";
}

export function getProviderLogo(path: string): string {
  return path ? `${providerLogoUrl}${path}` : "/placeholder.svg";
}

export function getSessionFromBrowser(): string | null {
  
  console.log(document.cookie);

  const cookies = document.cookie.split("; ");
  const sessionCookie = cookies.find((cookie) => cookie.startsWith("session"));
  console.log("Session cookie found:", sessionCookie);
  console.log(cookies);

  if (!sessionCookie) {
    console.warn("Session cookie not found");
    return null;
  }

  return sessionCookie.split("=")[1];
}
