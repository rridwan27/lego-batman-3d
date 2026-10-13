"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { animate, stagger } from "animejs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Eye,
  Check,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  X,
  Layers,
  Award,
  Zap,
  Info,
} from "lucide-react";
import { soundEngine } from "@/components/cinematic/SoundManager";

export interface BatmanProduct {
  id: string;
  name: string;
  actor: string;
  era: string;
  year: number;
  price: string;
  priceNumber: number;
  badge: string;
  themeColor: string;
  accentBg: string;
  image: string;
  imageWebp: string;
  director: string;
  tagline: string;
  desc: string;
  stats: {
    pieces: string;
    scale: string;
    dimensions: string;
    vehicle: string;
  };
  features: string[];
  boxContents: string[];
}

export const PRODUCTS: BatmanProduct[] = [
  {
    id: "keaton-1989",
    name: "THE 1989 GOTHIC LEGEND",
    actor: "MICHAEL KEATON",
    era: "1989 GOTHIC ERA",
    year: 1989,
    price: "$1,989",
    priceNumber: 1989,
    badge: "UCS ARCHIVE // #01",
    themeColor: "#FFD500",
    accentBg: "rgba(255, 213, 0, 0.12)",
    image: "/Keaton.jpg",
    imageWebp: "/Keaton.webp",
    director: "TIM BURTON // GOTHIC NOIR",
    tagline: "The definitive gothic vigilante that redefined the Dark Knight forever.",
    desc: "Faithfully modeled after Tim Burton's legendary 1989 film. Features the iconic all-black rubberized cowl and cape mold, the classic yellow-oval chest insignia, and the turbine-powered 1989 Batmobile flanked by gothic gargoyles on wet Gotham cobblestones.",
    stats: {
      pieces: "2,363 PCS",
      scale: "1:10 MASTER SCALE",
      dimensions: "60cm × 24cm × 18cm",
      vehicle: "1989 TURBO COUPE",
    },
    features: [
      "Exclusive 1989 Michael Keaton Minifigure with yellow oval insignia",
      "Seamless dual-molded cowl & draped rubberized bat-cape",
      "Turbine-intake Batmobile with opening slide canopy and pop-up guns",
      "Rain-slicked studded Gotham cobblestone base with cathedral spires",
    ],
    boxContents: [
      "1x Michael Keaton LEGO Minifigure",
      "1x 1989 Sculpted UCS Batmobile Chassis",
      "1x Gothic Cathedral & Street Display Plaque",
      "1x Laser-Etched Collector Certificate of Authenticity",
      "2x Dual Batarangs & Grapple Speargun Accessories",
    ],
  },
  {
    id: "bale-2005",
    name: "THE DARK KNIGHT TACTICAL",
    actor: "CHRISTIAN BALE",
    era: "2005 TRILOGY ERA",
    year: 2005,
    price: "$2,005",
    priceNumber: 2005,
    badge: "UCS ARCHIVE // #02",
    themeColor: "#00E5FF",
    accentBg: "rgba(0, 229, 255, 0.12)",
    image: "/Bale.jpg",
    imageWebp: "/Bale.webp",
    director: "CHRISTOPHER NOLAN // TACTICAL REALISM",
    tagline: "Groundbreaking military-grade Kevlar armor engineered for urban warfare.",
    desc: "Capturing Christopher Nolan's legendary Dark Knight trilogy with hyper-realistic tactical detail. Features segmented ballistic chest plates, dark bronze utility belt, memory-cloth cape weave, and a rainy Gotham alleyway staging with authentic brick fire escapes.",
    stats: {
      pieces: "2,049 PCS",
      scale: "1:10 TACTICAL SPEC",
      dimensions: "56cm × 22cm × 16cm",
      vehicle: "TUMBLER TACTICAL TANK",
    },
    features: [
      "Exclusive Christian Bale Minifigure with segmented ballistic weave",
      "Custom memory-cloth cape that flows dynamically in display",
      "Tactical bronze multi-pouch utility belt with micro-detailing",
      "Urban alleyway display with modular brick fire escape & streetlamp",
    ],
    boxContents: [
      "1x Christian Bale Tactical Minifigure",
      "1x Memory-Cloth Flowing Bat-Cape Assembly",
      "1x Gotham Alleyway Modular Brick Platform",
      "1x Laser-Etched Collector Certificate of Authenticity",
      "3x Pneumatic Batarangs & EMP Blaster Rig",
    ],
  },
  {
    id: "ben-2016",
    name: "THE ARMORED TITAN",
    actor: "BEN AFFLECK",
    era: "2016 DAWN OF JUSTICE",
    year: 2016,
    price: "$2,016",
    priceNumber: 2016,
    badge: "UCS ARCHIVE // #03",
    themeColor: "#FF4500",
    accentBg: "rgba(255, 69, 0, 0.12)",
    image: "/Ben.jpg",
    imageWebp: "/Ben.webp",
    director: "ZACK SNYDER // HEAVY MECH TITAN",
    tagline: "The battle-hardened mechanoid exoskeleton forged to confront gods.",
    desc: "Inspired by Zack Snyder's brutal, heavyweight Dark Knight. Features reinforced mechanized shoulder plating, scuffed metallic chest battle-damage, a working rooftop Bat-Signal projector with illuminated beam, and the high-caliber armored urban Batmobile.",
    stats: {
      pieces: "2,548 PCS",
      scale: "1:10 HEAVY ARMOR",
      dimensions: "64cm × 26cm × 20cm",
      vehicle: "BvS HEAVY ARTILLERY RIG",
    },
    features: [
      "Exclusive Ben Affleck Armored Minifigure with battle-damage weathering",
      "Heavy reinforced exoskeleton shoulder pauldrons & broad bat-cowl",
      "Working LED illuminated rooftop Bat-Signal spotlight assembly",
      "Rooftop parapet base with stone gargoyle & storm lightning staging",
    ],
    boxContents: [
      "1x Ben Affleck Armored Exoskeleton Minifigure",
      "1x Working Bat-Signal Projector Unit (LED Included)",
      "1x High-Caliber Rooftop Gargoyle Parapet Base",
      "1x Laser-Etched Collector Certificate of Authenticity",
      "1x Kryptonite Grenade Launcher & Heavy Batarangs",
    ],
  },
];

