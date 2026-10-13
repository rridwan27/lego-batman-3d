"use client";

import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Center,
  OrbitControls,
  Float,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

function Minifigure({ autoRotate = true }: { autoRotate?: boolean }) {
  const { scene } = useGLTF("/lego_batman_minifigure.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene to avoid reference mutation
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.min(mat.roughness, 0.35);
          mat.metalness = Math.max(mat.metalness, 0.15);
          mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene]);

  // Gentle subtle idle rotation if autoRotate is enabled
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={groupRef}>
      <Center position={[0, 0, 0]}>
        <primitive object={clonedScene} scale={0.044} />
      </Center>
    </group>
  );
}

// Preload the GLB model asset
useGLTF.preload("/lego_batman_minifigure.glb");

interface BatmanCtaCanvasProps {
  autoRotate?: boolean;
  onResetView?: () => void;
}

export default function BatmanCtaCanvas({ autoRotate = true }: BatmanCtaCanvasProps) {
  const controlsRef = useRef<any>(null);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] flex items-center justify-center select-none">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full touch-pan-y"
      >
        {/* Adjusted Camera distance and FOV to show full Batman minifigure from cowl ears to boots */}
        <PerspectiveCamera makeDefault position={[0, 0.15, 4.2]} fov={38} />

        {/* Ambient Batcave Light */}
        <ambientLight intensity={0.7} />

        {/* Studio Key Light (Warm Gotham Amber) */}
        <directionalLight
          position={[3.5, 4.5, 3.5]}
          intensity={2.2}
          color="#FFE57F"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Face & Cowl Direct Front Illumination */}
        <directionalLight
          position={[0, 1.2, 3.8]}
          intensity={2.0}
          color="#FFFFFF"
        />

        {/* Cool Tactical Rim Light (Cyan/Blue backlighting) */}
        <directionalLight
          position={[-3.5, 3.5, -3]}
          intensity={2.8}
          color="#00E5FF"
        />

        {/* Overhead Batcave Spotlight */}
        <spotLight
          position={[0, 6, 1]}
          intensity={3.0}
          color="#FFFFFF"
          angle={0.5}
          penumbra={0.8}
          castShadow
        />

        <Suspense fallback={null}>
          <Float
            speed={1.4}
            rotationIntensity={0.15}
            floatIntensity={0.2}
            floatingRange={[-0.04, 0.04]}
          >
            <Minifigure autoRotate={autoRotate} />
          </Float>

          {/* Pedestal Contact Shadow below boots */}
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.75}
            scale={5}
            blur={2.0}
            far={3.0}
            color="#000000"
          />
        </Suspense>

        {/* Orbit Controls with Damping, Target Centered, and Smooth Range */}
        <OrbitControls
          ref={controlsRef}
          target={[0, 0, 0]}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={6.0}
          enablePan={false}
          autoRotate={false}
          dampingFactor={0.06}
          rotateSpeed={0.8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 + 0.12}
        />
      </Canvas>
    </div>
  );
}
