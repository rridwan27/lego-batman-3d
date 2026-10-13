"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Film, Cpu, ChevronRight, CheckCircle2, Shield, Eye } from "lucide-react";

interface SetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetModal({ isOpen, onClose }: SetModalProps) {
  const [activeTab, setActiveTab] = useState<"blueprint" | "video">("blueprint");
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);

  const HOTSPOTS = [
    {
      id: 0,
      title: "DUAL-MOLDED BAT-COWL & PRINTED EMBLEM",
      category: "MINIFIGURE",
      desc: "Authentic LEGO Batman cowl with angled bat-ears, white ocular lens openings, and yellow oval Bat-insignia on torso armor.",
      x: "49%",
      y: "48%",
    },
    {
      id: 1,
      title: "SCULPTED FENDERS & TWIN COCKPIT CANOPY",
      category: "CHASSIS",
      desc: "Aerodynamic gloss black bricks curving over wide low-profile tires with trans-amber turn signals and sliding tinted windshield.",
      x: "62%",
      y: "44%",
    },
    {
      id: 2,
      title: "JET AFTERBURNER & REAR BAT-FINS",
      category: "PROPULSION",
      desc: "Central turbofan exhaust with heat-treated fluted exhaust ring and sweeping bat-wing stabilizers for hyper-sonic pursuit.",
      x: "82%",
      y: "40%",
    },
    {
      id: 3,
      title: "HEAVY-DUTY GANTRY & STUDDED PLATFORM",
      category: "FOUNDATION",
      desc: "Modular industrial floor staging built from reinforced Technic trusses and dark-stone gray studded tiles.",
      x: "38%",
      y: "75%",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/92 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              maxHeight: "min(92dvh, 880px)",
            }}
            className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col overscroll-contain"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-800/80 bg-zinc-900/60 gap-3">
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD500] animate-pulse" />
                  <h3 className="font-display text-lg sm:text-2xl tracking-wider text-white">
                    UCS TECHNICAL ARCHIVE
                  </h3>
                </div>

                {/* Mobile close button top-right */}
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="sm:hidden w-11 h-11 rounded-xl bg-zinc-850 border border-zinc-700/80 text-zinc-300 hover:text-white flex items-center justify-center active:scale-95 touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                {/* Tab switchers */}
                <div className="flex items-center bg-black/75 rounded-xl p-1 border border-zinc-800 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab("blueprint")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-mono transition-colors cursor-pointer touch-manipulation min-h-[38px] sm:min-h-0 ${
                      activeTab === "blueprint"
                        ? "bg-[#FFD500] text-black font-bold shadow-md shadow-[#FFD500]/20"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>BLUEPRINT</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("video")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-mono transition-colors cursor-pointer touch-manipulation min-h-[38px] sm:min-h-0 ${
                      activeTab === "video"
                        ? "bg-[#FFD500] text-black font-bold shadow-md shadow-[#FFD500]/20"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>EXPLODED VIDEO</span>
                  </button>
                </div>

                {/* Desktop close button */}
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="hidden sm:flex w-9 h-9 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body with safe area bottom padding */}
            <div
              style={{
                paddingBottom: "max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))",
              }}
              className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Media viewer (Left 8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-inner group">
                  {activeTab === "blueprint" ? (
                    <>
                      <Image
                        src="/batman-exploded.jpg"
                        alt="LEGO Batman Technical Exploded Blueprint"
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />

                      {/* Interactive Hotspots with touch-friendly 36px targets */}
                      {HOTSPOTS.map((spot) => (
                        <button
                          key={spot.id}
                          onClick={() => setActiveHotspot(spot.id)}
                          style={{ left: spot.x, top: spot.y }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all cursor-pointer z-20 touch-manipulation active:scale-95 ${
                            activeHotspot === spot.id
                              ? "bg-[#FFD500] text-black ring-4 ring-[#FFD500]/40 scale-110 shadow-lg shadow-[#FFD500]/50"
                              : "bg-black/85 text-[#FFD500] border border-[#FFD500]/60 hover:scale-110 shadow-md"
                          }`}
                        >
                          <span className="font-mono text-xs font-bold">{spot.id + 1}</span>
                        </button>
                      ))}

                      {/* Corner badge */}
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-zinc-800 text-[9px] sm:text-[10px] font-mono text-zinc-400 pointer-events-none">
                        INTERACTIVE HOTSPOTS [CLICK 1-4]
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <video
                        src="/batman-explosion.mp4"
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Hotspot details when blueprint is active */}
                {activeTab === "blueprint" && activeHotspot !== null && (
                  <motion.div
                    key={activeHotspot}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-[#FFD500]/20 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#FFD500] tracking-widest">
                        SPEC POINT #{activeHotspot + 1} // {HOTSPOTS[activeHotspot].category}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">SYSTEM VERIFIED</span>
                    </div>
                    <h4 className="font-display text-lg tracking-wider text-white">
                      {HOTSPOTS[activeHotspot].title}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {HOTSPOTS[activeHotspot].desc}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Technical Specifications Specs Sidebar (Right 4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
                  <div className="border-b border-zinc-800 pb-3">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                      OFFICIAL LEGO® UCS SPECIFICATION
                    </span>
                    <h4 className="font-display text-2xl tracking-wider text-[#FFD500] mt-1">
                      BATMAN & 1989 BATMOBILE
                    </h4>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-zinc-850">
                      <span className="text-zinc-500">SET PIECE COUNT</span>
                      <span className="text-white font-bold">2,049 BRICKS</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-zinc-850">
                      <span className="text-zinc-500">OVERALL LENGTH</span>
                      <span className="text-white font-bold">52 CM (20.5 IN)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-zinc-850">
                      <span className="text-zinc-500">CHASSIS WIDTH</span>
                      <span className="text-white font-bold">24 CM (9.4 IN)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-zinc-850">
                      <span className="text-zinc-500">MINIFIGURES INCLUDED</span>
                      <span className="text-[#FFD500] font-bold">EXCLUSIVE BATMAN</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-zinc-850">
                      <span className="text-zinc-500">COCKPIT ACCESS</span>
                      <span className="text-white font-bold">SLIDING CANOPY</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-zinc-500">PLATFORM MOUNT</span>
                      <span className="text-white font-bold">HEAVY INDUSTRIAL TRUSS</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-[#FFD500]" />
                      <span>Authentic LEGO elements only</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-[#FFD500]" />
                      <span>Interactive sliding mechanics</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-[#FFD500]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#FFD500] tracking-wider block">
                      AVAILABILITY
                    </span>
                    <span className="text-sm font-bold text-white">COLLECTOR EDITION UCS</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-[#FFD500] hover:bg-[#FFE033] text-black font-mono text-xs font-bold transition-transform active:scale-95 cursor-pointer"
                  >
                    CLOSE ARCHIVE
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
