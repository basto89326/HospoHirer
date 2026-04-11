import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session - do NOT remove this
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  const isProtected =
    pathname.startsWith("/employer") || pathname.startsWith("/worker");

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect authenticated users away from auth pages
  // but NOT the callback (code exchange must run) or verify (post-signup landing)
  if (
    user &&
    pathname.startsWith("/auth") &&
    !pathname.startsWith("/auth/callback") &&
    !pathname.startsWith("/auth/verify")
  ) {
    const role = user.user_metadata?.role as string | undefined;
    return NextResponse.redirect(
      new URL(role === "employer" ? "/employer" : "/worker", request.url)
    );
  }

  // Block workers from employer routes and vice versa
  if (user) {
    const role = user.user_metadata?.role as string | undefined;
    if (pathname.startsWith("/employer") && role !== "employer") {
      return NextResponse.redirect(new URL("/worker", request.url));
    }
    if (pathname.startsWith("/worker") && role !== "worker") {
      return NextResponse.redirect(new URL("/employer", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
