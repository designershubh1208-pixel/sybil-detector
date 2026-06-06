"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedSphere({ position, color, distort }: { position: [number, number, number], color: string, distort: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.1}
        roughness={0.2}
        distort={distort}
        speed={2}
        transmission={0.9}
        thickness={0.5}
      />
    </Sphere>
  );
}

function NetworkLines() {
  // Simple network connections stub
  const points = [];
  points.push(new THREE.Vector3(-3, 0, -2));
  points.push(new THREE.Vector3(0, 2, -1));
  points.push(new THREE.Vector3(3, -1, -3));
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" color="#6A8D73" opacity={0.3} transparent linewidth={2} />
    </line>
  );
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <AnimatedSphere position={[-3, 0, -2]} color="#E8E8E5" distort={0.3} />
        <AnimatedSphere position={[0, 2, -1]} color="#6A8D73" distort={0.5} />
        <AnimatedSphere position={[3, -1, -3]} color="#ffffff" distort={0.4} />
        
        <NetworkLines />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
