"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, Cpu, Crosshair } from "lucide-react";

interface TechnicalCalloutsProps {
  visible: boolean;
  activeScene: number;
}

interface CalloutItem {
  id: string;
  number: string;
  title: string;
  category: string;
  specs: string;
  origin: { x: number; y: number }; // Percentage coordinates of the component
  target: { x: number; y: number }; // Endpoint of leader line
  align: "left" | "right";
}

const CALLOUTS: CalloutItem[] = [
  {
    id: "cowl",
    number: "01",
    title: "THE COWL",
    category: "HEADPIECE / DEFENSE",
    specs: "Reinforced high-impact ABS mold with angled bat-ears and ocular slits. Separates vertically along cranial axis.",
    origin: { x: 50, y: 18 },
    target: { x: 74, y: 14 },
    align: "right",
  },
  {
    id: "cape",
    number: "02",
    title: "THE CAPE",
    category: "AERODYNAMICS",
    specs: "Scalloped twin-fold synthetic fabric with dual neck collar eyelets. Engineered for parabolic gliding.",
    origin: { x: 38, y: 44 },
    target: { x: 18, y: 36 },
    align: "left",
  },
  {
    id: "armor",
    number: "03",
    title: "THE ARMOR",
    category: "CHASSIS / TORSO",
    specs: "Pad-printed yellow oval insignia with pectoral and abdominal plate highlights over matte black substrate.",
    origin: { x: 50, y: 52 },
    target: { x: 22, y: 58 },
    align: "left",
  },
  {
    id: "utility",
    number: "04",
    title: "UTILITY SYSTEM",
    category: "TACTICAL RIG",
    specs: "Multi-cell golden yellow (#FFD500) modular belt with 4 pressurized gadget canisters and grappling holster.",
    origin: { x: 50, y: 64 },
    target: { x: 76, y: 62 },
    align: "right",
  },
  {
    id: "foundation",
    number: "05",
    title: "THE FOUNDATION",
    category: "LOCOMOTION",
    specs: "Dual independent pivot hip-pins with reinforced leg cavities for secure studded anchoring on Gotham rooftops.",
    origin: { x: 50, y: 84 },
    target: { x: 74, y: 86 },
    align: "right",
  },
];

