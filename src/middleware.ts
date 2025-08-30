// File: middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

function decodeJwtPayload(token: string | undefined) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // atob is available in Edge runtime
    const jsonPayload = decodeURIComponent(
      Array.prototype.map.call(atob(base64), (c: string) =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // read token from next-auth (if present) or from our login cookie
    const nextAuthToken = (req as any).nextauth?.token;
    const cookieToken = req.cookies.get('token')?.value;
    const payload = nextAuthToken ?? decodeJwtPayload(cookieToken);

    // /simple: block all access
    if (pathname.startsWith("/simple")) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    // /admin: only allow users with role === "admin"
    if (pathname.startsWith("/admin")) {
      const role = payload?.role;
      if (!payload || role !== "admin") {
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
      return;
    }

    // protect other routes (profile, dashboard, etc.) — require login
    const protectedPrefixes = ["/profile", "/dashboard"];
    if (protectedPrefixes.some((p) => pathname.startsWith(p))) {
      if (!payload) {
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
    }
  },
  {
    callbacks: {
      // always run middleware so we can check tokens from cookie or next-auth
      authorized: () => true,
    },
  }
);

// This config applies the middleware to the specified routes
export const config = {
  matcher: ["/profile", "/simple", "/dashboard/:path*", "/admin/:path*"],
};