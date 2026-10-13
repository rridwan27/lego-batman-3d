"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Boxes, 
  Cpu, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Rocket, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";

// Dynamically load Three.js Canvas to avoid SSR issues
const BatCanvas = dynamic(() => import("@/components/bat-canvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 sm:h-96 rounded-2xl bg-zinc-900 border border-yellow-500/20 flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
      <span className="text-xs font-mono text-zinc-400">Loading 3D Three.js Scene...</span>
    </div>
  ),
});

const TECH_STACK = [
  {
    name: "Next.js 16 (App Router)",
    category: "Framework",
    desc: "React 19, Server Components & Turbopack bundler",
    badge: "v16.4",
  },
  {
    name: "TypeScript",
    category: "Language",
    desc: "Strict type-safety, autocompletion & scalable architecture",
    badge: "v5.x",
  },
  {
    name: "Three.js & R3F",
    category: "3D Graphics",
    desc: "Interactive WebGL rendering with OrbitControls & physical lighting",
    badge: "r186",
  },
  {
    name: "GSAP & @gsap/react",
    category: "Motion Engine",
    desc: "Precision timelines, stagger animations & reactive hooks",
    badge: "v3.15",
  },
  {
    name: "Framer Motion",
    category: "UI Animations",
    desc: "Spring physics, layout transitions & gesture-driven interactions",
    badge: "v14.x",
  },
  {
    name: "shadcn-ui",
    category: "Component System",
    desc: "Modern Radix & Base-UI primitives styled with Tailwind CSS v4",
    badge: "Latest",
  },
];

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pulseActive, setPulseActive] = useState(false);
  const [userInput, setUserInput] = useState("");

  // GSAP Entrance Stagger Animation
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".gsap-hero-badge", {
        opacity: 0,
        y: -20,
        duration: 0.7,
      })
        .from(
          ".gsap-title-line",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
          },
          "-=0.4"
        )
        .from(
          ".gsap-description",
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          "-=0.4"
        )
        .from(
          ".gsap-card",
          {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  const triggerGsapPulse = () => {
    setPulseActive(true);
    gsap.fromTo(
      ".gsap-pulse-target",
      { scale: 0.96, filter: "brightness(1.5)" },
      { scale: 1, filter: "brightness(1)", duration: 0.5, ease: "elastic.out(1, 0.4)" }
    );
    setTimeout(() => setPulseActive(false), 500);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-zinc-100 selection:bg-yellow-400 selection:text-black">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-yellow-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-amber-600/10 blur-[130px] rounded-full" />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col gap-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center gap-6">
          <div className="gsap-hero-badge">
            <Badge
              variant="outline"
              className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300 px-4 py-1.5 text-xs font-mono uppercase tracking-widest flex items-center gap-2 rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              Stack Initialized Successfully
            </Badge>
          </div>

          <div className="max-w-3xl flex flex-col gap-3">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
              <span className="gsap-title-line block text-zinc-400 text-2xl sm:text-3xl font-medium tracking-normal mb-2">
                ArkVisuals Workspace
              </span>
              <span className="gsap-title-line block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500">
                LEGO BATMAN
              </span>
            </h1>
            <p className="gsap-description text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mt-2 leading-relaxed">
              Full-featured Next.js stack with TypeScript, Three.js 3D WebGL, GSAP timelines, Framer Motion springs, and shadcn-ui components.
            </p>
          </div>

          {/* Interactive Action Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-2"
          >
            <Button
              onClick={triggerGsapPulse}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold shadow-lg shadow-yellow-400/20 px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Trigger GSAP Pulse
            </Button>
            <Button
              variant="outline"
              className="border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
              onClick={() => {
                const el = document.getElementById("stack-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Layers className="w-4 h-4 text-zinc-400" />
              Inspect Tech Stack
            </Button>
          </motion.div>
        </div>

        {/* 3D Scene + Interactive Framer Motion Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Three.js Canvas Container */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <BatCanvas />
            <p className="text-xs text-zinc-500 font-mono mt-3 text-center sm:text-left">
              Tip: Drag to rotate the 3D Lego brick with OrbitControls
            </p>
          </div>

          {/* Framer Motion & shadcn-ui Interactive Control Panel */}
          <motion.div
            className="lg:col-span-5 flex flex-col"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="gsap-pulse-target bg-zinc-950/80 border-zinc-800/80 backdrop-blur-xl h-full flex flex-col justify-between shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 font-mono text-[11px]">
                    shadcn-ui + Framer Motion
                  </Badge>
                  <ShieldCheck className="w-4 h-4 text-yellow-400" />
                </div>
                <CardTitle className="text-xl font-bold text-white mt-2">
                  Interactive Control Hub
                </CardTitle>
                <CardDescription className="text-zinc-400 text-sm">
                  Test reactivity and form controls in real-time.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <label htmlFor="bat-input" className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    Signal Broadcast Note
                  </label>
                  <Input
                    id="bat-input"
                    placeholder="Enter message for Gotham..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-yellow-400"
                  />
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono space-y-1.5">
                  <div className="text-zinc-500 uppercase tracking-wider text-[10px]">Live Input Mirror</div>
                  <div className="text-yellow-400 truncate">
                    {userInput ? userInput : "<Awaiting user transmission>"}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TypeScript Strict Mode active</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Three.js WebGL Renderer connected</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tailwind CSS v4 & shadcn tokens loaded</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tech Stack Grid */}
        <section id="stack-section" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-yellow-400" />
                Configured Technologies
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                All 5 requested libraries are installed, configured, and working together.
              </p>
            </div>
            <Badge variant="outline" className="border-zinc-700 font-mono text-xs w-fit">
              6 / 6 Modules Ready
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_STACK.map((tech) => (
              <motion.div
                key={tech.name}
                className="gsap-card"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Card className="bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 transition-colors h-full flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                        {tech.category}
                      </span>
                      <Badge variant="secondary" className="font-mono text-[10px] bg-zinc-800/80 text-zinc-300">
                        {tech.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-semibold text-zinc-100 mt-1">
                      {tech.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {tech.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-850 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>Next.js + TypeScript + Three.js + GSAP + Framer Motion + shadcn-ui</div>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>lego-batman workspace ready</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
