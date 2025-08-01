import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = [
  // "/movies",
  // "/movies/[id]",
  // "/reviews",
  // "/user/watched-movies",
];
const publicRoutes = ["/login", "/"];

export default async function middleware(req: NextRequest) {
  console.log("Middleware triggered for:", req.nextUrl.pathname);
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not loginenticated
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is loginenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/movies")
  ) {
    return NextResponse.redirect(new URL("/movies", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
