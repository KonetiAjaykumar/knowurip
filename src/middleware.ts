import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("knowurip_session_token")?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/profile", "/settings"];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Redirect to login if trying to access protected paths without active cookie
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    // Remember redirect source URL
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ["/login", "/signup", "/verify-email", "/create-password", "/forgot-password", "/reset-password"];
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
    "/verify-email",
    "/create-password",
    "/forgot-password",
    "/reset-password",
  ],
};
