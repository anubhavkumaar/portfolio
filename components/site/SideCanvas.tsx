'use client';

// The old effect, brought back at the user's request (2026-09-15): four
// screenshots as ghostly, slowly drifting 3D panels behind the project list,
// each one resolving into view on hover of its row and fading the others
// down to almost nothing. Costs ~600KB of three.js and react-three-fiber,
// so it is dynamically imported and only mounts once the section is on
// screen and the visitor has not asked for reduced motion.

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const W = 3.6;
const H = 2.2;

// Blue family, matching the site's one accent (#5b9fff).
const TINTS = ['rgba(20, 60, 180, 0.30)', 'rgba(10, 40, 160, 0.32)', 'rgba(10, 70, 200, 0.28)', 'rgba(40, 30, 160, 0.32)'];

// Panels sit right of centre; camera at [0,0,7], fov 50.
const CONFIGS: { pos: [number, number, number]; rot: [number, number, number] }[] = [
  { pos: [1.2, 0.55, 0.3], rot: [0.15, 0.5, -0.05] },
  { pos: [2.6, -0.3, -0.5], rot: [0.07, 0.28, 0.03] },
  { pos: [1.8, 0.9, -0.9], rot: [-0.12, -0.4, 0.06] },
  { pos: [3.1, -0.8, -1.3], rot: [0.11, -0.58, -0.04] },
];

function makeGradientTexture(): THREE.CanvasTexture {
  const w = 512;
  const h = Math.round((w * H) / W);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.52);
  grad.addColorStop(0, 'rgba(91,159,255,0.9)');
  grad.addColorStop(0.5, 'rgba(60,120,220,0.6)');
  grad.addColorStop(1, 'rgba(20,40,140,0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const t = new THREE.CanvasTexture(canvas);
  t.needsUpdate = true;
  return t;
}

// Screenshot, tinted blue, vignetted to the page ground so the panel blends
// into the section rather than sitting on it as a sticker.
function makeFrostedTexture(img: HTMLImageElement, tint: string, bgRgb: string): THREE.CanvasTexture {
  const w = 720;
  const h = Math.round((w * H) / W);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.globalAlpha = 0.8;
  ctx.drawImage(img, 0, 0, w, h);
  ctx.globalAlpha = 1;
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, w, h);
  const vig = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.58);
  vig.addColorStop(0, `rgba(${bgRgb},0.00)`);
  vig.addColorStop(0.5, `rgba(${bgRgb},0.00)`);
  vig.addColorStop(0.8, `rgba(${bgRgb},0.45)`);
  vig.addColorStop(1, `rgba(${bgRgb},0.92)`);
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
  bgRgb,
}: {
  cfgIdx: number;
  screenshotSrc: string;
  isActive: boolean;
  anyHovered: boolean;
  bgRgb: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const cfg = CONFIGS[cfgIdx] ?? CONFIGS[0];
  const tint = TINTS[cfgIdx] ?? TINTS[0];
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    setTexture(makeGradientTexture());
    const img = new Image();
    img.onload = () => {
      const frosted = makeFrostedTexture(img, tint, bgRgb);
      setTexture(frosted);
      if (matRef.current) {
        matRef.current.map = frosted;
        matRef.current.needsUpdate = true;
      }
    };
    img.src = screenshotSrc;
  }, [screenshotSrc, tint, bgRgb]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;
    const t = clock.getElapsedTime();
    mesh.position.y = cfg.pos[1] + Math.sin(t * 0.38 + cfg.pos[0] * 2.3) * 0.06;
    mesh.position.x = cfg.pos[0] + Math.cos(t * 0.24 + cfg.pos[2]) * 0.03;
    const targetOpacity = isActive ? 0.82 : anyHovered ? 0.03 : 0.06;
    mat.opacity += (targetOpacity - mat.opacity) * 0.09;
    const targetScale = isActive ? 1.04 : anyHovered ? 0.97 : 1.0;
    mesh.scale.x += (targetScale - mesh.scale.x) * 0.09;
    mesh.scale.y += (targetScale - mesh.scale.y) * 0.09;
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={cfg.pos} rotation={cfg.rot}>
      <planeGeometry args={[W, H]} />
      <meshBasicMaterial ref={matRef} map={texture} transparent opacity={0.06} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function SideCanvas({ hoveredIdx, previews }: { hoveredIdx: number | null; previews: string[] }) {
  const [bgRgb, setBgRgb] = useState('10, 12, 16');

  useEffect(() => {
    const sync = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      setBgRgb(light ? '244, 246, 250' : '10, 12, 16');
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  return (
    <Canvas
      className="side-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {previews.map((src, i) => (
        <Panel key={src} cfgIdx={i} screenshotSrc={src} isActive={hoveredIdx === i} anyHovered={hoveredIdx !== null} bgRgb={bgRgb} />
      ))}
    </Canvas>
  );
}
