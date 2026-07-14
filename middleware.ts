import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserRole } from "@/types/auth";

// ─── Route maps ────────────────────────────────────────────────────────────

/**
 * Paths (exact or prefix) that are always reachable without a session.
 * Keep this list narrow — only truly public pages.
 */
const PUBLIC_ROUTES = new Set(["/", "/login", "/signup"]);
const PUBLIC_PREFIXES = ["/responder-activate"];

/** Pages an already-authenticated user should never land on again. */
const AUTH_ONLY_PAGES = new Set(["/login", "/signup"]);

/**
 * Each role owns a set of path prefixes.
 * A request to /admin/users fails if the user's role is not "admin", etc.
 */
const ROLE_PREFIXES: Record<UserRole, string[]> = {
  admin: ["/admin"],
  user: ["/dashboard", "/responders", "/settings"],
  responder: ["/responder"],
};

/** Where to land after login or after an unauthorised access attempt. */
const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin",
  user: "/dashboard",
  responder: "/responder/dashboard",
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_ROUTES.has(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

function requiredRoleFor(pathname: string): UserRole | null {
  for (const [role, prefixes] of Object.entries(ROLE_PREFIXES) as [
    UserRole,
    string[],
  ][]) {
    if (prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      return role;
    }
  }
  return null;
}

function homeFor(role: UserRole | undefined): string {
  return role ? (ROLE_HOME[role] ?? "/dashboard") : "/dashboard";
}

// ─── Middleware ────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("session_token")?.value;
  const role = request.cookies.get("user_role")?.value as UserRole | undefined;
  const authenticated = Boolean(token);

  // 1 ─ Unauthenticated: allow public routes, redirect everything else to /login
  if (!authenticated) {
    if (isPublicPath(pathname)) return NextResponse.next();

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname); // carry intended destination
    return NextResponse.redirect(loginUrl);
  }

  // 2 ─ Authenticated on an auth-only page (login / signup): bounce to dashboard
  if (AUTH_ONLY_PAGES.has(pathname)) {
    return NextResponse.redirect(new URL(homeFor(role), request.url));
  }

  // 3 ─ Authenticated on a role-gated route they don't own: bounce to their home
  const required = requiredRoleFor(pathname);
  if (required !== null && role !== required) {
    return NextResponse.redirect(new URL(homeFor(role), request.url));
  }

  // 4 ─ All checks passed
  return NextResponse.next();
}

// ─── Matcher ───────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Run on every request path EXCEPT:
     *   _next/static   – compiled JS/CSS bundles
     *   _next/image    – image optimisation endpoint
     *   _next/webpack-hmr – hot-reload websocket
     *   sw.js / workbox-* / serwist-* – PWA service-worker artefacts
     *   Static asset extensions – images, fonts, icons
     */
    "/((?!_next/static|_next/image|_next/webpack-hmr|sw\\.js|workbox-.*|serwist.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
