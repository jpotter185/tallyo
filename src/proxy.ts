import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
    if (request.nextUrl.pathname === "/maintenance") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
