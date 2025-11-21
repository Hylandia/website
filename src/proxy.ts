import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const protectedRoutes = createRouteMatcher(["/future-protected-routes/:path*"]);
const redirectIfAuthed = createRouteMatcher(["/auth/:path*"]);

export default clerkMiddleware(async (Auth, request) => {
  const auth = await Auth();
  const url = new URL(request.url);

  if (redirectIfAuthed(request) && !!auth.userId) {
    return NextResponse.redirect(new URL("/", url));
  }
  if (protectedRoutes(request) && !auth.userId) {
    return NextResponse.redirect(new URL("/auth", url));
  }
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
