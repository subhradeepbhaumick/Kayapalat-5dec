// File: middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Block the /simple page for everyone
    if (req.nextUrl.pathname.startsWith("/simple")) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url)); // Or redirect to home
    }

    // Check for admin role on admin routes
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
      return NextResponse.rewrite(new URL("/unauthorized", req.url)); // Or redirect to home
    }
  },
  {
    callbacks: {
      // This ensures the middleware only runs if the user is logged in
      authorized: ({ token }) => !!token,
    },
  }
);

// This config applies the middleware to the specified routes
export const config = { 
   matcher: ["/profile", "/simple" , "/dashboard/:path*"] 
};