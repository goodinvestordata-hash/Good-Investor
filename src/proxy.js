/**
 * ROOT PROXY for Next.js 16 (src/proxy.js)
 *
 * Renamed from middleware.js as per Next.js 16.1.1 requirements
 * Executes for ALL requests before they reach route handlers
 * Adds security headers, CSRF validation, authentication checks
 *
 * IMPORTANT: This file MUST be at src/proxy.js (root of src/)
 * NOT in src/lib/proxy.js
 */

import { NextResponse } from "next/server";
import {
  verifyCSRFToken,
  setCSRFCookie,
  getCSRFToken,
} from "./app/lib/csrfProtection";

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
    [
      "geolocation=()",
      "microphone=()",
      "camera=()",
      "payment=(self)",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
    ].join(","),
  );
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  return response;
}

export async function proxy(request) {
  const { pathname, searchParams } = request.nextUrl;
  const method = request.method.toUpperCase();
  let response = NextResponse.next();
  response = setSecurityHeaders(response);
  const csrfToken = getCSRFToken(request);
  if (!csrfToken) {
    setCSRFCookie(response);
  }
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  const isStateChangingRequest = !safeMethods.includes(method);
  const csrfExemptRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
    "/api/auth/google",
    "/api/contact",
    "/api/user/accept-disclaimer",
    "/api/payment/verify",
    "/api/buy/",
    "/api/agreement/",
    "/api/user/",
    "/api/signature/",
    "/api/risk-profile/",
    "/api/payment/order",
    "/api/admin/",
  ];
  const isExempt = csrfExemptRoutes.some((route) => pathname.startsWith(route));
  if (isStateChangingRequest && !isExempt) {
    const isValid = await verifyCSRFToken(request);
    if (!isValid) {
      console.warn(`CSRF validation failed: ${method} ${pathname}`);
      return NextResponse.json(
        { error: "CSRF token validation failed" },
        { status: 403 },
      );
    }
  }
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
  // Home ("/") must stay public; use ScrollAuthGate / per-route auth for UX.
  const protectedRoutes = ["/dashboard", "/admin"];
  const token = request.cookies.get("token")?.value;
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)",
  ],
};
