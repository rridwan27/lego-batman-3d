"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function LegoBrick({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  // A 2x2 Lego Brick representation
  const studPositions: [number, number, number][] = [
    [-0.35, 0.45, -0.35],
    [0.35, 0.45, -0.35],
    [-0.35, 0.45, 0.35],
    [0.35, 0.45, 0.35],
  ];

  return (
    <group ref={meshRef} position={position}>
      {/* Main brick body */}
      <RoundedBox args={[1.5, 0.8, 1.5]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
        />
      </RoundedBox>

      {/* Studs */}
      {studPositions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.22, 0.22, 0.2, 24]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.2}
            metalness={0.1}
            clearcoat={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function BatCanvas() {
  return (
    <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-black border border-yellow-500/20 shadow-2xl relative">
      <div className="absolute top-3 left-4 z-10 pointer-events-none">
        <span className="text-xs uppercase font-mono tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
          Interactive Three.js Canvas
        </span>
      </div>
      <Canvas camera={{ position: [2.5, 2.5, 3.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 6, 5]} intensity={1.5} color="#ffd700" />
        <directionalLight position={[-4, 4, 2]} intensity={0.9} color="#60a5fa" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <LegoBrick position={[0, 0, 0]} color="#18181b" />
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}
