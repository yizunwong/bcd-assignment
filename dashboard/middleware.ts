import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  app_metadata?: {
    role?: string;
  };
  [key: string]: any;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;

  const protectedPaths = ["/policyholder", "/admin", "/system-admin"];

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const role = decoded?.app_metadata?.role;

      const roleToPath = {
        system_admin: "/system-admin",
        admin: "/admin",
        policyholder: "/policyholder",
      } as const;

      const userPath = roleToPath[role as keyof typeof roleToPath];

      // ✅ If role exists, but is accessing a path not for their role, redirect them to their correct dashboard
      if (userPath && !pathname.startsWith(userPath)) {
        return NextResponse.redirect(new URL(userPath, request.url));
      }
    } catch (err) {
      console.error("JWT decoding error:", err);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/policyholder/:path*", "/admin/:path*", "/system-admin/:path*"],
};
