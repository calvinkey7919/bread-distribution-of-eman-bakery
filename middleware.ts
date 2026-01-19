import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session and not on auth pages, redirect to login
  if (
    !session &&
    !req.nextUrl.pathname.startsWith("/auth") &&
    req.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If session exists and on auth pages, redirect to dashboard
  if (session && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)",
  ],
};
