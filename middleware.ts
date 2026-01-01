import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/ai-chat(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is signed in and tries to access auth pages, redirect to dashboard
  if (userId && isAuthRoute(req)) {
    return Response.redirect(new URL("/ai-chat", req.url));
  }

  // Protect dashboard routes
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
