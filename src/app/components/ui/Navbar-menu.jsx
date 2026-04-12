"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";

/**
 * Desktop nav: hover indicator + active route.
 * @param {"light" | "dark"} tone — dark = fintech nav on navy
 */
export const Menu = ({ children, tone = "light" }) => {
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState(null);
  const pathname = usePathname();
  const isDark = tone === "dark";

  const moveIndicatorToEl = (el) => {
    if (!el || !navRef.current) return;

    const itemRect = el.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();

    setIndicator({
      width: itemRect.width,
      left: itemRect.left - navRect.left,
    });
  };

  const moveToActiveRoute = () => {
    const activeEl = navRef.current?.querySelector(`[data-active="true"]`);
    moveIndicatorToEl(activeEl);
  };

  useEffect(() => {
    moveToActiveRoute();
  }, [pathname]);

  return (
    <div
      ref={navRef}
      onMouseLeave={moveToActiveRoute}
      className="relative flex items-center gap-5 xl:gap-6"
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              onHover: moveIndicatorToEl,
              tone,
            })
          : child,
      )}

      {indicator && (
        <motion.div
          className={cn(
            "absolute -bottom-2 h-0.5 rounded-full",
            isDark ? "bg-[#4FD1C5]/85" : "bg-sky-500/90",
          )}
          animate={{
            width: indicator.width,
            x: indicator.left,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        />
      )}
    </div>
  );
};

export const MenuItem = ({ href, children, onHover, tone = "light" }) => {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === href
      : pathname === href || pathname?.startsWith(`${href}/`);
  const isDark = tone === "dark";

  return (
    <Link href={href}>
      <span
        data-active={isActive ? "true" : "false"}
        onMouseEnter={(e) => onHover && onHover(e.currentTarget)}
        className={cn(
          "cursor-pointer text-sm font-medium whitespace-nowrap transition-colors lg:text-[0.9375rem]",
          isDark
            ? "text-white/70 hover:text-white"
            : "text-slate-600 hover:text-slate-900",
          isActive &&
            (isDark ? "text-[#4FD1C5]" : "text-sky-700"),
        )}
      >
        {children}
      </span>
    </Link>
  );
};