export default function TechnicalCallouts({ visible }: TechnicalCalloutsProps) {
  const [selectedCallout, setSelectedCallout] = useState<string>("cowl");

  if (!visible) return null;

  const activeCalloutData = CALLOUTS.find((c) => c.id === selectedCallout) || CALLOUTS[0];

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* DESKTOP LAYOUT (md and up): SVG leader lines and floating cards */}
      <div className="hidden md:block absolute inset-0">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {CALLOUTS.map((callout, index) => {
            const isSelected = selectedCallout === callout.id;
            const midX =
              callout.align === "right"
                ? callout.origin.x + (callout.target.x - callout.origin.x) * 0.4
                : callout.origin.x - (callout.origin.x - callout.target.x) * 0.4;
            const midY = callout.origin.y;

            const pathD = `M ${callout.origin.x} ${callout.origin.y} L ${midX} ${midY} L ${callout.target.x} ${callout.target.y}`;

            return (
              <g key={callout.id} className="transition-opacity duration-500">
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? "#FFD500" : "rgba(255, 255, 255, 0.45)"}
                  strokeWidth={isSelected ? "1.8" : "1"}
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                />

                <motion.circle
                  cx={`${callout.origin.x}%`}
                  cy={`${callout.origin.y}%`}
                  r={isSelected ? 5 : 3.5}
                  fill={isSelected ? "#FFD500" : "#ffffff"}
                  filter="url(#glow)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.4 }}
                />
                <motion.circle
                  cx={`${callout.origin.x}%`}
                  cy={`${callout.origin.y}%`}
                  r={8}
                  fill="none"
                  stroke={isSelected ? "#FFD500" : "rgba(255, 213, 0, 0.6)"}
                  strokeWidth="1"
                  animate={{ r: [8, 14, 8], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: index * 0.2 }}
                />

                <circle
                  cx={`${callout.target.x}%`}
                  cy={`${callout.target.y}%`}
                  r="3"
                  fill={isSelected ? "#FFD500" : "rgba(255, 255, 255, 0.6)"}
                />
              </g>
            );
          })}
        </svg>

        {CALLOUTS.map((callout, index) => {
          const isSelected = selectedCallout === callout.id;

          return (
            <motion.div
              key={callout.id}
              initial={{ opacity: 0, x: callout.align === "right" ? 15 : -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: "easeOut" }}
              style={{
                left: `${callout.target.x}%`,
                top: `${callout.target.y}%`,
                transform: callout.align === "right" ? "translate(8px, -50%)" : "translate(-102%, -50%)",
              }}
              className="absolute pointer-events-auto"
            >
              <div
                onClick={() => setSelectedCallout(callout.id)}
                className={`p-3 sm:p-4 rounded-xl backdrop-blur-xl border transition-all duration-300 cursor-pointer max-w-[220px] sm:max-w-[280px] shadow-2xl ${
                  isSelected
                    ? "bg-zinc-950/95 border-[#FFD500] ring-1 ring-[#FFD500]/50 shadow-[0_0_25px_rgba(255,213,0,0.25)]"
                    : "bg-zinc-950/80 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-[#FFD500] font-bold tracking-widest">
                    {callout.number} // {callout.category}
                  </span>
                  <Crosshair className={`w-3 h-3 ${isSelected ? "text-[#FFD500]" : "text-zinc-500"}`} />
                </div>

                <h4 className="font-display text-base sm:text-lg tracking-wider text-white">
                  {callout.title}
                </h4>

                <p className="font-sans text-[11px] sm:text-xs text-zinc-400 mt-1 leading-relaxed">
                  {callout.specs}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MOBILE / TOUCH LAYOUT (< md): Interactive origin pins + docked bottom card */}
      <div className="md:hidden absolute inset-0 pointer-events-auto flex flex-col justify-between p-4">
        {/* Origin interactive pins on figure */}
        <div className="absolute inset-0 pointer-events-none">
          {CALLOUTS.map((callout) => {
            const isSelected = selectedCallout === callout.id;
            return (
              <button
                key={callout.id}
                onClick={() => setSelectedCallout(callout.id)}
                style={{ left: `${callout.origin.x}%`, top: `${callout.origin.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto p-2 cursor-pointer touch-manipulation group"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] font-bold transition-transform active:scale-95 ${
                    isSelected
                      ? "bg-[#FFD500] text-black ring-4 ring-[#FFD500]/30 scale-110 shadow-[0_0_15px_#FFD500]"
                      : "bg-black/85 text-[#FFD500] border border-[#FFD500]/60"
                  }`}
                >
                  {callout.number}
                </div>
              </button>
            );
          })}
        </div>

        {/* Top spacer */}
        <div />

        {/* Bottom Docked Mobile Card with safe-area bottom */}
        <div
          style={{
            paddingBottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))",
          }}
          className="relative z-30 flex flex-col gap-2.5 mt-auto"
        >
          {/* Horizontal scrollable pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CALLOUTS.map((callout) => {
              const isSelected = selectedCallout === callout.id;
              return (
                <button
                  key={callout.id}
                  onClick={() => setSelectedCallout(callout.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider whitespace-nowrap transition-all touch-manipulation cursor-pointer ${
                    isSelected
                      ? "bg-[#FFD500] text-black font-bold shadow-md shadow-[#FFD500]/25"
                      : "bg-zinc-900/90 text-zinc-400 border border-zinc-800"
                  }`}
                >
                  {callout.number} {callout.title}
                </button>
              );
            })}
          </div>

          {/* Active Callout Details Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCalloutData.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-3.5 rounded-2xl bg-zinc-950/95 border border-[#FFD500]/40 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[9px] text-[#FFD500] font-bold tracking-widest uppercase">
                  SPEC // {activeCalloutData.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  PT {activeCalloutData.number}/05
                </span>
              </div>
              <h4 className="font-display text-base tracking-wider text-white">
                {activeCalloutData.title}
              </h4>
              <p className="font-sans text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
                {activeCalloutData.specs}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Holographic HUD Blueprint Accent Watermark in top corner */}
      <div className="absolute top-20 right-8 hidden lg:flex flex-col items-end gap-1 font-mono text-[9px] text-zinc-600 pointer-events-none select-none">
        <span className="text-zinc-500">UCS SCHEMATIC REF: #76139</span>
        <span>COORDINATES: 40.7128° N, 74.0060° W</span>
        <span>TELEM: DISASSEMBLED ARCHITECTURE</span>
      </div>
    </div>
  );
}
