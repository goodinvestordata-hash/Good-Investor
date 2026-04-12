"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import GoogleLoginBtn from "./GoogleLoginBtn";

export default function AuthForm({ type }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, fetchMe } = useAuth();

  // If already logged in, redirect away
  useEffect(() => {
    if (user && type === "login") router.push("/");
  }, [user, type, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload =
      type === "register" ? { email, password, username } : { email, password };

    const res = await fetch(`/api/auth/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Authentication failed");
      return;
    }

    const shouldShowDisclaimer = !data?.user?.disclaimerAccepted;
    await fetchMe();
    router.push(shouldShowDisclaimer ? "/disclaimer" : "/");
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-neutral-50 via-white to-sky-50/60">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,116,144,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(20,184,166,0.14),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 pb-16 pt-28 md:px-8">
        <div className="grid items-center gap-8 rounded-3xl border border-neutral-200/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur lg:grid-cols-2 lg:p-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
                  {type === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="text-sm text-neutral-600 md:text-base">
                  Access AI-powered market insights and personalized strategies.
                  Sign in securely to continue to your dashboard.
                </p>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {type === "register" && (
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-neutral-800">
                    Name
                  </span>
                  <input
                    type="text"
                    placeholder="Your full name"
                    required
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-inner shadow-neutral-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-neutral-800">
                  Email
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-inner shadow-neutral-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-neutral-800">
                  Password
                </span>
                <input
                  type="password"
                  placeholder="Enter a strong password"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-inner shadow-neutral-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <button className="w-full rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/10 transition hover:-translate-y-px hover:bg-sky-500 hover:shadow-[0_14px_36px_rgba(0,0,0,0.18)] hover:ring-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/70 cursor-pointer">
                {type === "login" ? "Login securely" : "Create account"}
              </button>
            </form>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span className="h-px flex-1 bg-neutral-200" />
                <span>or continue with</span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>
              <GoogleLoginBtn />
            </div>

            <div className="text-sm text-neutral-700">
              {type === "login" ? (
                <p>
                  Don’t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-sky-700 underline cursor-pointer decoration-2 underline-offset-4"
                  >
                    Register here
                  </Link>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-neutral-900 underline decoration-sky-500 decoration-2 underline-offset-4"
                  >
                    Login here
                  </Link>
                </p>
              )}
            </div>
          </div>

          <div className="relative hidden h-full min-h-80 overflow-hidden rounded-2xl border border-neutral-200/70 bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 shadow-[0_30px_80px_rgba(0,0,0,0.22)] lg:block">
            <div className="absolute inset-0 bg-linear-to-tr from-sky-500/35 via-teal-300/10 to-transparent" />
            <Image
              src="/Good Investor.png"
              alt="Trading analytics dashboard"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute left-6 bottom-6 flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg shadow-sky-200/60 backdrop-blur">
              <span className="inline-flex h-2 w-2 rounded-full bg-sky-500" />
              Secure, SEBI-compliant access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
