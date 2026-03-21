/**
 * middleware.ts — Next.js Edge Middleware
 *
 * Strategy: Any request to /admin/* that is NOT authenticated
 * returns a 404 response. This obfuscates the admin route's existence.
 *
 * Authenticated users pass through normally.
 * /login is excluded so the hidden login page remains reachable.
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect /admin/* routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      // Return a real 404 — not a redirect — to hide admin existence
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on admin routes only (skip static files, api/auth)
  matcher: ["/admin/:path*"],
};
