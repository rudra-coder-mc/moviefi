import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const currentPath = req.nextUrl.pathname;

  const protectedRoutes = ["/add", "/edit/:id", "/"];
  const authRoutes = ["/login", "/signup"];

  // If authenticated and accessing auth routes, redirect to the home page
  if (token && authRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If unauthenticated and accessing protected routes, redirect to login
  if (!token && protectedRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/add", "/edit/:id", "/", "/login", "/signup"],
};
