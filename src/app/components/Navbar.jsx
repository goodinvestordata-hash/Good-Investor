"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MenuItem } from "./ui/Navbar-menu";
import { cn } from "@/app/lib/utils";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/services", label: "Services" },
      { href: "/investor-charter", label: "Investor Charter" },
      { href: "/disclaimer-disclosure", label: "Disclaimer & Disclosure" },
      { href: "/mitc", label: "MITC" },
      { href: "/contact", label: "Contact Us" },
    ],
    [],
  );

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    closeMobile();
  }, [pathname]);

  const profileInitial = (user?.username || user?.email || "U")
    .slice(0, 1)
    .toUpperCase();

  const pillClass = cn(
    "flex items-center justify-between gap-2 sm:gap-3 md:gap-5 rounded-full border px-3 sm:px-4 md:px-5 py-2 w-full max-w-screen-xl",
    "border-white/[0.12] bg-[#0A192F]/72 text-[#E5E7EB] backdrop-blur-xl",
    "shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
  );

  const ctaClass =
    "hidden sm:inline-flex shrink-0 rounded-xl bg-[#2563EB] px-4 md:px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] hover:shadow-md";

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-4">
      <div className={pillClass}>
        <div className="shrink-0 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={closeMobile}
          >
            <p className="truncate text-sm font-semibold text-white sm:text-base md:text-lg">
              Good Investor
            </p>
          </Link>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <Menu tone="dark">
            {navLinks.map((link) => (
              <MenuItem key={link.href} href={link.href}>
                {link.label}
              </MenuItem>
            ))}
          </Menu>
        </div>

        <button
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-2.5 py-1.5 text-white/90 transition hover:border-white/35 hover:bg-white/[0.06] lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg
            className="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="hidden sm:inline text-sm font-medium">Menu</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white transition hover:bg-white/[0.14]"
                aria-label="Profile menu"
              >
                {profileInitial}
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute top-12 right-0 z-40 min-w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0f2942] shadow-xl">
                    <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
                      <p className="text-xs text-[#E5E7EB]/60">Logged in as</p>
                      <p className="truncate font-semibold text-white">
                        {user?.email || user?.username}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-[#E5E7EB] transition hover:bg-white/[0.06]"
                    >
                      Profile
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin-dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#E5E7EB] transition hover:bg-white/[0.06]"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/my-subscriptions"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-[#E5E7EB] transition hover:bg-white/[0.06]"
                    >
                      My Subscriptions
                    </Link>
                    <button
                      onClick={async () => {
                        setProfileOpen(false);
                        await fetch("/api/auth/logout", { method: "POST" });
                        window.location.href = "/login";
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {user ? (
            <Link href="/contact" className={ctaClass}>
              Enquire Now
            </Link>
          ) : (
            <Link href="/login" className={ctaClass}>
              Login
            </Link>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={closeMobile}
          />
          <div className="fixed top-[76px] sm:top-[86px] left-0 right-0 z-50 px-3 sm:px-4">
            <div
              className="mx-auto w-full max-w-screen-sm overflow-hidden rounded-2xl border border-white/10 shadow-xl"
              style={{ backgroundColor: "#0A192F" }}
            >
              <div className="flex flex-col gap-0.5 p-4">
                {user && (
                  <>
                    <Link
                      href="/profile"
                      onClick={closeMobile}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white"
                    >
                      <span>Profile</span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                        {profileInitial}
                      </span>
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin-dashboard"
                        onClick={closeMobile}
                        className="py-3 text-base font-medium text-[#E5E7EB] hover:text-white"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/my-subscriptions"
                      onClick={closeMobile}
                      className="py-3 text-base font-medium text-[#E5E7EB] hover:text-white"
                    >
                      My Subscriptions
                    </Link>
                  </>
                )}

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="py-3 text-base font-medium text-[#E5E7EB] transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <Link
                    href="/contact"
                    onClick={closeMobile}
                    className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                  >
                    Enquire Now
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
