"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, ArrowRight, Eye, Layers } from "lucide-react";

interface CinematicTextProps {
  currentScene: number; // 1 to 6
  onEnterGotham?: () => void;
  onExploreSet?: () => void;
}

interface SceneContent {
  badge: string;
  line1: string;
  line2: string;
  support: string;
  accentWord?: string;
  showCta?: boolean;
}

const SCENES: Record<number, SceneContent> = {
  1: {
    badge: "GOTHAM CITY / 00:01 AM",
    line1: "GOTHAM NEVER SLEEPS.",
    line2: "NEITHER DOES ITS LEGEND.",
    support: "From the deepest shadows of the Batcave, an icon emerges from the darkness.",
    accentWord: "LEGEND.",
  },
  2: {
    badge: "02 // THE MINIFIGURE REVEAL",
    line1: "BUILT FOR THE DARK.",
    line2: "ONE SYMBOL. A THOUSAND STORIES.",
    support: "Forged with authentic LEGO precision, the Dark Knight stands ready to defend Gotham.",
    accentWord: "DARK.",
  },
  3: {
    badge: "03 // THE EXPLOSION SEQUENCE",
    line1: "DECONSTRUCTING A LEGEND.",
    line2: "PRECISION IN EVERY ELEMENT.",
    support: "Watch the intricate anatomy separate along calibrated three-dimensional trajectories.",
    accentWord: "LEGEND.",
  },
  4: {
    badge: "04 // EXPLODED TECHNICAL VIEW",
    line1: "ANATOMY OF JUSTICE.",
    line2: "SUSPENDED IN MODULAR SPACE.",
    support: "Suspended components reveal the high-tensile modular construction of the Bat-suit.",
    accentWord: "JUSTICE.",
  },
  5: {
    badge: "05 // DETAILS OF THE LEGEND",
    line1: "EVERY DETAIL HAS A PURPOSE.",
    line2: "EVERY PIECE TELLS A STORY.",
    support: "From the molded cowl to the scalloped cape, each element is crafted with obsessive fidelity.",
    accentWord: "PURPOSE.",
  },
  6: {
    badge: "06 // THE REASSEMBLY",
    line1: "THE LEGEND IS BUILT.",
    line2: "WELCOME TO THE DARK SIDE.",
    support: "Fully restored and ready for Gotham's longest night. Experience the set today.",
    accentWord: "BUILT.",
    showCta: true,
  },
};

export default function CinematicText({
  currentScene,
  onEnterGotham,
  onExploreSet,
}: CinematicTextProps) {
  const content = SCENES[currentScene] || SCENES[1];

  const wordsLine1 = content.line1.split(" ");
  const wordsLine2 = content.line2.split(" ");

  return (
    <div
      style={{
        paddingBottom: "max(2rem, calc(env(safe-area-inset-bottom) + 2rem))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
      className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end lg:justify-center p-4 sm:p-10 lg:p-16 select-none max-w-4xl bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:bg-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-start gap-2.5 sm:gap-4"
        >
          {/* Horizontal Editorial Badge with sliding reveal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-2 mb-0.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#FFD500] animate-pulse" />
            <div className="px-2.5 py-1 rounded-full bg-zinc-950/85 border border-white/10 text-[9px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] text-[#FFD500] uppercase font-semibold flex items-center gap-1.5 sm:gap-2 shadow-lg backdrop-blur-md">
              <Shield className="w-3 h-3 text-[#FFD500]" />
              <span>{content.badge}</span>
            </div>
          </motion.div>

          {/* Masked Headline with Staggered Word Reveal & Blur-to-Sharp */}
          <h2 className="font-display tracking-tight leading-[0.92] sm:leading-[0.88] text-white text-3xl sm:text-5xl lg:text-7xl uppercase flex flex-col drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
            {/* Line 1 */}
            <div className="overflow-hidden py-0.5 flex flex-wrap gap-x-2 sm:gap-x-3.5">
              {wordsLine1.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`inline-block ${
                    word === content.accentWord
                      ? "text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.4)]"
                      : "text-white"
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Line 2 */}
            <div className="overflow-hidden py-0.5 flex flex-wrap gap-x-2 sm:gap-x-3.5">
              {wordsLine2.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`inline-block ${
                    word === content.accentWord
                      ? "text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.4)]"
                      : "text-zinc-300"
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </h2>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-sans text-xs sm:text-base text-zinc-400 max-w-lg leading-relaxed font-normal line-clamp-3 sm:line-clamp-none"
          >
            {content.support}
          </motion.p>

          {/* Interactive CTAs on Final Hero Reassembly (Scene 6) */}
          {content.showCta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2.5 sm:gap-4 mt-2 sm:mt-3 pointer-events-auto"
            >
              <button
                data-magnetic="true"
                onClick={onEnterGotham}
                className="group relative px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-[#FFD500] hover:bg-[#FFE033] text-black font-mono font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,213,0,0.4)] hover:shadow-[0_0_45px_rgba(255,213,0,0.65)] active:scale-95 cursor-pointer flex items-center justify-center gap-3 overflow-hidden min-h-[44px] will-change-transform"
              >
                <span className="relative z-10">ENTER GOTHAM</span>
                <ArrowRight className="w-4 h-4 text-black relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                data-magnetic="true"
                onClick={onExploreSet}
                className="px-5 py-3.5 sm:px-7 sm:py-4 rounded-xl bg-black/75 hover:bg-zinc-900 border border-zinc-700 hover:border-[#FFD500] text-zinc-200 hover:text-white font-mono text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 backdrop-blur-md min-h-[44px] will-change-transform"
              >
                <Eye className="w-4 h-4 text-[#FFD500]" />
                <span>EXPLORE THE SET</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
