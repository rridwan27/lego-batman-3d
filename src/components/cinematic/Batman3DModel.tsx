"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface Batman3DModelProps {
  explosionProgress: number; // 0.0 (fully assembled) to 1.0 (fully exploded)
  pointer: { x: number; y: number };
}

// Cubic smoothstep easing
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export default function Batman3DModel({ explosionProgress, pointer }: Batman3DModelProps) {
  const masterGroupRef = useRef<THREE.Group>(null);

  // Modular Component Refs
  const cowlRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const beltRef = useRef<THREE.Group>(null);
  const legsRef = useRef<THREE.Group>(null);
  const batarangRef = useRef<THREE.Group>(null);
  const floatingStudsRef = useRef<THREE.Group>(null);

  // High-gloss black plastic material
  const blackPlastic = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#111215",
        roughness: 0.18,
        metalness: 0.12,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
      }),
    []
  );

  // Matte cape material
  const capeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0a0c",
        roughness: 0.85,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Golden yellow utility belt material
  const yellowPlastic = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#FFD500",
        roughness: 0.22,
        metalness: 0.08,
        clearcoat: 0.6,
      }),
    []
  );

  // Flesh tone head material
  const fleshMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#D9A37A",
        roughness: 0.35,
      }),
    []
  );

  // White ocular / headband material
  const whiteMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#FFFFFF",
      }),
    []
  );

  // Translucent amber stud material
  const transAmber = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#FFAA00",
        transmission: 0.8,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
      }),
    []
  );

  useFrame((_, delta) => {
    if (!masterGroupRef.current) return;

    // Smooth subtle mouse parallax on master group
    masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      masterGroupRef.current.rotation.y,
      pointer.x * 0.35,
      0.06
    );
    masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      masterGroupRef.current.rotation.x,
      -pointer.y * 0.25,
      0.06
    );

    // Eased explosion progress
    const ep = smoothstep(0, 1, explosionProgress);

    // 1. Cowl Separation (Lifts upward and tilts back)
    if (cowlRef.current) {
      cowlRef.current.position.y = THREE.MathUtils.lerp(1.72, 3.4, ep);
      cowlRef.current.position.z = THREE.MathUtils.lerp(0, 0.4, ep);
      cowlRef.current.rotation.x = THREE.MathUtils.lerp(0, -0.22, ep);
    }

    // 2. Head Separation (Separates above neck stud)
    if (headRef.current) {
      headRef.current.position.y = THREE.MathUtils.lerp(1.48, 2.2, ep);
      headRef.current.rotation.y = THREE.MathUtils.lerp(0, 0.15, ep);
    }

    // 3. Cape Separation (Floats slightly backward)
    if (capeRef.current) {
      capeRef.current.position.z = THREE.MathUtils.lerp(-0.06, -0.85, ep);
      capeRef.current.position.y = THREE.MathUtils.lerp(0.85, 0.95, ep);
      capeRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 1.25, ep));
    }

    // 4. Arms Separation (Move outward and swing)
    if (leftArmRef.current) {
      leftArmRef.current.position.x = THREE.MathUtils.lerp(-0.72, -1.85, ep);
      leftArmRef.current.position.y = THREE.MathUtils.lerp(0.85, 0.75, ep);
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(0.1, 0.45, ep);
      leftArmRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.3, ep);
    }
    if (rightArmRef.current) {
      rightArmRef.current.position.x = THREE.MathUtils.lerp(0.72, 1.85, ep);
      rightArmRef.current.position.y = THREE.MathUtils.lerp(0.85, 0.75, ep);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(-0.1, -0.45, ep);
      rightArmRef.current.rotation.y = THREE.MathUtils.lerp(0, 0.3, ep);
    }

    // 5. Hands Separation (Decouple further out from arms)
    if (leftHandRef.current) {
      leftHandRef.current.position.x = THREE.MathUtils.lerp(-0.85, -2.6, ep);
      leftHandRef.current.position.y = THREE.MathUtils.lerp(0.3, 0.1, ep);
      leftHandRef.current.rotation.y = THREE.MathUtils.lerp(0, 0.6, ep);
    }
    if (rightHandRef.current) {
      rightHandRef.current.position.x = THREE.MathUtils.lerp(0.85, 2.6, ep);
      rightHandRef.current.position.y = THREE.MathUtils.lerp(0.3, 0.1, ep);
      rightHandRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.6, ep);
    }

    // 6. Utility Belt (Pushes forward and separates)
    if (beltRef.current) {
      beltRef.current.position.y = THREE.MathUtils.lerp(0.28, 0.05, ep);
      beltRef.current.position.z = THREE.MathUtils.lerp(0.02, 0.75, ep);
      beltRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 1.15, ep));
    }

    // 7. Legs & Foundation (Drop downward)
    if (legsRef.current) {
      legsRef.current.position.y = THREE.MathUtils.lerp(-0.4, -1.6, ep);
      legsRef.current.position.z = THREE.MathUtils.lerp(0, -0.2, ep);
    }

    // 8. Batarang Accessory (Floats on upper right)
    if (batarangRef.current) {
      batarangRef.current.position.x = THREE.MathUtils.lerp(1.1, 2.5, ep);
      batarangRef.current.position.y = THREE.MathUtils.lerp(0.5, 1.8, ep);
      batarangRef.current.position.z = THREE.MathUtils.lerp(0.2, 0.8, ep);
      batarangRef.current.rotation.z += delta * 0.5;
    }

    // 9. Floating Studs (Orbital drift in exploded view)
    if (floatingStudsRef.current) {
      floatingStudsRef.current.visible = ep > 0.05;
      floatingStudsRef.current.rotation.y += delta * 0.4;
      floatingStudsRef.current.scale.setScalar(THREE.MathUtils.lerp(0.2, 1, ep));
    }
  });

  return (
    <group ref={masterGroupRef} position={[0, -0.3, 0]}>
      {/* 1. THE COWL */}
      <group ref={cowlRef} position={[0, 1.72, 0]}>
        {/* Cowl Main Shell */}
        <RoundedBox args={[0.76, 0.72, 0.74]} radius={0.12} smoothness={4}>
          <primitive object={blackPlastic} />
        </RoundedBox>

        {/* Left Pointed Bat-Ear */}
        <mesh position={[-0.24, 0.58, -0.05]} rotation={[0.08, 0, 0.12]}>
          <coneGeometry args={[0.09, 0.55, 12]} />
          <primitive object={blackPlastic} />
        </mesh>

        {/* Right Pointed Bat-Ear */}
        <mesh position={[0.24, 0.58, -0.05]} rotation={[0.08, 0, -0.12]}>
          <coneGeometry args={[0.09, 0.55, 12]} />
          <primitive object={blackPlastic} />
        </mesh>

        {/* White Ocular Eyes */}
        <mesh position={[-0.14, 0.08, 0.38]} rotation={[0, 0, -0.1]}>
          <planeGeometry args={[0.12, 0.06]} />
          <primitive object={whiteMaterial} />
        </mesh>
        <mesh position={[0.14, 0.08, 0.38]} rotation={[0, 0, 0.1]}>
          <planeGeometry args={[0.12, 0.06]} />
          <primitive object={whiteMaterial} />
        </mesh>

        {/* Mouth Opening Cutout Frame */}
        <mesh position={[0, -0.22, 0.38]}>
          <boxGeometry args={[0.34, 0.16, 0.02]} />
          <primitive object={fleshMaterial} />
        </mesh>
      </group>

      {/* 2. THE HEAD */}
      <group ref={headRef} position={[0, 1.48, 0]}>
        {/* Head Cylinder */}
        <mesh>
          <cylinderGeometry args={[0.34, 0.34, 0.52, 24]} />
          <primitive object={fleshMaterial} />
        </mesh>
        {/* Top Stud */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 16]} />
          <primitive object={fleshMaterial} />
        </mesh>
        {/* White Under-Cowl Headband */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.342, 0.342, 0.16, 24]} />
          <primitive object={whiteMaterial} />
        </mesh>
      </group>

      {/* 3. THE CAPE */}
      <group ref={capeRef} position={[0, 0.85, -0.06]}>
        <mesh rotation={[-0.15, 0, 0]}>
          <planeGeometry args={[1.7, 1.6, 8, 8]} />
          <primitive object={capeMaterial} />
        </mesh>
      </group>

      {/* 4. THE TORSO (Anchored Center) */}
      <group ref={torsoRef} position={[0, 0.85, 0]}>
        {/* Trapezoid Torso Body */}
        <RoundedBox args={[0.96, 0.94, 0.54]} radius={0.06} smoothness={4}>
          <primitive object={blackPlastic} />
        </RoundedBox>

        {/* Neck Stud */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
          <primitive object={blackPlastic} />
        </mesh>

        {/* Yellow Oval Batman Insignia */}
        <mesh position={[0, 0.18, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
          <primitive object={yellowPlastic} />
        </mesh>
        {/* Bat Silhouette within Insignia */}
        <mesh position={[0, 0.18, 0.295]}>
          <planeGeometry args={[0.22, 0.11]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* 5. ARMS & HANDS */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.72, 0.85, 0]}>
        <mesh position={[0, -0.22, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.55, 16]} />
          <primitive object={blackPlastic} />
        </mesh>
      </group>
      {/* Left Hand */}
      <group ref={leftHandRef} position={[-0.85, 0.3, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.12, 0.05, 12, 24, Math.PI * 1.5]} />
          <primitive object={blackPlastic} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.72, 0.85, 0]}>
        <mesh position={[0, -0.22, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.55, 16]} />
          <primitive object={blackPlastic} />
        </mesh>
      </group>
      {/* Right Hand */}
      <group ref={rightHandRef} position={[0.85, 0.3, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.12, 0.05, 12, 24, Math.PI * 1.5]} />
          <primitive object={blackPlastic} />
        </mesh>
      </group>

      {/* 6. THE UTILITY BELT */}
      <group ref={beltRef} position={[0, 0.28, 0.02]}>
        {/* Main Belt Ring */}
        <RoundedBox args={[0.98, 0.14, 0.56]} radius={0.03} smoothness={3}>
          <primitive object={yellowPlastic} />
        </RoundedBox>
        {/* Buckle Center Block */}
        <mesh position={[0, 0, 0.3]}>
          <boxGeometry args={[0.18, 0.12, 0.06]} />
          <primitive object={yellowPlastic} />
        </mesh>
        {/* Front Pouches */}
        <mesh position={[-0.26, 0, 0.29]}>
          <boxGeometry args={[0.14, 0.1, 0.05]} />
          <primitive object={yellowPlastic} />
        </mesh>
        <mesh position={[0.26, 0, 0.29]}>
          <boxGeometry args={[0.14, 0.1, 0.05]} />
          <primitive object={yellowPlastic} />
        </mesh>
      </group>

      {/* 7. HIPS & LEGS */}
      <group ref={legsRef} position={[0, -0.4, 0]}>
        {/* Hip Joint */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.84, 0.18, 0.44]} />
          <primitive object={blackPlastic} />
        </mesh>
        {/* Left Leg */}
        <RoundedBox args={[0.38, 0.74, 0.44]} position={[-0.23, -0.24, 0]} radius={0.04} smoothness={3}>
          <primitive object={blackPlastic} />
        </RoundedBox>
        {/* Right Leg */}
        <RoundedBox args={[0.38, 0.74, 0.44]} position={[0.23, -0.24, 0]} radius={0.04} smoothness={3}>
          <primitive object={blackPlastic} />
        </RoundedBox>
        {/* Left Foot Toe Step */}
        <mesh position={[-0.23, -0.56, 0.14]}>
          <boxGeometry args={[0.36, 0.1, 0.2]} />
          <primitive object={blackPlastic} />
        </mesh>
        {/* Right Foot Toe Step */}
        <mesh position={[0.23, -0.56, 0.14]}>
          <boxGeometry args={[0.36, 0.1, 0.2]} />
          <primitive object={blackPlastic} />
        </mesh>
      </group>

      {/* 8. ACCESSORY: BATARANG */}
      <group ref={batarangRef} position={[1.1, 0.5, 0.2]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.55, 0.12, 0.03]} />
          <primitive object={blackPlastic} />
        </mesh>
      </group>

      {/* 9. FLOATING TECHNIC STUDS & PINS (In exploded state) */}
      <group ref={floatingStudsRef}>
        {/* Left floating stud */}
        <mesh position={[-1.6, 1.4, 0.4]}>
          <cylinderGeometry args={[0.14, 0.14, 0.12, 16]} />
          <primitive object={yellowPlastic} />
        </mesh>
        {/* Right floating pin */}
        <mesh position={[1.6, 1.2, -0.3]}>
          <cylinderGeometry args={[0.1, 0.1, 0.28, 16]} />
          <primitive object={blackPlastic} />
        </mesh>
        {/* Lower floating trans-amber round stud */}
        <mesh position={[1.4, -0.8, 0.6]}>
          <cylinderGeometry args={[0.14, 0.14, 0.12, 16]} />
          <primitive object={transAmber} />
        </mesh>
        {/* Left lower stud */}
        <mesh position={[-1.4, -0.9, 0.5]}>
          <cylinderGeometry args={[0.14, 0.14, 0.12, 16]} />
          <primitive object={blackPlastic} />
        </mesh>
      </group>
    </group>
  );
}
