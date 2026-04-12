"use client";
import { useMemo } from "react";
import { cn } from "@/app/lib/utils";

export const BackgroundRippleEffect = ({
  className,
  /** Full-viewport layer behind content (recommended on the home page). */
  fixed = true,
}) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        size: 3 + (i % 4) * 2,
        left: `${5 + ((i * 11) % 90)}%`,
        top: `${8 + ((i * 17) % 80)}%`,
        duration: 14 + (i % 4) * 3,
        delay: (i % 6) * 1.2,
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none inset-0 h-full w-full overflow-hidden",
        fixed ? "fixed z-[1] min-h-screen" : "absolute z-0 min-h-full",
        className,
      )}
    >
      {/* Core smooth gradient wash (slightly stronger so it reads on white) */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_8%,rgba(15,118,110,0.18),rgba(255,255,255,0.0)_58%),radial-gradient(80%_55%_at_12%_18%,rgba(14,116,144,0.14),rgba(255,255,255,0)_62%),radial-gradient(80%_55%_at_88%_22%,rgba(71,85,105,0.14),rgba(255,255,255,0)_64%)]" />

      {/* Slow moving glow orbs */}
      <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-teal-400/28 blur-3xl animate-gi-float-one" />
      <div className="absolute top-16 right-10 h-80 w-80 rounded-full bg-sky-500/22 blur-3xl animate-gi-float-two" />
      <div className="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-500/20 blur-3xl animate-gi-float-three" />

      {/* Subtle premium vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_100%,rgba(255,255,255,0.0),rgba(15,23,42,0.12))]" />

      {/* Tiny floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-slate-500/15 animate-gi-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.top,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundRippleEffect;
/* Animation keyframes live in globals.css (gi-*) */
