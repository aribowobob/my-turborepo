import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Paths that are always accessible
  const publicPaths = ["/login", "/register"];
  const path = request.nextUrl.pathname;

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath + "/")
  );

  // Get the token from cookies
  const token = request.cookies.get("auth-token")?.value;

  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // If the path is login/register and there's a token, redirect to home
  if (isPublicPath && token) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  // Otherwise, continue
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
