"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingParticles({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, velocities, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const sca = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = Math.random() * 0.004 + 0.001; // subtle upward drift like Batcave dust/sparks
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

      sca[i] = Math.random() * 1.5 + 0.5;
    }
    return [pos, vel, sca];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * (delta * 60);
      posArray[i * 3] += velocities[i * 3] * (delta * 60);

      // loop back when floating too high
      if (posArray[i * 3 + 1] > 5) {
        posArray[i * 3 + 1] = -5;
        posArray[i * 3] = (Math.random() - 0.5) * 16;
      }
    }
    posAttr.needsUpdate = true;

    // gentle rotation responding to mouse
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(
      pointsRef.current.rotation.y,
      state.pointer.x * 0.15,
      0.05
    );
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      -state.pointer.y * 0.1,
      0.05
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FFE57F"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneLighting() {
  const blueLightRef = useRef<THREE.PointLight>(null);
  const amberLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (blueLightRef.current) {
      blueLightRef.current.position.x = THREE.MathUtils.lerp(
        blueLightRef.current.position.x,
        -4 + state.pointer.x * 2,
        0.05
      );
    }
    if (amberLightRef.current) {
      amberLightRef.current.position.x = THREE.MathUtils.lerp(
        amberLightRef.current.position.x,
        2 - state.pointer.x * 1.5,
        0.05
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      {/* Cold blue Batcave backlight */}
      <pointLight
        ref={blueLightRef}
        position={[-4, 3, 2]}
        color="#38bdf8"
        intensity={1.2}
        distance={15}
      />
      {/* Warm amber Batmobile cockpit & headlights accent */}
      <pointLight
        ref={amberLightRef}
        position={[3, -1, 3]}
        color="#f59e0b"
        intensity={1.8}
        distance={12}
      />
    </>
  );
}

export default function BatAtmosphereCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <SceneLighting />
        <FloatingParticles count={110} />
      </Canvas>
    </div>
  );
}
