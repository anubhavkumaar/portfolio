'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const W = 3.6;
const H = 2.2;

// Accent tints per project — blue family matching #5B9FFF
const TINTS = [
  'rgba(20, 60, 180, 0.30)',  // PitStop — deep blue
  'rgba(10, 40, 160, 0.32)',  // HEAT     — indigo-blue
  'rgba(10, 70, 200, 0.28)',  // SAPR     — bright blue
  'rgba(40, 30, 160, 0.32)',  // SoulCity — violet-blue
];

// Panels shifted right. Camera at [0,0,7], FOV 50 → visible X ≈ ±3.1 at Z=0.
const CONFIGS: { pos: [number, number, number]; rot: [number, number, number] }[] = [
  { pos: [1.2,  0.55,  0.3], rot: [ 0.15,  0.50, -0.05] },
  { pos: [2.6, -0.30, -0.5], rot: [ 0.07,  0.28,  0.03] },
  { pos: [1.8,  0.90, -0.9], rot: [-0.12, -0.40,  0.06] },
  { pos: [3.1, -0.80, -1.3], rot: [ 0.11, -0.58, -0.04] },
];

// Gradient fallback used while screenshot is loading
function makeGradientTexture(_tint: string): THREE.CanvasTexture {
  const w = 512, h = Math.round(w * H / W);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.52);
  grad.addColorStop(0,   'rgba(91,159,255,0.9)');
  grad.addColorStop(0.5, 'rgba(60,120,220,0.6)');
  grad.addColorStop(1,   'rgba(20,40,140,0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const t = new THREE.CanvasTexture(canvas);
  t.needsUpdate = true;
  return t;
}

// Composite: screenshot + blue tint overlay + edge vignette → CanvasTexture
function makeFrostedTexture(img: HTMLImageElement, tint: string): THREE.CanvasTexture {
  const w = 720, h = Math.round(w * H / W);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Screenshot, slightly dimmed
  ctx.globalAlpha = 0.80;
  ctx.drawImage(img, 0, 0, w, h);
  ctx.globalAlpha = 1.0;

  // Blue tint wash
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, w, h);

  // Edge vignette — fade to black at edges so panel blends into dark bg
  const vig = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.58);
  vig.addColorStop(0,    'rgba(0,0,0,0.00)');
  vig.addColorStop(0.50, 'rgba(0,0,0,0.00)');
  vig.addColorStop(0.80, 'rgba(0,0,0,0.45)');
  vig.addColorStop(1.0,  'rgba(0,0,0,0.92)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  const t = new THREE.CanvasTexture(canvas);
  t.needsUpdate = true;
  return t;
}

function Panel({
  cfgIdx,
  screenshotSrc,
  isActive,
  anyHovered,
}: {
  cfgIdx: number;
  screenshotSrc: string;
  isActive: boolean;
  anyHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshBasicMaterial>(null);
  const cfg     = CONFIGS[cfgIdx] ?? CONFIGS[0];
  const tint    = TINTS[cfgIdx] ?? TINTS[0];

  // Start with gradient; replace with frosted screenshot once loaded
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const fallback = makeGradientTexture(tint);
    setTexture(fallback);

    const img = new Image();
    img.onload = () => {
      const frosted = makeFrostedTexture(img, tint);
      setTexture(frosted);
      if (matRef.current) {
        matRef.current.map = frosted;
        matRef.current.needsUpdate = true;
      }
    };
    img.onerror = () => {}; // keep gradient fallback
    img.src = screenshotSrc;
  }, [screenshotSrc, tint]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    const mat  = matRef.current;
    if (!mesh || !mat) return;

    const t = clock.getElapsedTime();

    // Subtle drift
    mesh.position.y = cfg.pos[1] + Math.sin(t * 0.38 + cfg.pos[0] * 2.3) * 0.06;
    mesh.position.x = cfg.pos[0] + Math.cos(t * 0.24 + cfg.pos[2]) * 0.03;

    // Opacity: ghostly → translucent reveal on hover
    const targetOpacity = isActive ? 0.82 : anyHovered ? 0.03 : 0.06;
    mat.opacity += (targetOpacity - mat.opacity) * 0.09;

    // Scale
    const targetScale = isActive ? 1.04 : anyHovered ? 0.97 : 1.0;
    mesh.scale.x += (targetScale - mesh.scale.x) * 0.09;
    mesh.scale.y += (targetScale - mesh.scale.y) * 0.09;
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={cfg.pos} rotation={cfg.rot}>
      <planeGeometry args={[W, H]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={0.06}
        depthWrite={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function WorksCanvas3D({
  hoveredIdx,
  previews,
}: {
  hoveredIdx: number | null;
  previews: string[];
}) {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {previews.map((src, i) => (
        <Panel
          key={i}
          cfgIdx={i}
          screenshotSrc={src}
          isActive={hoveredIdx === i}
          anyHovered={hoveredIdx !== null}
        />
      ))}
    </Canvas>
  );
}
