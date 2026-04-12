"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SensexChartBackdrop from "./SensexChartBackdrop";

export default function HomeHero() {
  return (
    <section
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden text-[#E5E7EB]"
      style={{ backgroundColor: "#0A192F" }}
    >
      <SensexChartBackdrop />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(5.5rem,env(safe-area-inset-top))] sm:px-6 sm:pb-10 sm:pt-24 lg:px-8 lg:pb-14 lg:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#E5E7EB]/55 sm:mb-5 sm:text-sm"
        >
          Good Investor
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mx-auto max-w-4xl text-center text-balance text-3xl font-semibold leading-[1.2] tracking-tight text-white sm:text-4xl sm:leading-[1.18] md:text-5xl md:leading-[1.15] lg:max-w-5xl lg:text-[2.65rem] lg:leading-[1.12]"
        >
          Empowering Traders With AI Powered Market Insights
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mx-auto mt-10 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:mt-12 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
        >
          <Link
            href="/services"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] hover:shadow-md sm:w-auto sm:min-w-[11.5rem]"
          >
            Explore Now
          </Link>
          <Link
            href="/contact"
            prefetch
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/35 bg-transparent px-7 py-3.5 text-sm font-semibold text-[#E5E7EB] shadow-sm transition hover:border-white/55 hover:bg-white/[0.06] sm:w-auto sm:min-w-[11.5rem]"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
