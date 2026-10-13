"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

const TOTAL_FRAMES = 300;

interface CanvasScrubberProps {
  progress: number; // 0.0 to 1.0
  onLoaded?: () => void;
}

export default function CanvasScrubber({ progress, onLoaded }: CanvasScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedCountRef = useRef(0);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  // Smooth LERP momentum state
  const targetProgressRef = useRef(progress);
  const currentProgressRef = useRef(progress);
  const lastDrawnFrameRef = useRef(-1);
  const currentFrameRef = useRef(0);

  // Update target progress as user scrolls
  useEffect(() => {
    targetProgressRef.current = progress;
  }, [progress]);

  // Reusable draw logic with 16:9 aspect ratio, high-quality anti-aliasing and subtle vignette
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Enable high-quality anti-aliasing / subpixel filtering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Find requested frame or nearest loaded frame
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = frameIndex - offset;
        if (
          prev >= 0 &&
          imagesRef.current[prev]?.complete &&
          (imagesRef.current[prev]?.naturalWidth ?? 0) > 0
        ) {
          img = imagesRef.current[prev];
          break;
        }
        const next = frameIndex + offset;
        if (
          next < TOTAL_FRAMES &&
          imagesRef.current[next]?.complete &&
          (imagesRef.current[next]?.naturalWidth ?? 0) > 0
        ) {
          img = imagesRef.current[next];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cWidth = canvas.width;
    const cHeight = canvas.height;
    if (cWidth === 0 || cHeight === 0) return;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = cWidth / cHeight;

    let renderW: number;
    let renderH: number;
    let offsetX: number;
    let offsetY: number;

    const isMobile =
      typeof window !== "undefined"
        ? window.innerWidth < 768 || canvasAspect < 1.05
        : canvasAspect < 1.05;

    if (isMobile) {
      // Mobile devices: keep as it was originally (fit width) so full minifigure,
      // technical annotations, exploded parts, and Batmobile are fully visible and not cropped
      renderW = cWidth;
      renderH = renderW / imgAspect;
      offsetX = 0;
      offsetY = (cHeight - renderH) / 2;

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

      // Clean pure black bars above and below on mobile so nothing bleeds
      ctx.fillStyle = "#000000";
      if (offsetY > 0) {
        ctx.fillRect(0, 0, cWidth, Math.ceil(offsetY));
        ctx.fillRect(0, Math.floor(cHeight - offsetY), cWidth, Math.ceil(offsetY) + 1);
      }
    } else {
      // Desktop: true edge-to-edge object-fit cover to fill completely behind the navbar with zero voids
      if (canvasAspect > imgAspect) {
        renderW = cWidth;
        renderH = renderW / imgAspect;
        offsetX = 0;
        offsetY = (cHeight - renderH) / 2;
      } else {
        renderH = cHeight;
        renderW = renderH * imgAspect;
        offsetX = (cWidth - renderW) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    }
  }, []);

  // Preload frames with staggered priority batches
  useEffect(() => {
    let isCancelled = false;
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    imagesRef.current = images;

    const updateProgress = () => {
      if (isCancelled) return;
      loadedCountRef.current++;
      const count = loadedCountRef.current;
      const pct = Math.round((count / TOTAL_FRAMES) * 100);
      setLoadPercentage(pct);

      // Once the first 20 frames load, mark initial ready so user can view immediately
      if (count >= 20 && !isInitialReady) {
        setIsInitialReady(true);
        drawFrame(0);
      }

      if (count === TOTAL_FRAMES) {
        setAllLoaded(true);
        setIsInitialReady(true);
        onLoaded?.();
      }
    };

    const loadSingleFrame = (idx: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (images[idx]) {
          resolve(images[idx]!);
          return;
        }
        const img = new Image();
        const paddedIndex = String(idx + 1).padStart(3, "0");
        img.src = `/frames/frame_${paddedIndex}.webp`;

        img.onload = () => {
          images[idx] = img;
          updateProgress();
          if (idx === 0) {
            drawFrame(0);
          }
          resolve(img);
        };

        img.onerror = () => {
          images[idx] = null;
          updateProgress();
          resolve(img);
        };
      });
    };

    const startPreload = async () => {
      // Phase 1: Load frames 0..24 immediately for rapid initial render
      const initialBatch: Promise<HTMLImageElement>[] = [];
      for (let i = 0; i < Math.min(25, TOTAL_FRAMES); i++) {
        initialBatch.push(loadSingleFrame(i));
      }
      await Promise.all(initialBatch);

      if (isCancelled) return;

      // Phase 2: Stagger remaining frames in chunks of 25 to preserve network & CPU threads
      const CHUNK_SIZE = 25;
      for (let start = 25; start < TOTAL_FRAMES; start += CHUNK_SIZE) {
        if (isCancelled) break;
        const chunk: Promise<HTMLImageElement>[] = [];
        for (let i = start; i < Math.min(start + CHUNK_SIZE, TOTAL_FRAMES); i++) {
          chunk.push(loadSingleFrame(i));
        }
        await Promise.all(chunk);
        // Micro-yield to maintain 60fps main thread responsiveness
        await new Promise((r) => setTimeout(r, 20));
      }
    };

    startPreload();

    return () => {
      isCancelled = true;
    };
  }, [drawFrame, isInitialReady, onLoaded]);

  // Handle responsive canvas resize & DPR & orientation change
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      drawFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [drawFrame]);

  // Continuous Silky Smooth 60FPS LERP Scrubber Animation Loop
  useEffect(() => {
    let animId: number;
    // Damping factor: 0.14 provides instant responsiveness with buttery smooth momentum
    const LERP_FACTOR = 0.14;

    const tick = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const delta = target - current;

      if (Math.abs(delta) > 0.0001) {
        currentProgressRef.current = current + delta * LERP_FACTOR;
      } else {
        currentProgressRef.current = target;
      }

      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)))
      );

      currentFrameRef.current = targetFrame;

      if (targetFrame !== lastDrawnFrameRef.current) {
        drawFrame(targetFrame);
        lastDrawnFrameRef.current = targetFrame;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none touch-pan-y">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain filter contrast-[1.04] touch-pan-y pointer-events-none"
      />

      {/* Initial Loading Overlay */}
      {!isInitialReady && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-4 z-40 p-4">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-zinc-800 border-t-[#FFD500] animate-spin" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFD500] animate-ping" />
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-display text-base sm:text-lg tracking-wider text-white">
              INITIALIZING BATCAVE ARCHIVE
            </span>
            <div className="w-48 sm:w-52 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-[#FFD500] transition-all duration-150"
                style={{
                  width: `${Math.min(100, Math.round((loadPercentage / 8) * 100))}%`,
                }}
              />
            </div>
            <span className="font-mono text-[10px] sm:text-xs text-[#FFD500] tracking-wider">
              STREAMING 300 1080P FRAMES // {loadPercentage}%
            </span>
          </div>
        </div>
      )}

      {/* Non-intrusive background buffer badge while remaining frames stream in */}
      {isInitialReady && !allLoaded && (
        <div
          style={{
            top: "max(1rem, calc(env(safe-area-inset-top) + 0.5rem))",
            right: "max(1rem, env(safe-area-inset-right))",
          }}
          className="absolute z-30 flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-black/75 backdrop-blur-md rounded-full border border-white/10 font-mono text-[9px] sm:text-[10px] text-zinc-400 pointer-events-none transition-opacity"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD500] animate-pulse" />
          <span>BUFFERING 1080P // {loadPercentage}%</span>
        </div>
      )}
    </div>
  );
}


