"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Layers,
  Box,
  Compass,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Shield,
  Eye,
  Film,
} from "lucide-react";
import CanvasScrubber from "./CanvasScrubber";
import TechnicalCallouts from "./TechnicalCallouts";
import CinematicText from "./CinematicText";
import ScrollProgressIndicator from "./ScrollProgressIndicator";
import { soundEngine } from "./SoundManager";

// Dynamically load Three.js 3D Scene
const Batman3DScene = dynamic(() => import("./Batman3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-zinc-800 border-t-[#FFD500] rounded-full animate-spin" />
    </div>
  ),
});

interface ExplosionExperienceProps {
  onEnterGotham?: () => void;
  onExploreSet?: () => void;
}

export default function ExplosionExperience({
  onEnterGotham,
  onExploreSet,
}: ExplosionExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentScene, setCurrentScene] = useState(1);
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [renderMode, setRenderMode] = useState<"footage" | "3d">("footage");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastSceneRef = useRef(1);

  // Compute scene & explosion progress from scrollProgress (0..1)
  const calculateSceneState = useCallback((progress: number) => {
    let scene = 1;
    let ep = 0;

    if (progress < 0.18) {
      scene = 1;
      ep = 0;
    } else if (progress < 0.38) {
      scene = 2;
      ep = 0;
    } else if (progress < 0.58) {
      scene = 3;
      // Ramp explosion from 0.0 to 0.85
      ep = (progress - 0.38) / 0.2;
    } else if (progress < 0.75) {
      scene = 4;
      // Fully exploded technical view
      ep = 0.85 + ((progress - 0.58) / 0.17) * 0.15;
    } else if (progress < 0.88) {
      scene = 5;
      // Detail view
      ep = 1.0;
    } else {
      scene = 6;
      // Reassembly: collapses from 1.0 back to 0.0
      ep = Math.max(0, 1.0 - (progress - 0.88) / 0.12);
    }

    setCurrentScene(scene);
    setExplosionProgress(ep);

    // Audio cue transitions
    if (scene !== lastSceneRef.current) {
      if (scene === 3 && lastSceneRef.current < 3) {
        soundEngine.playExplosionWhoosh();
      } else if (scene === 4) {
        soundEngine.playLegoClick();
      } else if (scene === 6 && lastSceneRef.current < 6) {
        soundEngine.playReassemblyLock();
      } else {
        soundEngine.playAtmosphere();
      }
      lastSceneRef.current = scene;
    }
  }, []);

  // Listen to window scroll over container with RAF debouncing
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const totalScrollable = containerRef.current.scrollHeight - window.innerHeight;

            if (totalScrollable > 0) {
              const scrolled = -rect.top;
              const progress = Math.min(1, Math.max(0, scrolled / totalScrollable));

              setScrollProgress(progress);
              calculateSceneState(progress);

              if (scrolled > 50 && !hasScrolled) {
                setHasScrolled(true);
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [calculateSceneState, hasScrolled]);

  // Pointer movement for 3D parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setPointer({ x, y });
  };

  // Jump to scene
  const handleJumpToScene = (sceneNum: number) => {
    if (!containerRef.current) return;
    const scenePcts: Record<number, number> = {
      1: 0.05,
      2: 0.25,
      3: 0.45,
      4: 0.65,
      5: 0.80,
      6: 0.95,
    };
    const targetPct = scenePcts[sceneNum] || 0;
    const totalScrollable = containerRef.current.scrollHeight - window.innerHeight;
    const targetY = containerRef.current.offsetTop + targetPct * totalScrollable;

    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundEngine.setEnabled(nextVal);
    if (nextVal) {
      soundEngine.playLegoClick();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-black text-white"
      style={{ height: "650vh" }} // Continuous scroll track
    >
      {/* Sticky Fullscreen Cinematic Viewport (100dvh for iOS dynamic address bar) */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] min-h-[100vh] overflow-hidden bg-black flex items-center justify-center touch-pan-y">
        
        {/* Render Viewport: Either Cinematic Footage or Real-Time Three.js */}
        <div className="absolute inset-0 z-0">
          {renderMode === "footage" ? (
            <>
              {/* Mobile Phone Hero Background: fills the top and bottom void at first in Scene 1 */}
              <div
                className="md:hidden absolute inset-0 z-[1] pointer-events-none transition-opacity duration-700 ease-out"
                style={{
                  opacity: scrollProgress < 0.16 ? Math.max(0, 1 - scrollProgress / 0.12) : 0,
                  visibility: scrollProgress < 0.16 ? "visible" : "hidden",
                }}
              >
                <Image
                  src="/lego-batman-hangar-mobile.webp"
                  alt="LEGO Batman in the Batcave Hangar"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>

              <CanvasScrubber progress={scrollProgress} />
            </>
          ) : (
            <Batman3DScene
              explosionProgress={explosionProgress}
              pointer={pointer}
              currentScene={currentScene}
            />
          )}
        </div>

        {/* Floating Batcave Atmospheric Dust & Light Overlays */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
        </div>

        {/* Technical Callouts Layer (Visible in Scene 4: Exploded Technical View) */}
        <TechnicalCallouts visible={currentScene === 4} activeScene={currentScene} />

        {/* Advanced Masked Cinematic Typography */}
        <CinematicText
          currentScene={currentScene}
          onEnterGotham={onEnterGotham}
          onExploreSet={onExploreSet}
        />

        {/* Scroll Progress Indicator & Scene Rail */}
        <ScrollProgressIndicator
          progress={scrollProgress}
          currentScene={currentScene}
          onJumpToScene={handleJumpToScene}
        />

        {/* Top Control Header Toolbar with iOS Safe Area support */}
        <div
          style={{
            top: "max(4.5rem, calc(env(safe-area-inset-top) + 3.75rem))",
            left: "max(1rem, env(safe-area-inset-left))",
          }}
          className="fixed z-40 flex items-center gap-2"
        >
          {/* Engine Mode Switcher: Footage vs 3D Interactive */}
          <div className="flex items-center bg-zinc-950/85 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-xl">
            <button
              onClick={() => {
                setRenderMode("footage");
                soundEngine.playLegoClick();
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                renderMode === "footage"
                  ? "bg-[#FFD500] text-black font-bold shadow-md shadow-[#FFD500]/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Film className="w-3 h-3" />
              <span>FOOTAGE</span>
            </button>

            <button
              onClick={() => {
                setRenderMode("3d");
                soundEngine.playLegoClick();
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                renderMode === "3d"
                  ? "bg-[#FFD500] text-black font-bold shadow-md shadow-[#FFD500]/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Box className="w-3 h-3" />
              <span>3D MODEL</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
            className="w-8 h-8 rounded-full bg-zinc-950/85 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer shadow-lg active:scale-95"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#FFD500]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>
        </div>

        {/* First-Load Scroll Prompt Hint */}
        <AnimatePresence>
          {!hasScrolled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                bottom: "max(2rem, calc(env(safe-area-inset-bottom) + 1.25rem))",
              }}
              className="absolute left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none select-none"
            >
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-zinc-400 uppercase">
                SCROLL TO DECONSTRUCT
              </span>
              <div className="w-5 h-9 sm:w-6 sm:h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-1.5">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="w-1.5 h-2 rounded-full bg-[#FFD500]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Status Telemetry Pill */}
        <div
          style={{
            bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))",
            left: "max(1rem, env(safe-area-inset-left))",
          }}
          className="absolute z-30 hidden sm:flex items-center gap-3 font-mono text-[9px] text-zinc-500 pointer-events-none"
        >
          <span className="text-zinc-600">//</span>
          <span>CHOREOGRAPHY: 6 SCENES</span>
          <span className="text-zinc-600">//</span>
          <span className="text-[#FFD500]">
            EXPLOSION DELTA: {Math.round(explosionProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
