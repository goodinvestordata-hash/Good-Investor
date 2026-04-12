/**
 * CLEAN PRODUCTION PROXY (Next.js 16)
 * Location: src/proxy.js
 *
 * Features:
 * - Security headers
 * - HTTPS enforcement (optional)
 * - Basic route protection (auth)
 * - No CSRF (safe for now, no build/runtime errors)
 */

import { NextResponse } from "next/server";

// ✅ Security Headers
function setSecurityHeaders(response) {
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.cloudinary.com *.razorpay.com checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "img-src 'self' data: https: *.cloudinary.com",
      "font-src 'self' data: fonts.gstatic.com",
      "connect-src 'self' https: wss: *.razorpay.com *.cloudinary.com maps.googleapis.com maps.google.com www.google.com",
      "frame-src 'self' *.razorpay.com checkout.razorpay.com maps.google.com www.google.com https://www.google.com https://maps.google.com",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  );

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  response.headers.set(
    "Permissions-Policy",
    ["geolocation=()", "microphone=()", "camera=()", "payment=(self)"].join(
      ",",
    ),
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return response;
}

// ✅ Main Proxy Function
export async function proxy(request) {
  const { pathname, searchParams } = request.nextUrl;

  let response = NextResponse.next();

  // Apply security headers
  response = setSecurityHeaders(response);

  // ✅ Force HTTPS (optional)
  if (
    process.env.NODE_ENV === "production" &&
    process.env.FORCE_HTTPS === "true"
  ) {
    if (request.headers.get("x-forwarded-proto") !== "https") {
      return NextResponse.redirect(
        `https://${request.headers.get("host")}${pathname}${
          searchParams.toString() ? "?" + searchParams.toString() : ""
        }`,
        { status: 308 },
      );
    }
  }

  // ✅ Protected Routes
  const protectedRoutes = ["/dashboard", "/admin"];
  const token = request.cookies.get("token")?.value;

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

// ✅ Matcher (exclude static files)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)",
  ],
};
