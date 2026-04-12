"use client";

import { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Fintech hero: matches #0A192F canvas */
const BG = "#0A192F";
const LINE = "#4FD1C5";
const VB_W = 1000;
const VB_H = 420;

const VERTICES = [
  [0, 352],
  [85, 318],
  [165, 332],
  [245, 288],
  [325, 302],
  [405, 258],
  [485, 272],
  [565, 222],
  [645, 238],
  [725, 188],
  [805, 202],
  [875, 142],
  [935, 118],
  [1000, 58],
];

const DRAW_DURATION = 2.2;
const DRAW_EASE = [0.25, 0.1, 0.25, 1];

function buildPaths() {
  let line = `M ${VERTICES[0][0]} ${VERTICES[0][1]}`;
  for (let i = 1; i < VERTICES.length; i++) {
    line += ` L ${VERTICES[i][0]} ${VERTICES[i][1]}`;
  }
  const area = `${line} L ${VB_W} ${VB_H} L 0 ${VB_H} Z`;
  return { line, area };
}

function GridLines() {
  const stroke = "rgba(255,255,255,0.08)";
  return (
    <g>
      {Array.from({ length: 21 }, (_, i) => {
        const x = (i / 20) * VB_W;
        return (
          <line
            key={`v-${i}`}
            x1={x}
            x2={x}
            y1={0}
            y2={VB_H}
            stroke={stroke}
            strokeWidth="1"
          />
        );
      })}
      {Array.from({ length: 11 }, (_, i) => {
        const y = (i / 10) * VB_H;
        return (
          <line
            key={`h-${i}`}
            x1={0}
            x2={VB_W}
            y1={y}
            y2={y}
            stroke={stroke}
            strokeWidth="1"
          />
        );
      })}
    </g>
  );
}

export default function SensexChartBackdrop() {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const { line, area } = useMemo(() => buildPaths(), []);

  const gradArea = `chart-area-${uid}`;
  const glow = `chart-glow-${uid}`;

  const initialPath = reduceMotion ? 1 : 0;
  const areaDelay = reduceMotion ? 0 : DRAW_DURATION * 0.32;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0" style={{ backgroundColor: BG }} />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradArea} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LINE} stopOpacity="0.09" />
            <stop offset="55%" stopColor={LINE} stopOpacity="0.04" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </linearGradient>
          {/* Minimal glow — not neon */}
          <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.9" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d={area}
          fill={`url(#${gradArea})`}
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{
            opacity: {
              duration: reduceMotion ? 0 : 0.75,
              delay: areaDelay,
              ease: DRAW_EASE,
            },
          }}
        />

        <GridLines />

        <motion.path
          d={line}
          fill="none"
          stroke={LINE}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="nonScalingStroke"
          filter={`url(#${glow})`}
          initial={{ pathLength: initialPath }}
          animate={{ pathLength: 1 }}
          transition={{
            pathLength: {
              duration: reduceMotion ? 0 : DRAW_DURATION,
              ease: DRAW_EASE,
            },
          }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="nonScalingStroke"
          initial={{ pathLength: initialPath }}
          animate={{ pathLength: 1 }}
          transition={{
            pathLength: {
              duration: reduceMotion ? 0 : DRAW_DURATION,
              ease: DRAW_EASE,
            },
          }}
        />

        <g className="hidden sm:block">
          {VERTICES.map(([x, y], i) => (
            <motion.circle
              key={`n-${i}`}
              cx={x}
              cy={y}
              r="2.8"
              fill="#E5E7EB"
              stroke={LINE}
              strokeWidth="0.9"
              strokeOpacity="0.85"
              initial={{
                opacity: reduceMotion ? 1 : 0,
                scale: reduceMotion ? 1 : 0,
              }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: reduceMotion ? 0 : DRAW_DURATION * 0.9 + i * 0.04,
                duration: 0.25,
                ease: "easeOut",
              }}
            />
          ))}
        </g>
      </svg>

      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_50%_55%,transparent_50%,rgba(0,0,0,0.12)_100%)]"
        aria-hidden
      />
    </div>
  );
}
