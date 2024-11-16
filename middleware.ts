import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Example of middleware logic
  console.log("Middleware is running...");

  const { pathname } = req.nextUrl;

  // Your middleware logic (e.g., authentication check or other checks)
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Redirect to login if there's no token
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // Continue if token exists
}

export const config = {
  matcher: ["/add", "/edit", "/"], // Apply middleware only to these routes
};
