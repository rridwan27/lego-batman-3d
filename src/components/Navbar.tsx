"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, Menu, X, Lightbulb, Volume2, VolumeX } from "lucide-react";

interface NavbarProps {
  headlightsOn: boolean;
  onToggleHeadlights: () => void;
  onExploreClick: () => void;
  onEnterGothamClick: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function Navbar({
  headlightsOn,
  onToggleHeadlights,
  onExploreClick,
  onEnterGothamClick,
  soundEnabled,
  onToggleSound,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "THE LEGEND", href: "#hero" },
    { label: "EDITIONS", href: "#specs" },
    { label: "THE EXPERIENCE", onClick: onExploreClick },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      style={{
        paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
      className="fixed top-0 left-0 right-0 z-50 py-3 sm:py-5 transition-all duration-300 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand / Logo */}
        <a
          href="#hero"
          className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none"
        >
          {/* LEGO Brand Badge Style */}
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm bg-[#D11013] border border-red-500/80 shadow-lg shadow-red-950/40 flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="font-display text-white text-base sm:text-lg tracking-wider font-black italic drop-shadow-sm">
                LEGO
              </span>
            </div>
            {/* Bat-signal miniature accent */}
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-black border border-[#FFD500] flex items-center justify-center">
              <div className="w-2 h-1 bg-[#FFD500] rounded-full scale-75" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-2xl tracking-wider text-white group-hover:text-[#FFD500] transition-colors leading-none">
              BATMAN
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-zinc-500 group-hover:text-zinc-400">
              UCS COLLECTOR SERIES
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 bg-zinc-950/40 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/5 shadow-2xl">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                if (link.onClick) {
                  link.onClick();
                } else if (link.href) {
                  const target = document.querySelector(link.href);
                  target?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-xs font-mono tracking-widest text-zinc-400 hover:text-[#FFD500] transition-colors cursor-pointer uppercase relative py-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFD500] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Controls & Quick Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Headlights Interactive Toggle */}
          <button
            data-magnetic="true"
            onClick={onToggleHeadlights}
            title={headlightsOn ? "Turn Batmobile Headlights OFF" : "Turn Batmobile Headlights ON"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider border transition-all cursor-pointer will-change-transform ${
              headlightsOn
                ? "bg-[#FFD500]/15 text-[#FFD500] border-[#FFD500]/40 shadow-[0_0_15px_rgba(255,213,0,0.25)]"
                : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            <Lightbulb
              className={`w-3.5 h-3.5 transition-transform ${
                headlightsOn ? "text-[#FFD500] scale-110" : "text-zinc-500"
              }`}
            />
            <span>LIGHTS: {headlightsOn ? "ON" : "OFF"}</span>
          </button>

          {/* Sound Ambience Toggle */}
          <button
            data-magnetic="true"
            onClick={onToggleSound}
            title={soundEnabled ? "Mute audio cues" : "Enable sound cues"}
            className="w-9 h-9 rounded-full bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer will-change-transform"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#FFD500]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>

          {/* Direct CTA */}
          <button
            data-magnetic="true"
            onClick={onEnterGothamClick}
            className="bg-[#FFD500] hover:bg-[#FFE033] text-black text-xs font-mono font-bold tracking-wider px-4 py-2 rounded-full transition-transform active:scale-95 shadow-md shadow-[#FFD500]/20 cursor-pointer min-h-[38px] flex items-center will-change-transform"
          >
            ENTER GOTHAM
          </button>
        </div>

        {/* Mobile Hamburger Button - Apple HIG 44x44px minimum touch target */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          className="md:hidden w-11 h-11 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white active:scale-95 transition-transform touch-manipulation shadow-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 rounded-2xl bg-zinc-950/95 border border-zinc-800 backdrop-blur-2xl p-5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (link.onClick) {
                      link.onClick();
                    } else if (link.href) {
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-left font-display text-xl tracking-wider text-zinc-200 hover:text-[#FFD500] py-1 border-b border-zinc-900"
                >
                  {link.label}
                </button>
              ))}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onToggleHeadlights}
                  className="flex items-center gap-2 text-xs font-mono text-zinc-300"
                >
                  <Lightbulb className={`w-4 h-4 ${headlightsOn ? "text-[#FFD500]" : "text-zinc-600"}`} />
                  <span>Headlights: {headlightsOn ? "ACTIVE" : "STANDBY"}</span>
                </button>

                <button
                  onClick={onToggleSound}
                  className="flex items-center gap-2 text-xs font-mono text-zinc-300"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FFD500]" /> : <VolumeX className="w-4 h-4 text-zinc-600" />}
                  <span>Audio: {soundEnabled ? "ON" : "MUTED"}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnterGothamClick();
                }}
                className="w-full mt-2 bg-[#FFD500] text-black font-display text-lg tracking-wider py-2.5 rounded-xl shadow-lg shadow-[#FFD500]/20"
              >
                ENTER GOTHAM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
