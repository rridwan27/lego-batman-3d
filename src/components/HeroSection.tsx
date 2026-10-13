"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Compass, RotateCcw, Volume2, VolumeX, Eye } from "lucide-react";
import BatAtmosphereCanvas from "@/components/BatAtmosphereCanvas";

interface HeroSectionProps {
  headlightsOn: boolean;
  onToggleHeadlights: () => void;
  onExploreClick: () => void;
  onEnterGothamClick: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function HeroSection({
  headlightsOn,
  onToggleHeadlights,
  onExploreClick,
  onEnterGothamClick,
  soundEnabled,
  onToggleSound,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [introStep, setIntroStep] = useState<number>(0);
  const [isHoveringExplore, setIsHoveringExplore] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Smooth mouse parallax physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 120, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D perspective transforms for the hero artwork
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  const translateX = useTransform(smoothMouseX, [-0.5, 0.5], [-16, 16]);
  const translateY = useTransform(smoothMouseY, [-0.5, 0.5], [-12, 12]);

  // Lighting spotlight coordinate following cursor
  const lightX = useTransform(smoothMouseX, [-0.5, 0.5], ["25%", "75%"]);
  const lightY = useTransform(smoothMouseY, [-0.5, 0.5], ["20%", "80%"]);

  // Sound synthesis utility using Web Audio API
  const playCinematicSound = (type: "swoosh" | "pulse" | "light") => {
    if (!soundEnabled) return;
    try {
      const ctx = audioContext || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (!audioContext) setAudioContext(ctx);
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === "swoosh") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.6);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === "light") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.25);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "pulse") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Cinematic 7-Stage Reveal Timeline
  useEffect(() => {
    const timers = [
      setTimeout(() => setIntroStep(1), 300),   // Cold blue light shafts pierce darkness
      setTimeout(() => setIntroStep(2), 1100),  // Atmospheric fog & Batcave structures reveal
      setTimeout(() => setIntroStep(3), 1900),  // Batmobile bodywork shines & pushes in
      setTimeout(() => setIntroStep(4), 2700),  // LEGO Batman spotlight reveal
      setTimeout(() => setIntroStep(5), 3500),  // Headline staggered words animate in
      setTimeout(() => setIntroStep(6), 4300),  // Supporting copy & CTA buttons fade in
      setTimeout(() => setIntroStep(7), 5100),  // Complete: ambient loop active
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const replayCinematicIntro = () => {
    setIntroStep(0);
    playCinematicSound("swoosh");
    setTimeout(() => setIntroStep(1), 300);
    setTimeout(() => setIntroStep(2), 1000);
    setTimeout(() => setIntroStep(3), 1800);
    setTimeout(() => setIntroStep(4), 2600);
    setTimeout(() => setIntroStep(5), 3400);
    setTimeout(() => setIntroStep(6), 4200);
    setTimeout(() => setIntroStep(7), 5000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const effectiveHeadlights = headlightsOn || isHoveringExplore;

  // Staggered words for headline
  const headlineLine1 = ["THE", "DARK", "KNIGHT."];
  const headlineLine2 = ["REBUILT", "IN", "LEGO."];

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[100svh] bg-black text-white overflow-hidden flex flex-col justify-center select-none"
      style={{ backgroundColor: "#000000" }}
    >
      {/* 3D WebGL Floating Dust & Point Light Canvas */}
      <BatAtmosphereCanvas />

      {/* Volumetric Cold Blue Light Beams (Stage 1+) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left-Angled Blue Volumetric Light Cone */}
        <motion.div
          animate={{
            opacity: introStep >= 1 ? [0.25, 0.4, 0.25] : 0,
            scaleY: introStep >= 1 ? 1 : 0.4,
          }}
          transition={{
            opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            scaleY: { duration: 1.6, ease: "easeOut" },
          }}
          className="absolute -top-32 left-[15%] w-[420px] h-[950px] origin-top bg-gradient-to-b from-sky-400/20 via-sky-600/5 to-transparent blur-[75px] -rotate-12 pointer-events-none"
        />

        {/* Center-Right Batman Spotlight Beam */}
        <motion.div
          animate={{
            opacity: introStep >= 4 ? [0.35, 0.5, 0.35] : 0,
          }}
          transition={{
            opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -top-20 right-[28%] w-[500px] h-[900px] origin-top bg-gradient-to-b from-yellow-300/15 via-amber-500/5 to-transparent blur-[85px] rotate-6 pointer-events-none"
        />

        {/* Ambient Batcave Deep Blue Shadow Glow */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-sky-900/10 blur-[150px] rounded-full pointer-events-none" />
      </div>

      {/* Moving Specular Cursor Light Overlay across glossy LEGO plastic */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-20"
        style={{
          background: `radial-gradient(circle 380px at ${lightX} ${lightY}, rgba(255, 255, 255, 0.12), transparent 70%)`,
        }}
      />

      {/* Main Content Layout Grid */}
      <div className="relative z-30 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-24 pb-12 sm:py-24 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* LEFT COLUMN: Typography, Story & CTAs (Cols 1-6) */}
          <div className="lg:col-span-6 flex flex-col items-start z-30">
            
            {/* Collector Badge / Overline */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{
                opacity: introStep >= 5 ? 1 : 0,
                y: introStep >= 5 ? 0 : -12,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-2 mb-4 sm:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFD500] animate-ping" />
              <div className="px-3 py-1 rounded-full bg-[#FFD500]/10 border border-[#FFD500]/30 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FFD500] uppercase font-semibold flex items-center gap-2">
                <Shield className="w-3 h-3 text-[#FFD500]" />
                <span>OFFICIAL UCS COLLECTOR SERIES // 1989</span>
              </div>
            </motion.div>

            {/* Headline: “THE DARK KNIGHT. REBUILT IN LEGO.” */}
            <h1 className="font-display tracking-normal leading-[0.88] text-white text-5xl sm:text-7xl lg:text-8xl flex flex-col mb-4 sm:mb-6 uppercase">
              {/* Line 1: THE DARK KNIGHT. */}
              <div className="flex flex-wrap gap-x-3 sm:gap-x-4 overflow-hidden py-1">
                {headlineLine1.map((word, idx) => (
                  <motion.span
                    key={word}
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{
                      y: introStep >= 5 ? "0%" : "115%",
                      opacity: introStep >= 5 ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: idx * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.15)]"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              {/* Line 2: REBUILT IN LEGO. */}
              <div className="flex flex-wrap gap-x-3 sm:gap-x-4 overflow-hidden py-1">
                {headlineLine2.map((word, idx) => (
                  <motion.span
                    key={word}
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{
                      y: introStep >= 5 ? "0%" : "115%",
                      opacity: introStep >= 5 ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 0.35 + idx * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`inline-block ${
                      word === "LEGO."
                        ? "text-[#FFD500] drop-shadow-[0_0_30px_rgba(255,213,0,0.45)]"
                        : "text-zinc-300"
                    }`}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: introStep >= 6 ? 1 : 0,
                y: introStep >= 6 ? 0 : 15,
              }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-sans text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed mb-8 sm:mb-10 font-normal"
            >
              Step into Gotham. Explore the legend. Experience the Batmobile in a whole new dimension.
            </motion.p>

            {/* CTA Buttons Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: introStep >= 6 ? 1 : 0,
                y: introStep >= 6 ? 0 : 20,
              }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto"
            >
              {/* Primary CTA: ENTER GOTHAM */}
              <button
                onClick={() => {
                  playCinematicSound("pulse");
                  onEnterGothamClick();
                }}
                className="group relative px-8 py-4 rounded-xl bg-[#FFD500] hover:bg-[#FFE033] text-black font-mono font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(255,213,0,0.35)] hover:shadow-[0_0_40px_rgba(255,213,0,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer flex items-center justify-center gap-3 overflow-hidden"
              >
                {/* Subtle shine sweep */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                <span className="relative z-10 font-bold">ENTER GOTHAM</span>
                <ArrowRight className="w-4 h-4 text-black relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA: EXPLORE THE SET */}
              <button
                onClick={() => {
                  playCinematicSound("swoosh");
                  onExploreClick();
                }}
                onMouseEnter={() => {
                  setIsHoveringExplore(true);
                  playCinematicSound("light");
                }}
                onMouseLeave={() => setIsHoveringExplore(false)}
                className="group px-7 py-4 rounded-xl bg-transparent hover:bg-zinc-900/60 border border-zinc-700/80 hover:border-[#FFD500]/70 text-zinc-300 hover:text-white font-mono text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 backdrop-blur-sm"
              >
                <Eye className="w-4 h-4 text-zinc-400 group-hover:text-[#FFD500] transition-colors" />
                <span>EXPLORE THE SET</span>
              </button>
            </motion.div>

            {/* Quick Spec Metrics Pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: introStep >= 6 ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 sm:gap-8 pt-8 sm:pt-10 mt-6 sm:mt-8 border-t border-zinc-900 w-full max-w-lg"
            >
              <div>
                <div className="font-display text-2xl sm:text-3xl tracking-wider text-white">2,049</div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">BRICKS</div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl tracking-wider text-[#FFD500]">52 CM</div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">CHASSIS LENGTH</div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl tracking-wider text-white">DUAL COWL</div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">EXCLUSIVE MOLD</div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: LEGO Batman & Batmobile Composition (Cols 7-12) */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
            
            {/* Interactive 3D Perspective Wrapper */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                x: translateX,
                y: translateY,
                transformPerspective: 1200,
              }}
              animate={{
                scale: introStep >= 3 ? 1 : 0.94,
                opacity: introStep >= 3 ? 1 : 0,
              }}
              transition={{
                scale: { duration: 1.8, ease: "easeOut" },
                opacity: { duration: 1.4, ease: "easeOut" },
              }}
              className="relative w-full max-w-[680px] lg:max-w-[720px] aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center cursor-crosshair group"
            >
              {/* Seamless Pure Black Blending Image */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden transition-all duration-700">
                <Image
                  src="/batman-hero-seamless.webp"
                  alt="LEGO Batman and Batmobile in the Batcave"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center filter drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)] transition-all duration-500"
                />

                {/* Left gradient blend directly into pure black (#000000) */}
                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black via-black/60 to-transparent pointer-events-none" />
                {/* Top gradient blend into black */}
                <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black via-black/40 to-transparent pointer-events-none" />
                {/* Bottom gradient blend into black */}
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

                {/* DYNAMIC BATMOBILE HEADLIGHT FLARES (Flares when hovering Explore or toggled) */}
                <AnimatePresence>
                  {effectiveHeadlights && (
                    <>
                      {/* Left Headlight Lens Flare (aligned with Batmobile left fender) */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.35 }}
                        className="absolute bottom-[30%] left-[23%] pointer-events-none z-30"
                      >
                        <div className="w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 blur-[8px] animate-pulse" />
                        <div className="w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/40 blur-[20px]" />
                        {/* Horizontal anamorphic lens streak */}
                        <div className="w-48 h-1.5 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#FFD500] to-transparent blur-[1px]" />
                      </motion.div>

                      {/* Right Center Foglight Lens Flare */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.35 }}
                        className="absolute bottom-[28%] left-[34%] pointer-events-none z-30"
                      >
                        <div className="w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 blur-[7px] animate-pulse" />
                        <div className="w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/35 blur-[18px]" />
                        <div className="w-40 h-1.5 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#FFD500] to-transparent blur-[1px]" />
                      </motion.div>

                      {/* Cockpit HUD Blue Glow Flare */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.85 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute top-[42%] left-[62%] pointer-events-none z-30"
                      >
                        <div className="w-14 h-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/50 blur-[14px]" />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Subtle Interactive Inspection Callout on Batman */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: introStep >= 6 ? 1 : 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-4 right-4 z-30 hidden sm:flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 text-[10px] font-mono text-zinc-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD500]" />
                  <span>MOUSE PARALLAX ACTIVE // MOVE CURSOR</span>
                </motion.div>
              </div>

              {/* Headlight Quick Toggle Pill on Image */}
              <div className="absolute top-3 right-3 z-30">
                <button
                  onClick={onToggleHeadlights}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider border backdrop-blur-md transition-all cursor-pointer ${
                    effectiveHeadlights
                      ? "bg-[#FFD500]/20 text-[#FFD500] border-[#FFD500]/50 shadow-[0_0_15px_rgba(255,213,0,0.3)]"
                      : "bg-black/60 text-zinc-400 border-zinc-800 hover:text-white"
                  }`}
                >
                  HEADLIGHTS: {effectiveHeadlights ? "ON" : "OFF"}
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom Floating Control Bar (Replay Cinematic Intro / Telemetry) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: introStep >= 6 ? 1 : 0, y: introStep >= 6 ? 0 : 15 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-30 max-w-7xl w-full mx-auto px-4 sm:px-8 pb-6 flex items-center justify-between text-xs font-mono text-zinc-500"
      >
        <button
          onClick={replayCinematicIntro}
          className="flex items-center gap-2 hover:text-[#FFD500] transition-colors cursor-pointer group"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
          <span>REPLAY CINEMATIC INTRO</span>
        </button>

        <div className="hidden sm:flex items-center gap-4">
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400">100SVH PURE BLACK CANOPY</span>
          <span className="text-zinc-600">//</span>
          <span className="text-[#FFD500]">SYSTEM READY</span>
        </div>
      </motion.div>
    </section>
  );
}
