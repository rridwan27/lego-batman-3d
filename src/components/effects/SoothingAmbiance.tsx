"use client";

import React, { useEffect, useRef } from "react";
import { animate, random, stagger } from "animejs";

export default function SoothingAmbiance() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Soothing organic breathing animations for ambient light orbs
    if (orb1Ref.current) {
      animate(orb1Ref.current, {
        translateX: [-50, 50],
        translateY: [-30, 40],
        scale: [0.9, 1.2],
        opacity: [0.04, 0.09],
        duration: 10000,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    }

    if (orb2Ref.current) {
      animate(orb2Ref.current, {
        translateX: [40, -40],
        translateY: [30, -50],
        scale: [1.1, 0.85],
        opacity: [0.03, 0.08],
        duration: 12000,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    }

    if (orb3Ref.current) {
      animate(orb3Ref.current, {
        scale: [0.95, 1.1],
        opacity: [0.02, 0.06],
        duration: 8000,
        alternate: true,
        loop: true,
        ease: "inOutQuad",
      });
    }

    // 2. Soothing floating dust motes drifting across the atmosphere
    if (particlesRef.current) {
      const particleEls = particlesRef.current.children;
      animate(particleEls, {
        translateY: () => [random(0, 100), random(-150, -350)],
        translateX: () => [random(-25, 25), random(-60, 60)],
        opacity: [
          { to: () => random(0.15, 0.45), duration: 2500 },
          { to: 0, duration: 2500 },
        ],
        scale: () => [random(0.6, 1.0), random(1.1, 1.6)],
        delay: stagger(280, { start: 200 }),
        duration: () => random(7000, 11000),
        loop: true,
        ease: "inOutSine",
      });
    }

    // 3. Soothing Magnetic Button Physics with Anime.js
    const handleMouseMove = (e: MouseEvent) => {
      const magneticButtons = document.querySelectorAll<HTMLElement>("[data-magnetic='true']");
      magneticButtons.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        const magnetRadius = 80;
        if (dist < magnetRadius) {
          const deltaX = (e.clientX - centerX) * 0.28;
          const deltaY = (e.clientY - centerY) * 0.28;

          animate(btn, {
            translateX: deltaX,
            translateY: deltaY,
            duration: 350,
            ease: "outQuad",
          });
        } else {
          // Spring back smoothly to rest
          if (btn.style.transform && btn.style.transform !== "none") {
            animate(btn, {
              translateX: 0,
              translateY: 0,
              duration: 700,
              ease: "outElastic(1, .6)",
            });
          }
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Generate 24 delicate floating motes
  const particles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    left: `${(i * 4.1 + 3) % 96}%`,
    top: `${(i * 7.3 + 12) % 85}%`,
    isGold: i % 3 === 0,
    size: (i % 3) + 2,
  }));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Soothing Ambient Radial Light Orbs */}
      <div
        ref={orb1Ref}
        className="absolute top-1/6 left-1/5 w-[650px] h-[650px] rounded-full bg-[#FFD500] blur-[190px] opacity-5 will-change-transform"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-1/5 right-1/4 w-[750px] h-[750px] rounded-full bg-[#00E5FF] blur-[220px] opacity-4 will-change-transform"
      />
      <div
        ref={orb3Ref}
        className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-amber-600 blur-[240px] opacity-3 will-change-transform"
      />

      {/* Floating Gentle Dust Particles */}
      <div ref={particlesRef} className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.isGold ? "#FFD500" : "#E2E8F0",
              boxShadow: p.isGold
                ? "0 0 10px rgba(255, 213, 0, 0.6)"
                : "0 0 8px rgba(226, 232, 240, 0.4)",
            }}
            className="absolute rounded-full opacity-0 will-change-transform"
          />
        ))}
      </div>
    </div>
  );
}