interface ProductSectionProps {
  onExploreClick?: () => void;
}

export default function ProductSection({ onExploreClick }: ProductSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [inspectProduct, setInspectProduct] = useState<BatmanProduct | null>(null);
  const [vaultCart, setVaultCart] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProducts =
    selectedFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.id === selectedFilter);

  const handleAcquire = (product: BatmanProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playReassemblyLock();
    setVaultCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
    setToastMessage(`RESERVED IN BATCAVE VAULT: ${product.name} (${product.price})`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleInspect = (product: BatmanProduct) => {
    soundEngine.playLegoClick();
    setInspectProduct(product);
  };

  const totalReserved = Object.values(vaultCart).reduce((a, b) => a + b, 0);

  // Soothing organic ambient micro-animations powered by Anime.js
  useEffect(() => {
    animate(".anime-badge-pulse", {
      opacity: [0.8, 1],
      scale: [0.98, 1.02],
      delay: stagger(160),
      duration: 3400,
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });

    animate(".anime-price-glow", {
      filter: [
        "drop-shadow(0 0 4px rgba(255, 213, 0, 0.35))",
        "drop-shadow(0 0 16px rgba(255, 213, 0, 0.75))",
        "drop-shadow(0 0 4px rgba(255, 213, 0, 0.35))",
      ],
      duration: 3800,
      alternate: true,
      loop: true,
      ease: "inOutQuad",
    });
  }, []);

  return (
    <section
      id="specs"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingBottom: "max(6rem, calc(env(safe-area-inset-bottom) + 5rem))",
      }}
      className="relative bg-black text-white py-16 sm:py-24 border-t border-zinc-900 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#FFD500]/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-red-600/5 blur-[220px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-14 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/80 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD500] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFD500] font-semibold">
                BATCAVE VAULT // UCS TRINITY COLLECTOR ARCHIVE
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none">
              THE CINEMATIC <span className="text-[#FFD500]">BATMAN</span> EDITIONS
            </h2>
          </div>

          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
            Three iconic eras. Three monumental Dark Knights. Each edition is engineered
            with authentic LEGO precision, certified collector plaques, and movie-accurate display staging.
          </p>
        </div>

        {/* Filter Navigation & Vault Status Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Era Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => {
                soundEngine.playLegoClick();
                setSelectedFilter("all");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[44px] flex items-center gap-2 border ${
                selectedFilter === "all"
                  ? "bg-[#FFD500] text-black font-bold border-[#FFD500] shadow-[0_0_20px_rgba(255,213,0,0.3)]"
                  : "bg-zinc-950/70 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
              }`}
            >
              <span>ALL EDITIONS</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  selectedFilter === "all" ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-300"
                }`}
              >
                3
              </span>
            </button>

            {PRODUCTS.map((prod) => {
              const active = selectedFilter === prod.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => {
                    soundEngine.playLegoClick();
                    setSelectedFilter(prod.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[44px] flex items-center gap-2 border ${
                    active
                      ? "bg-[#FFD500] text-black font-bold border-[#FFD500] shadow-[0_0_20px_rgba(255,213,0,0.3)]"
                      : "bg-zinc-950/70 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  <span>{prod.year} {prod.actor.split(" ")[1]}</span>
                  <span
                    className={`text-[10px] font-bold ${
                      active ? "text-black" : "text-[#FFD500]"
                    }`}
                  >
                    {prod.price}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Reserved Vault Status Indicator */}
          {totalReserved > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-[#FFD500]/40 flex items-center justify-between sm:justify-start gap-3 text-xs font-mono text-[#FFD500]"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FFD500]" />
                <span>VAULT RESERVATION:</span>
                <span className="font-bold text-white">{totalReserved} ITEM{totalReserved > 1 ? "S" : ""}</span>
              </div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest hidden sm:inline">
                READY FOR DISPATCH
              </span>
            </motion.div>
          )}
        </div>

        {/* Responsive Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const isReserved = (vaultCart[product.id] || 0) > 0;
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group relative bg-zinc-950/90 rounded-2xl border border-white/10 hover:border-[#FFD500]/60 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-2xl hover:shadow-[0_0_45px_rgba(255,213,0,0.15)]"
              >
                {/* Top Image Preview Container */}
                <div
                  onClick={() => handleInspect(product)}
                  className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-zinc-950 cursor-pointer"
                >
                  {/* High Quality Responsive Image */}
                  <Image
                    src={product.image}
                    alt={`${product.name} - LEGO Batman Minifigure`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                  />

                  {/* Gradient Overlays for Readability & Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/60 pointer-events-none" />

                  {/* Floating Badges Header */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                    <span className="anime-badge-pulse px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-white uppercase font-medium">
                      {product.era}
                    </span>
                    <span
                      className="anime-badge-pulse px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border text-[10px] font-mono tracking-widest font-bold uppercase"
                      style={{
                        borderColor: product.themeColor,
                        color: product.themeColor,
                      }}
                    >
                      {product.badge}
                    </span>
                  </div>

                  {/* Hover Quick Inspect Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] pointer-events-none">
                    <div className="px-4 py-2 rounded-xl bg-black/90 border border-[#FFD500] text-[#FFD500] text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-4 h-4 text-[#FFD500]" />
                      <span>INSPECT ARCHIVE</span>
                    </div>
                  </div>

                  {/* Image Bottom Info Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 pointer-events-none z-10">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#FFD500] uppercase font-bold block mb-1">
                      {product.director}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-white leading-none drop-shadow-md group-hover:text-[#FFD500] transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-5 sm:p-6 flex flex-col gap-5 flex-1 justify-between bg-zinc-950/95">
                  <div className="flex flex-col gap-4">
                    {/* Tagline / Narrative */}
                    <p className="font-sans text-xs text-zinc-400 leading-relaxed font-normal">
                      {product.desc}
                    </p>

                    {/* Technical Specs Pill Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">
                      <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                          PIECE COUNT
                        </span>
                        <span className="font-mono text-xs font-bold text-white">
                          {product.stats.pieces}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                          SCALE
                        </span>
                        <span className="font-mono text-xs font-bold text-white">
                          {product.stats.scale}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex flex-col col-span-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                          VEHICLE INCLUSION
                        </span>
                        <span className="font-mono text-xs font-bold text-[#FFD500]">
                          {product.stats.vehicle}
                        </span>
                      </div>
                    </div>

                    {/* Key Features Bullet List */}
                    <ul className="flex flex-col gap-1.5 pt-1">
                      {product.features.slice(0, 3).map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-[11px] text-zinc-300 font-sans leading-tight"
                        >
                          <Check className="w-3.5 h-3.5 text-[#FFD500] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-4 border-t border-zinc-900 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                          OFFICIAL UCS PRICE
                        </span>
                        <span className="anime-price-glow font-display text-3xl sm:text-4xl text-[#FFD500] tracking-tight leading-none drop-shadow-[0_0_15px_rgba(255,213,0,0.4)]">
                          {product.price}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        FREE INSURED FREIGHT
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Inspect Archive Button */}
                      <button
                        data-magnetic="true"
                        onClick={() => handleInspect(product)}
                        className="w-full py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 text-zinc-200 text-xs font-mono font-medium tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] will-change-transform"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-400" />
                        <span>INSPECT</span>
                      </button>

                      {/* Acquire Vault Edition Button */}
                      <button
                        data-magnetic="true"
                        onClick={(e) => handleAcquire(product, e)}
                        className="group relative w-full py-3 px-3 rounded-xl bg-[#FFD500] hover:bg-[#FFE033] text-black text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(255,213,0,0.25)] hover:shadow-[0_0_30px_rgba(255,213,0,0.5)] cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] will-change-transform"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-black" />
                        <span>{isReserved ? "ACQUIRE +" : "ACQUIRE"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFD500]/10 border border-[#FFD500]/30 flex items-center justify-center text-[#FFD500] shrink-0">
              <Shield className="w-6 h-6 text-[#FFD500]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg sm:text-xl text-white uppercase tracking-wider">
                OFFICIAL LEGO® DC CERTIFIED ARCHIVE GUARANTEE
              </span>
              <span className="font-sans text-xs text-zinc-400">
                Every collector edition includes a serialized metallic placard, pristine collector packaging, and tamper-evident authentication seals.
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onExploreClick) onExploreClick();
              soundEngine.playLegoClick();
            }}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#FFD500] text-zinc-200 hover:text-white text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer min-h-[44px]"
          >
            <span>EXPLORE BLUEPRINT ARCHIVES</span>
            <ArrowRight className="w-4 h-4 text-[#FFD500]" />
          </button>
        </div>
      </div>

      {/* Interactive Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 rounded-2xl bg-zinc-950/95 border border-[#FFD500] shadow-[0_0_35px_rgba(255,213,0,0.35)] backdrop-blur-xl flex items-center gap-3 text-white max-w-md w-[90%]"
          >
            <div className="w-8 h-8 rounded-full bg-[#FFD500] flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-black" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-mono text-[10px] text-[#FFD500] tracking-widest uppercase font-bold">
                BATCAVE VAULT UPDATE
              </span>
              <span className="font-sans text-xs text-white truncate font-medium">
                {toastMessage}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Lightbox Inspector Modal */}
      <AnimatePresence>
        {inspectProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                soundEngine.playLegoClick();
                setInspectProduct(null);
              }}
              className="fixed inset-0 bg-black/92 backdrop-blur-2xl"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl z-10 flex flex-col scrollbar-thin scrollbar-thumb-zinc-700"
            >
              {/* Modal Top Nav */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: inspectProduct.themeColor }}
                  />
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                    ARCHIVE INSPECTION // {inspectProduct.badge}
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playLegoClick();
                    setInspectProduct(null);
                  }}
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[44px]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-8">
                {/* Left: High-Res Full Image View */}
                <div className="relative aspect-[9/16] max-h-[580px] w-full rounded-xl overflow-hidden bg-black border border-zinc-800">
                  <Image
                    src={inspectProduct.image}
                    alt={inspectProduct.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <span className="font-mono text-xs text-[#FFD500] uppercase tracking-widest block mb-1">
                      {inspectProduct.actor}
                    </span>
                    <span className="font-display text-2xl text-white uppercase tracking-wider block">
                      {inspectProduct.name}
                    </span>
                  </div>
                </div>

                {/* Right: Technical Specification Breakdown */}
                <div className="flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-5">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-widest text-[#FFD500] block mb-1">
                        {inspectProduct.era} • {inspectProduct.director}
                      </span>
                      <h3 className="font-display text-3xl sm:text-4xl text-white uppercase leading-none tracking-tight">
                        {inspectProduct.name}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-2.5 leading-relaxed">
                        {inspectProduct.desc}
                      </p>
                    </div>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                      <div>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase">PIECES</span>
                        <p className="font-mono text-sm font-bold text-white">{inspectProduct.stats.pieces}</p>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase">SCALE</span>
                        <p className="font-mono text-sm font-bold text-white">{inspectProduct.stats.scale}</p>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase">DIMENSIONS</span>
                        <p className="font-mono text-sm font-bold text-white">{inspectProduct.stats.dimensions}</p>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase">ACCOMPANIMENT</span>
                        <p className="font-mono text-sm font-bold text-[#FFD500]">{inspectProduct.stats.vehicle}</p>
                      </div>
                    </div>

                    {/* What's in the Box */}
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-300 mb-2.5 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[#FFD500]" />
                        <span>COLLECTOR ARCHIVE CONTENTS</span>
                      </h4>
                      <ul className="flex flex-col gap-2">
                        {inspectProduct.boxContents.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD500]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        TOTAL VAULT PRICE
                      </span>
                      <span className="font-display text-4xl text-[#FFD500] leading-none drop-shadow-[0_0_20px_rgba(255,213,0,0.4)]">
                        {inspectProduct.price}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        handleAcquire(inspectProduct);
                        setInspectProduct(null);
                      }}
                      className="px-8 py-4 rounded-xl bg-[#FFD500] hover:bg-[#FFE033] text-black text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(255,213,0,0.4)] active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <ShoppingBag className="w-4 h-4 text-black" />
                      <span>SECURE VAULT PRE-ORDER</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
