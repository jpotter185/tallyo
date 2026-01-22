// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Check if maintenance mode is enabled
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
    // Allow access to the maintenance page itself
    if (request.nextUrl.pathname === "/maintenance") {
      return NextResponse.next();
    }

    // Redirect all other requests to maintenance page
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

// Optionally specify which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
