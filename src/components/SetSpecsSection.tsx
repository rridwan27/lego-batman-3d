"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Sparkles, Zap, Wrench, Eye, ArrowRight, Gauge, Disc, Compass } from "lucide-react";
import BatCanvas from "@/components/bat-canvas";

interface SetSpecsSectionProps {
  onExploreClick: () => void;
}

export default function SetSpecsSection({ onExploreClick }: SetSpecsSectionProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const FEATURES = [
    {
      title: "1989 SCULPTED BATMOBILE",
      badge: "ULTIMATE COLLECTOR SERIES",
      desc: "Faithfully engineered to mirror the sleek, curving silhouette of the iconic 1989 Batmobile. Featuring wrap-around windshield bricks, dual pop-up machine guns, and curved wheel-arch elements.",
      stats: [
        { label: "PIECES", val: "2,049" },
        { label: "SCALE", val: "1:12 UCS" },
        { label: "FINISH", val: "High-Gloss Black" },
      ],
    },
    {
      title: "DUAL-FACED BATMAN MINIFIGURE",
      badge: "EXCLUSIVE COLLECTOR MOLD",
      desc: "Complete with the definitive molded cowl, flexible rubberized bat-cape, authentic printed torso detailing, and the signature yellow utility belt.",
      stats: [
        { label: "HEADPIECE", val: "Molded Cowl" },
        { label: "ACCESSORY", val: "Dual Batarangs" },
        { label: "BELT", val: "3D Tool Rig" },
      ],
    },
    {
      title: "REINFORCED BATCAVE GANTRY",
      badge: "HEAVY-DUTY INDUSTRIAL",
      desc: "Sturdy multi-tiered display platform with Technic truss uprights, hydraulic lift struts, and dark stone studded plating matching the cinematic Batcave scene.",
      stats: [
        { label: "TRUSS HEIGHT", val: "32 Studs" },
        { label: "CAPACITY", val: "Full UCS Chassis" },
        { label: "LIGHTING", val: "Dual Amber Beacons" },
      ],
    },
  ];

  return (
    <section
      id="specs"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingBottom: "max(5rem, calc(env(safe-area-inset-bottom) + 4rem))",
      }}
      className="relative bg-black text-white py-16 sm:py-24 border-t border-zinc-900 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#FFD500]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FFD500]" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFD500]">
                BATCAVE ARCHIVE // UCS CLASSIFIED
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-wider text-white">
              CRAFTED WITH OBSESSIVE FIDELITY
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
            Every brick, curve, and shadow was modeled to honor the gothic noir tone of Gotham City and the timeless precision of the LEGO system.
          </p>
        </div>

        {/* Feature Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: 3D interactive viewer */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
              <BatCanvas />
            </div>

            <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-zinc-500 px-2">
              <span>INTERACTIVE R3F BRICK ENGINE</span>
              <span>TOUCH ORBIT ACTIVE</span>
            </div>
          </div>

          {/* Right: Technical Details Tabs */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex gap-2 p-1 bg-zinc-900/60 rounded-xl border border-zinc-800">
              {FEATURES.map((feat, idx) => (
                <button
                  key={feat.title}
                  onClick={() => setActiveFeature(idx)}
                  className={`flex-1 py-2.5 sm:py-2 rounded-lg text-[11px] font-mono tracking-wider transition-all cursor-pointer touch-manipulation min-h-[42px] sm:min-h-0 flex items-center justify-center ${
                    activeFeature === idx
                      ? "bg-[#FFD500] text-black font-bold shadow-md shadow-[#FFD500]/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  MOD {idx + 1}
                </button>
              ))}
            </div>

            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col gap-6"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFD500] px-2.5 py-1 rounded bg-[#FFD500]/10 border border-[#FFD500]/20">
                  {FEATURES[activeFeature].badge}
                </span>
                <h3 className="font-display text-xl sm:text-3xl tracking-wider text-white mt-3">
                  {FEATURES[activeFeature].title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-sans leading-relaxed">
                  {FEATURES[activeFeature].desc}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-900">
                {FEATURES[activeFeature].stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase">{stat.label}</span>
                    <span className="font-display text-base sm:text-lg tracking-wider text-white mt-0.5">{stat.val}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onExploreClick}
                className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-3 rounded-xl border border-zinc-800 hover:border-[#FFD500]/50 hover:bg-[#FFD500]/5 text-xs font-mono tracking-wider text-zinc-300 hover:text-[#FFD500] transition-colors cursor-pointer touch-manipulation min-h-[44px]"
              >
                <span>OPEN FULL TECHNICAL BLUEPRINT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Technical Footer Telemetry */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 border-t border-zinc-900 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GOTHAM CITY TERMINAL // TELEMETRY: NOMINAL</span>
          </div>
          <div>LEGO® BATMAN™ IS A TRADEMARK OF THE LEGO GROUP & DC COMICS.</div>
        </div>
      </div>
    </section>
  );
}
