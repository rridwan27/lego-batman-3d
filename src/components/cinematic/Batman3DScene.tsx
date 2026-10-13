"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Batman3DModel from "./Batman3DModel";

interface Batman3DSceneProps {
  explosionProgress: number;
  pointer: { x: number; y: number };
  currentScene: number;
}

function CameraRig({ currentScene, explosionProgress }: { currentScene: number; explosionProgress: number }) {
  useFrame((state) => {
    // Camera choreography across the 6 scenes:
    // Scene 1: Low angle, pushing in from [0, -0.5, 7.5] to [0, 0.2, 5.5]
    // Scene 2: Product close-up orbit at [1.2, 0.4, 4.8]
    // Scene 3 & 4 (Explosion): Pulled back three-quarters view [0.5, 0.8, 6.8] to fit all suspended pieces
    // Scene 5: Detail close-up [0, 1.2, 3.8] focusing on cowl & chest
    // Scene 6: Dramatic hero pullback [0, 0.3, 5.8]

    let targetZ = 5.6;
    let targetY = 0.4;
    let targetX = 0;

    if (currentScene === 1) {
      targetZ = 6.8;
      targetY = -0.2;
      targetX = -0.2;
    } else if (currentScene === 2) {
      targetZ = 4.8;
      targetY = 0.3;
      targetX = 0.6;
    } else if (currentScene === 3 || currentScene === 4) {
      targetZ = 6.9;
      targetY = 0.6;
      targetX = 0.2;
    } else if (currentScene === 5) {
      targetZ = 3.9;
      targetY = 1.1;
      targetX = 0;
    } else if (currentScene === 6) {
      targetZ = 5.8;
      targetY = 0.3;
      targetX = 0;
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

    // Look at minifigure center of mass
    const lookTargetY = currentScene === 5 ? 1.0 : 0.4;
    state.camera.lookAt(0, lookTargetY, 0);
  });

  return null;
}

function SceneLighting({ explosionProgress }: { explosionProgress: number }) {
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 1.6 + Math.sin(time * 1.5) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />

      {/* Dramatic Overhead Spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[0, 7, 3]}
        angle={0.45}
        penumbra={0.7}
        intensity={3.2}
        color="#ffffff"
        castShadow
      />

      {/* Cool Blue Rim Light (Back & Left) */}
      <directionalLight
        ref={rimLightRef}
        position={[-4, 3, -3]}
        color="#38bdf8"
        intensity={1.8}
      />

      {/* Warm Amber Accent Light (Right side, matching Batmobile & belt) */}
      <pointLight
        position={[3.5, 0.2, 2.5]}
        color="#f59e0b"
        intensity={2.2}
        distance={12}
      />

      {/* Soft Blue Gotham Fill Light */}
      <directionalLight position={[0, -2, 4]} color="#1e3a8a" intensity={0.6} />
    </>
  );
}

export default function Batman3DScene({
  explosionProgress,
  pointer,
  currentScene,
}: Batman3DSceneProps) {
  return (
    <div className="relative w-full h-full bg-black select-none pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <CameraRig currentScene={currentScene} explosionProgress={explosionProgress} />
        <SceneLighting explosionProgress={explosionProgress} />
        <Batman3DModel explosionProgress={explosionProgress} pointer={pointer} />
      </Canvas>
    </div>
  );
}
