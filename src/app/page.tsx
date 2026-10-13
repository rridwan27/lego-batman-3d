"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import ExplosionExperience from "@/components/cinematic/ExplosionExperience";
import SetModal from "@/components/SetModal";
import ProductSection from "@/components/ProductSection";
import BatmanCtaSection from "@/components/cta/BatmanCtaSection";
import SoothingAmbiance from "@/components/effects/SoothingAmbiance";
import { soundEngine } from "@/components/cinematic/SoundManager";

export default function Home() {
  const [headlightsOn, setHeadlightsOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleToggleHeadlights = () => {
    setHeadlightsOn((prev) => !prev);
    soundEngine.playLegoClick();
  };

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundEngine.setEnabled(nextVal);
    if (nextVal) {
      soundEngine.playLegoClick();
    }
  };

  const handleExploreClick = () => {
    setIsModalOpen(true);
    soundEngine.playLegoClick();
  };

  const handleEnterGothamClick = () => {
    soundEngine.playExplosionWhoosh();
    const specsEl = document.getElementById("specs");
    if (specsEl) {
      specsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#FFD500] selection:text-black">
      {/* Soothing Atmospheric Anime.js Ambient Effects */}
      <SoothingAmbiance />

      {/* Persistent Minimal Navbar */}
      <Navbar
        headlightsOn={headlightsOn}
        onToggleHeadlights={handleToggleHeadlights}
        onExploreClick={handleExploreClick}
        onEnterGothamClick={handleEnterGothamClick}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* The Cinematic Scroll-Driven 3D & Explosion Experience */}
      <ExplosionExperience
        onEnterGotham={handleEnterGothamClick}
        onExploreSet={handleExploreClick}
      />

      {/* Responsive Cinematic Product Editions Section */}
      <ProductSection onExploreClick={handleExploreClick} />

      {/* 3D Minifigure Interactive CTA Section */}
      <BatmanCtaSection onExploreClick={handleExploreClick} />

      {/* "Explore the Set" Modal Archive */}
      <SetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
