"use client";

import React from "react";
import { motion } from "framer-motion";
import { Disc, Shield } from "lucide-react";

interface ScrollProgressIndicatorProps {
  progress: number;
  currentScene: number;
  onJumpToScene: (sceneNum: number) => void;
}

const SCENE_NAMES = [
  "01 // INTRODUCTION",
  "02 // MINIFIGURE REVEAL",
  "03 // THE EXPLOSION",
  "04 // TECHNICAL VIEW",
  "05 // THE DETAILS",
  "06 // REASSEMBLY",
];

export default function ScrollProgressIndicator({
  progress,
  currentScene,
  onJumpToScene,
}: ScrollProgressIndicatorProps) {
  return (
    <>
      <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3 select-none pointer-events-auto">
      {/* HUD Telemetry Header */}
      <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-500 tracking-widest uppercase mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD500] animate-ping" />
        <span>SCENE {currentScene} OF 6</span>
      </div>

      {/* Vertical Track with Clickable Nodes */}
      <div className="relative flex flex-col gap-5 items-end py-2">
        {/* Continuous background rail */}
        <div className="absolute right-[5px] top-0 bottom-0 w-[2px] bg-zinc-800 rounded-full" />
        
        {/* Animated scrub indicator bar */}
        <div
          className="absolute right-[5px] top-0 w-[2px] bg-[#FFD500] rounded-full transition-all duration-150 shadow-[0_0_8px_rgba(255,213,0,0.8)]"
          style={{ height: `${progress * 100}%` }}
        />

        {SCENE_NAMES.map((name, idx) => {
          const sceneIndex = idx + 1;
          const isActive = currentScene === sceneIndex;

          return (
            <button
              key={name}
              onClick={() => onJumpToScene(sceneIndex)}
              className="group flex items-center gap-3 cursor-pointer py-1 relative z-10"
            >
              {/* Tooltip on hover or active */}
              <span
                className={`font-mono text-[10px] tracking-wider transition-all duration-300 ${
                  isActive
                    ? "text-[#FFD500] opacity-100 font-bold translate-x-0"
                    : "text-zinc-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                }`}
              >
                {name}
              </span>

              {/* Node Indicator Dot */}
              <div
                className={`w-3 h-3 rounded-full border transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? "bg-[#FFD500] border-[#FFD500] ring-4 ring-[#FFD500]/20 scale-125"
                    : "bg-black border-zinc-700 group-hover:border-zinc-400 group-hover:scale-110"
                }`}
              >
                {isActive && <div className="w-1 h-1 rounded-full bg-black" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Percentage Readout */}
      <div className="mt-3 font-mono text-[10px] text-zinc-400 font-bold">
        {Math.round(progress * 100)}%
      </div>
    </div>

    {/* Mobile Compact Scene Progress Bar with Safe Area Support */}
    <div
      style={{
        bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))",
        right: "max(1rem, env(safe-area-inset-right))",
      }}
      className="fixed z-40 md:hidden flex items-center gap-2 bg-zinc-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl pointer-events-auto"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD500] animate-pulse" />
      <span className="font-mono text-[9px] text-zinc-300 font-semibold tracking-wider">
        SCENE 0{currentScene}/06
      </span>
      <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FFD500] transition-all duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="font-mono text-[9px] text-[#FFD500] font-bold">
        {Math.round(progress * 100)}%
      </span>
    </div>
  </>
  );
}
