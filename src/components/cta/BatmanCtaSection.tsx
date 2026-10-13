"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { animate } from "animejs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lock,
  Box,
  Eye,
  ShoppingBag,
  Zap,
  ArrowUp,
  Compass,
} from "lucide-react";
import { soundEngine } from "@/components/cinematic/SoundManager";

// Dynamically load Three.js 3D Minifigure Canvas with SSR disabled
const BatmanCtaCanvas = dynamic(() => import("./BatmanCtaCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] bg-zinc-950/80 rounded-2xl flex flex-col items-center justify-center gap-4 border border-zinc-800/80">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800 border-t-[#FFD500] animate-spin" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFD500] animate-ping" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="font-display text-sm tracking-wider text-white">
          LOADING 3D MINIFIGURE GLB
        </span>
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          PARSING REAL-TIME MESH & MATERIALS
        </span>
      </div>
    </div>
  ),
});

interface BatmanCtaSectionProps {
  onExploreClick?: () => void;
}

export default function BatmanCtaSection({ onExploreClick }: BatmanCtaSectionProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const card3DRef = useRef<HTMLDivElement>(null);

  // Soothing organic breathing glow powered by Anime.js
  useEffect(() => {
    if (card3DRef.current) {
      animate(card3DRef.current, {
        boxShadow: [
          "0 0 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 213, 0, 0.08)",
          "0 0 65px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 213, 0, 0.22)",
          "0 0 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 213, 0, 0.08)",
        ],
        duration: 5200,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    }

    animate(".anime-telemetry-beacon", {
      scale: [1, 1.3],
      opacity: [0.6, 1],
      duration: 1600,
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    soundEngine.playReassemblyLock();
    setIsSubscribed(true);
  };

  const handleOrderClick = () => {
    soundEngine.playReassemblyLock();
    setOrderModalOpen(true);
  };

  const scrollToTop = () => {
    soundEngine.playLegoClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="cta-section"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
      className="relative bg-black text-white pt-20 pb-16 sm:pt-28 sm:pb-24 border-t border-zinc-900 overflow-hidden"
    >
      {/* Background Cinematic Fog & Glow FX */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FFD500]/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[220px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16 sm:gap-20 relative z-10">
        
        {/* Main CTA Dual-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Compelling Copy & Collector Action */}
          <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
            
            {/* Top Micro-Badge */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD500] animate-pulse" />
              <div className="px-3 py-1 rounded-full bg-zinc-950/80 border border-white/10 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FFD500] uppercase font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md">
                <Shield className="w-3.5 h-3.5 text-[#FFD500]" />
                <span>GOTHAM VIGILANTE ARCHIVE // VOL. 01</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-[0.92]">
                THE DARK KNIGHT IS BUILT. <br />
                <span className="text-[#FFD500] drop-shadow-[0_0_30px_rgba(255,213,0,0.4)]">
                  CLAIM YOUR MINIFIGURE.
                </span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed mt-2 font-normal">
                Forged from high-tensile ABS plastic with authentic dual-molded cowl elements,
                printed chest insignia, and a flexible scalloped bat-cape. Inspect the real-time 3D model
                and reserve your authenticated collector edition before allocations close.
              </p>
            </div>

            {/* Quick Specs Pill Row */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-lg">
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">MOLD SCALE</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-white">1:1 UCS SCALE</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">COWL DESIGN</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#FFD500]">DUAL-MOLDED</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">CERTIFICATE</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-white">SERIALIZED</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                data-magnetic="true"
                onClick={handleOrderClick}
                className="group relative px-8 py-4 rounded-xl bg-[#FFD500] hover:bg-[#FFE033] text-black font-mono font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,213,0,0.4)] hover:shadow-[0_0_45px_rgba(255,213,0,0.65)] active:scale-95 cursor-pointer flex items-center justify-center gap-3 overflow-hidden min-h-[48px] will-change-transform"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>SECURE MINIFIGURE</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                data-magnetic="true"
                onClick={() => {
                  soundEngine.playLegoClick();
                  if (onExploreClick) onExploreClick();
                }}
                className="px-6 py-4 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-[#FFD500] text-zinc-300 hover:text-white font-mono text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 backdrop-blur-md min-h-[48px] will-change-transform"
              >
                <Eye className="w-4 h-4 text-[#FFD500]" />
                <span>INSPECT BLUEPRINT</span>
              </button>
            </div>

            {/* VIP Batcave Frequency Newsletter Input */}
            <div className="pt-4 border-t border-zinc-900">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">
                JOIN THE BATCAVE VAULT ALLOCATION REGISTRY
              </span>
              
              {isSubscribed ? (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-[#FFD500]/50 flex items-center gap-3 text-[#FFD500]">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD500] shrink-0" />
                  <span className="font-mono text-xs tracking-wider">
                    FREQUENCY ESTABLISHED. YOU ARE ON THE PRIORITY UCS DISPATCH LIST.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-lg"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR ENCRYPTED GOTHAM EMAIL..."
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-950/90 border border-zinc-800 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FFD500] transition-colors min-h-[44px]"
                  />
                  <button
                    data-magnetic="true"
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#FFD500] text-zinc-200 hover:text-white text-xs font-mono tracking-wider uppercase transition-colors shrink-0 cursor-pointer min-h-[44px] flex items-center justify-center gap-2 will-change-transform"
                  >
                    <span>JOIN REGISTRY</span>
                    <Lock className="w-3.5 h-3.5 text-[#FFD500]" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: 3D Real-Time GLB Minifigure Viewer */}
          <div className="lg:col-span-5 relative">
            <div
              ref={card3DRef}
              className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] max-h-[580px] rounded-3xl bg-gradient-to-b from-zinc-900/60 via-zinc-950/90 to-black border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col group will-change-[box-shadow]"
            >
              
              {/* Interactive Telemetry Overlay Header */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-mono tracking-widest text-[#FFD500] uppercase flex items-center gap-2">
                  <span className="anime-telemetry-beacon w-1.5 h-1.5 rounded-full bg-[#FFD500]" />
                  <span>GLB 3D VIEWER // 360° ORBIT</span>
                </div>

                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <button
                    onClick={() => {
                      soundEngine.playLegoClick();
                      setAutoRotate((prev) => !prev);
                    }}
                    title={autoRotate ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
                    className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-zinc-800 hover:border-zinc-600 text-[10px] font-mono text-zinc-300 hover:text-white cursor-pointer transition-colors"
                  >
                    ROTATE: {autoRotate ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              {/* 3D Canvas Viewport */}
              <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                <BatmanCtaCanvas autoRotate={autoRotate} />
              </div>

              {/* Interactive Bottom Gesture Hint */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest bg-black/70 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                  TOUCH & DRAG TO SPIN MODEL
                </span>
                <span className="font-mono text-[9px] text-[#FFD500] uppercase tracking-widest bg-black/70 px-2.5 py-1 rounded-full border border-[#FFD500]/30 backdrop-blur-sm">
                  ABS PRECISION
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Triple Value Guarantee Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-10 border-t border-zinc-900">
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFD500]/10 border border-[#FFD500]/30 flex items-center justify-center text-[#FFD500] shrink-0">
              <Box className="w-5 h-5 text-[#FFD500]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                01 // SERIALIZED UCS EDITION
              </span>
              <span className="font-sans text-xs text-zinc-400 mt-1 leading-relaxed">
                Individually numbered holographic collector seal authenticating production lineage.
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0">
              <Shield className="w-5 h-5 text-[#00E5FF]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                02 // OFFICIAL DC CERTIFIED
              </span>
              <span className="font-sans text-xs text-zinc-400 mt-1 leading-relaxed">
                Genuine LEGO DC Comics packaging with museum-grade presentation display pedestal.
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF4500]/10 border border-[#FF4500]/30 flex items-center justify-center text-[#FF4500] shrink-0">
              <Sparkles className="w-5 h-5 text-[#FF4500]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                03 // INSURED WORLDWIDE FREIGHT
              </span>
              <span className="font-sans text-xs text-zinc-400 mt-1 leading-relaxed">
                Double-boxed heavy vault dispatch with continuous real-time tracking across Gotham.
              </span>
            </div>
          </div>
        </div>

        {/* Section Footer / Return To Batcave */}
        <div className="pt-8 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#FFD500]" />
            <span>LEGO® DC COMICS BATMAN™ ULTIMATE COLLECTOR SERIES ARCHIVE</span>
          </div>

          <button
            data-magnetic="true"
            onClick={scrollToTop}
            className="flex items-center gap-2 text-zinc-400 hover:text-[#FFD500] transition-colors cursor-pointer py-1 will-change-transform"
          >
            <span>RETURN TO BATCAVE SUMMIT</span>
            <ArrowUp className="w-4 h-4 text-[#FFD500]" />
          </button>
        </div>
      </div>

      {/* Quick Order Confirmation Modal */}
      <AnimatePresence>
        {orderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderModalOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-[#FFD500]/50 p-6 sm:p-8 flex flex-col gap-6 shadow-[0_0_50px_rgba(255,213,0,0.2)] z-10"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFD500] animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FFD500]">
                    BATCAVE VAULT CONFIRMATION
                  </span>
                </div>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="text-zinc-400 hover:text-white cursor-pointer font-mono text-xs"
                >
                  [CLOSE]
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-display text-3xl uppercase text-white leading-none">
                  ALLOCATION RESERVED
                </h3>
                <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                  Your 3D LEGO Batman Minifigure allocation has been logged with Gotham Dispatch.
                  A priority confirmation package with tracking and serialized authentication will be transmitted.
                </p>
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 mt-2 flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-400">MODEL ID:</span>
                  <span className="text-[#FFD500] font-bold">UCS-MINIFIG-01</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playLegoClick();
                  setOrderModalOpen(false);
                }}
                className="w-full py-3.5 rounded-xl bg-[#FFD500] hover:bg-[#FFE033] text-black font-mono font-bold text-xs uppercase tracking-widest transition-transform active:scale-95 cursor-pointer shadow-lg"
              >
                RETURN TO EXPERIENCE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
