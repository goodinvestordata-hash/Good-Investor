"use client";
import { motion } from "framer-motion";
import StaggeredText from "./StaggeredText";

export default function TextPara() {
  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-6">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="mb-6 text-sm font-medium uppercase tracking-wide text-sky-800 sm:text-base"
        >
          Our Approach
        </motion.h3>

        <StaggeredText
          text="Eeda Damodara Rao  leverages advanced AI and machine learning to simplify complex market data into actionable insights. With nine years of financial expertise, he develops research-driven models that help traders and investors make smarter, faster, and more confident decisions in dynamic markets."
          className="mx-auto max-w-4xl text-2xl leading-relaxed sm:text-3xl md:text-4xl"
        />
      </div>
    </section>
  );
}
