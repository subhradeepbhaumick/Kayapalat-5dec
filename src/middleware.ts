import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // List of paths that don't require authentication
  const publicPaths = [
    "/api/auth/login",
    "/api/users/login",
    "/api/users/signup",
    "/api/users/logout",
    "/",
    "/client_login",
    "/referuser/login",
    "/signup",
    "/favicon.ico",
    "/_next", // Next.js internals
    "/public",
  ];

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Redirect to login page
    return NextResponse.redirect(new URL("/referuser/login", req.url));
  }

  // Verify JWT token
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/referuser/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Apply middleware to all API routes and protected pages except public paths
    */
    "/api/:path*",
    "/referuser/:path*",
    // add more protected routes as needed
  ],
};
