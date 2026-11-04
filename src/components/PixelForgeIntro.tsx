import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./PixelForgeIntro.css";

export interface PixelForgeIntroProps {
  onComplete: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  isSquare: boolean;
  life: number;
  maxLife: number;
}

interface VoxelShard {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
}

/* ==========================================================================
   PIXEL GAMEPAD CONTROLLER SVG (Scene 1)
   ========================================================================== */
const PixelGamepadSvg = () => (
  <svg
    viewBox="0 0 48 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pfi-controller-icon"
    shapeRendering="crispEdges"
  >
    <path
      d="M8 4h32v4h4v16h-4v4h-6v-4h-4v-4h-8v4h-4v4h-6v-4H4V8h4V4z"
      fill="#240046"
      stroke="#c084fc"
      strokeWidth="2"
    />
    <path d="M12 12h4v2h2v4h-2v2h-4v-2h-2v-4h2v-2z" fill="#00d9ff" />
    <rect x="30" y="11" width="3" height="3" fill="#ff006e" />
    <rect x="34" y="15" width="3" height="3" fill="#ffd600" />
    <rect x="26" y="15" width="3" height="3" fill="#00ff85" />
    <rect x="30" y="19" width="3" height="3" fill="#00d9ff" />
    <rect x="20" y="15" width="3" height="2" fill="#c084fc" />
    <rect x="25" y="15" width="3" height="2" fill="#c084fc" />
  </svg>
);

/* ==========================================================================
   CROSSED BLACKSMITH HAMMERS / PICKAXES SVG (Scene 5 & 6)
   ========================================================================== */
const CrossedHammersSvg = () => (
  <svg
    viewBox="0 0 64 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pfi-crossed-hammers"
    shapeRendering="crispEdges"
  >
    <g transform="rotate(40 32 24)">
      <rect x="30" y="4" width="4" height="40" fill="#a16207" />
      <rect x="24" y="6" width="16" height="10" fill="#ea580c" />
      <rect x="22" y="8" width="20" height="6" fill="#fde047" />
    </g>
    <g transform="rotate(-40 32 24)">
      <rect x="30" y="4" width="4" height="40" fill="#a16207" />
      <rect x="24" y="6" width="16" height="10" fill="#ea580c" />
      <rect x="22" y="8" width="20" height="6" fill="#fde047" />
    </g>
  </svg>
);

/* ==========================================================================
   GLOWING ANVIL MOTIF SVG (Scene 5 & 6)
   ========================================================================== */
const AnvilMotifSvg = () => (
  <svg
    viewBox="0 0 100 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pfi-anvil-motif"
    shapeRendering="crispEdges"
  >
    <rect x="15" y="4" width="70" height="8" fill="#ff7b00" />
    <rect x="20" y="2" width="60" height="2" fill="#ffd000" />
    <path d="M15 4L5 8v4h10V4z" fill="#ea580c" />
    <path d="M30 12h40l-6 12H36l-6-12z" fill="#9a3412" />
    <rect x="24" y="24" width="52" height="8" fill="#431407" />
    <rect x="18" y="30" width="64" height="4" fill="#1e293b" />
    <rect x="38" y="14" width="24" height="6" fill="#fde047" opacity="0.9" />
  </svg>
);

/* ==========================================================================
   MATHEMATICAL INTERPOLATION UTILITIES
   ========================================================================== */
const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

const createVoxelShards = (): VoxelShard[] => {
  const shards: VoxelShard[] = [];
  const colors = ["#ffffff", "#fef08a", "#ffd000", "#ff6a00", "#c084fc"];

  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2 + ((i % 5) - 2) * 0.1;
    const dist = 90 + (i % 6) * 35;
    shards.push({
      id: i,
      startX: ((i % 7) - 3) * 12,
      startY: ((i % 5) - 2) * 8,
      targetX: Math.cos(angle) * dist,
      targetY: Math.sin(angle) * dist,
      color: colors[i % colors.length],
      size: 6 + (i % 4) * 2,
      rotation: (i * 37) % 360,
      rotSpeed: ((i % 5) - 2) * 2.5,
    });
  }
  return shards;
};

export const PixelForgeIntro = ({
  onComplete,
  onNavigateSection,
}: PixelForgeIntroProps) => {
  // Preloading & Master Clock State
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [time, setTime] = useState(0);

  // Precomputed Shards
  const [explosionShards] = useState<VoxelShard[]>(createVoxelShards);

  // Canvas & Master RAF
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Asset image paths
  const scene1Bg = "/assets/pixelforge/scene1-bg.jpg";
  const scene2Bg = "/assets/pixelforge/scene2-furnace-bg.jpg";
  const scene3Bg = "/assets/pixelforge/scene3-furnace-interior.jpg";
  const scene6Bg = "/assets/pixelforge/scene6-landscape-bg.jpg";

  /* ==========================================================================
     1. ASSET PRELOADER (Ensures zero black frames or missing images)
     ========================================================================== */
  useEffect(() => {
    const urls = [scene1Bg, scene2Bg, scene3Bg, scene6Bg];
    let loadedCount = 0;

    const promises = urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / urls.length) * 100));
            resolve();
          };
          img.onerror = () => {
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / urls.length) * 100));
            resolve();
          };
          img.src = url;
        })
    );

    Promise.all(promises).then(() => {
      setTimeout(() => {
        setIsAssetsLoaded(true);
      }, 150);
    });
  }, [scene1Bg, scene2Bg, scene3Bg, scene6Bg]);

  /* ==========================================================================
     2. CONTINUOUS MASTER TIMELINE (12.0s duration)
     ========================================================================== */
  useEffect(() => {
    if (!isAssetsLoaded) return;

    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) / 1000;

      if (elapsed >= 12.0) {
        setTime(12.0);
        return;
      }

      setTime(elapsed);
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isAssetsLoaded]);

  /* ==========================================================================
     3. PERSISTENT CONTINUOUS PARTICLE CANVAS
     Interpolates colors, velocity and density smoothly without resetting
     ========================================================================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let particleRaf: number;
    let lastExplosionSpawn = false;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentTime = time;

      // Color transition weights
      const isPurple = currentTime < 2.5;
      const isFurnace = currentTime >= 2.5 && currentTime < 6.2;
      const isExplosion = currentTime >= 6.2 && currentTime < 7.6;
      const isGoldReveal = currentTime >= 7.6 && currentTime < 9.8;
      const isMoonlit = currentTime >= 9.8;

      let palette: string[];
      if (isPurple) {
        palette = ["#c084fc", "#9333ea", "#00d9ff", "#e879f9", "#ffffff"];
      } else if (isFurnace) {
        palette = ["#ffedd5", "#fde047", "#f97316", "#ef4444", "#ffffff"];
      } else if (isExplosion) {
        palette = ["#ffffff", "#fef08a", "#ffd000", "#ff6a00", "#ff0055"];
      } else if (isGoldReveal) {
        palette = ["#fef08a", "#fde047", "#fb923c", "#c084fc", "#ffffff"];
      } else {
        palette = ["#c084fc", "#38bdf8", "#e0e7ff", "#fef08a", "#ffffff"];
      }

      // One-time explosion burst at t ~ 6.25s
      if (isExplosion && !lastExplosionSpawn) {
        lastExplosionSpawn = true;
        for (let i = 0; i < 160; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 14 + 5;
          particlesRef.current.push({
            x: width / 2,
            y: height * 0.52,
            size: Math.random() * 8 + 3,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: palette[Math.floor(Math.random() * palette.length)],
            isSquare: true,
            life: 0,
            maxLife: Math.random() * 55 + 25,
          });
        }
      }

      // Continuous ambient particle replenishment
      if (particlesRef.current.length < 80 && !isExplosion) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: isPurple || isMoonlit ? Math.random() * height : height + 10,
          size: Math.random() * 4.5 + 2,
          vx: (Math.random() - 0.5) * 1.4,
          vy: isFurnace || isGoldReveal ? -Math.random() * 2.8 - 0.8 : (Math.random() - 0.5) * 1.1,
          alpha: Math.random() * 0.75 + 0.25,
          color: palette[Math.floor(Math.random() * palette.length)],
          isSquare: true,
          life: 0,
          maxLife: Math.random() * 90 + 50,
        });
      }

      // Physics update and render
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (isExplosion) {
          p.vx *= 0.96;
          p.vy *= 0.96;
        }

        const progress = p.life / p.maxLife;
        const currentAlpha = p.alpha * (1 - progress);

        if (progress >= 1 || p.y < -30 || p.x < -30 || p.x > width + 30) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        if (p.isSquare) {
          ctx.fillRect(p.x, p.y, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      particleRaf = requestAnimationFrame(render);
    };

    particleRaf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(particleRaf);
    };
  }, [time]);

  /* ==========================================================================
     4. SPATIAL CAMERA & SCENE INTERPOLATIONS
     ========================================================================== */
  let camScale = 1.0;
  let camY = 0;
  let screenShakeX = 0;
  let screenShakeY = 0;

  if (time < 2.2) {
    const p = smoothstep(0, 2.2, time);
    camScale = 1.0 + p * 0.15;
    camY = -p * 15;
  } else if (time < 4.2) {
    const p = smoothstep(2.2, 4.2, time);
    camScale = 1.15 + p * 0.55;
    camY = -15 - p * 30;
  } else if (time < 6.2) {
    const p = smoothstep(4.2, 6.2, time);
    camScale = 1.02 + p * 0.08;
    camY = -p * 8;
  } else if (time < 7.8) {
    const p = (time - 6.2) / 1.6;
    const decay = Math.max(0, 1 - p * 1.4);
    screenShakeX = Math.sin(time * 60) * decay * 14;
    screenShakeY = Math.cos(time * 50) * decay * 12;
    camScale = 1.1 + Math.sin(p * Math.PI) * 0.08;
  } else if (time < 9.8) {
    const p = smoothstep(7.8, 9.8, time);
    camScale = 1.1 - p * 0.1;
    camY = -p * 4;
  } else {
    const p = smoothstep(9.8, 12.0, time);
    camScale = 1.05 - p * 0.05;
    camY = 0;
  }

  // Background Layer Opacities
  const opScene1 = 1 - smoothstep(2.0, 3.4, time);

  let opScene2 = 0;
  if (time >= 1.6 && time < 4.4) {
    opScene2 = smoothstep(1.6, 2.8, time) * (1 - smoothstep(3.8, 4.4, time));
  } else if (time >= 7.0 && time < 11.0) {
    opScene2 = smoothstep(7.0, 7.8, time) * (1 - smoothstep(9.6, 11.0, time));
  }

  const opScene3 =
    smoothstep(3.8, 4.8, time) * (1 - smoothstep(6.8, 7.8, time));

  const opScene6 = smoothstep(9.6, 11.0, time);

  // Atmospheric Lighting
  const isPurpleLighting = 1 - smoothstep(2.0, 3.5, time);
  const isFurnaceLighting =
    smoothstep(2.2, 3.5, time) * (1 - smoothstep(9.5, 11.0, time));
  const isTwilightLighting = smoothstep(9.6, 11.2, time);

  // Radial Flash Burst (Scene 4)
  const flashOpacity =
    time >= 6.2 && time <= 6.8
      ? Math.sin(((time - 6.2) / 0.6) * Math.PI) * 0.92
      : 0;

  // Shockwave Ring
  const shockwaveProg = time >= 6.25 && time <= 7.2 ? (time - 6.25) / 0.95 : 0;
  const shockwaveScale = 0.2 + shockwaveProg * 3.2;
  const shockwaveOp = time >= 6.25 && time <= 7.2 ? (1 - shockwaveProg) * 0.85 : 0;

  // Continuous GAMECRAFT Logo
  const showGameCraft = time < 6.4;
  let gcX = 0;
  let gcY = 0;
  let gcScale = 1.0;
  let gcRotX = 0;
  let gcRotY = 0;
  let gcRotZ = 0;
  let gcBlur = 0;
  let gcTrails = 0;
  let gcHeatProg = 0;

  if (time < 2.2) {
    gcY = Math.sin(time * 3.5) * 5;
    gcScale = 1.0;
  } else if (time < 4.2) {
    const p = (time - 2.2) / 2.0;
    gcScale = 1.0 - p * 0.72;
    gcY = p * 105;
    gcRotX = p * 32;
    gcRotY = -p * 22;
    gcRotZ = -p * 4;
    gcBlur = p * 3.5;
    gcTrails = Math.sin(p * Math.PI);
  } else if (time < 6.4) {
    const p = (time - 4.2) / 2.0;
    gcHeatProg = clamp(p, 0, 1);
    gcScale = 0.72 + Math.sin(p * Math.PI) * 0.05;
    // Deterministic sinusoidal thermal jitter (avoids impure Math.random)
    gcY = 42 + Math.sin(time * 80) * gcHeatProg * 2.2;
    gcX = Math.cos(time * 65) * gcHeatProg * 2.2;
  }

  // PIXEL FORGE Identity Reveal
  const showPixelForge = time >= 7.0;
  let pfScale = 1.0;
  let pfY = 0;
  let pfOpacity = 0;

  if (time >= 7.0 && time < 8.2) {
    const p = (time - 7.0) / 1.2;
    pfOpacity = smoothstep(0, 1, p);
    pfScale = 0.78 + smoothstep(0, 1, p) * 0.22;
    pfY = (1 - smoothstep(0, 1, p)) * 35;
  } else if (time >= 8.2) {
    pfOpacity = 1;
    pfScale = 1.0;
    pfY = 0;
  }

  /* ==========================================================================
     HANDLERS: SKIP, REPLAY, NAVIGATION
     ========================================================================== */
  const handleSkip = useCallback(() => {
    setTime(12.0);
  }, []);

  const handleReplay = useCallback(() => {
    setTime(0);
    startTimeRef.current = performance.now();
  }, []);

  const handleEnterSite = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleNavClick = (sectionId: string) => {
    onComplete();
    if (onNavigateSection) {
      setTimeout(() => onNavigateSection(sectionId), 300);
    }
  };

  const getSceneLabel = () => {
    if (time < 2.2) return "01 // GAMECRAFT ENTERS THE ARENA";
    if (time < 4.2) return "02 // JOURNEY INTO THE FURNACE";
    if (time < 6.2) return "03 // FORGED IN SACRED FIRE";
    if (time < 7.6) return "04 // THE FORGE EXPLOSION";
    if (time < 9.8) return "05 // PIXEL FORGE IS BORN";
    return "06 // WELCOME TO PIXEL FORGE";
  };

  return (
    <AnimatePresence>
      <motion.div
        className="pixelforge-intro-root"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      >
        {/* PRELOADER: Shown only while loading images */}
        {!isAssetsLoaded && (
          <div className="pfi-preloader">
            <svg
              className="pfi-preload-icon"
              viewBox="0 0 32 32"
              fill="none"
              shapeRendering="crispEdges"
            >
              <rect x="8" y="8" width="16" height="16" fill="#c084fc" />
              <rect x="12" y="12" width="8" height="8" fill="#ffd000" />
            </svg>
            <div className="pfi-preload-text">
              PIXEL FORGE // PREPARING THE ARENA {loadProgress}%
            </div>
            <div className="pfi-preload-bar-track">
              <div
                className="pfi-preload-bar-fill"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* SCREEN SHAKE & CAMERA RIG */}
        <div
          className="pfi-camera-rig"
          style={{
            transform: `scale(${camScale}) translateY(${camY}px)`,
          }}
        >
          <div
            className="pfi-shake-wrap"
            style={{
              transform: `translate3d(${screenShakeX}px, ${screenShakeY}px, 0)`,
            }}
          >
            {/* PERSISTENT BACKGROUND LAYERS */}
            <div className="pfi-bg-container">
              {/* Layer 1: Corridor */}
              <div
                className="pfi-bg-layer"
                style={{
                  backgroundImage: `url(${scene1Bg})`,
                  opacity: opScene1,
                  display: opScene1 > 0 ? "block" : "none",
                }}
              />

              {/* Layer 2: Furnace Exterior Arch */}
              <div
                className="pfi-bg-layer"
                style={{
                  backgroundImage: `url(${scene2Bg})`,
                  opacity: opScene2,
                  display: opScene2 > 0 ? "block" : "none",
                }}
              />

              {/* Layer 3: Furnace Interior Roaring Magma */}
              <div
                className="pfi-bg-layer"
                style={{
                  backgroundImage: `url(${scene3Bg})`,
                  opacity: opScene3,
                  display: opScene3 > 0 ? "block" : "none",
                }}
              />

              {/* Layer 4: Moonlit Landscape */}
              <div
                className="pfi-bg-layer"
                style={{
                  backgroundImage: `url(${scene6Bg})`,
                  opacity: opScene6,
                  display: opScene6 > 0 ? "block" : "none",
                }}
              />
            </div>

            {/* ATMOSPHERIC GRADIENTS & DYNAMIC LIGHTING */}
            <div className="pfi-vignette" />

            <div
              className="pfi-dynamic-lighting"
              style={{
                opacity: isPurpleLighting,
                background:
                  "radial-gradient(circle at center, rgba(157, 78, 221, 0.28) 0%, rgba(36, 0, 70, 0.55) 100%)",
              }}
            />
            <div
              className="pfi-dynamic-lighting"
              style={{
                opacity: isFurnaceLighting,
                background:
                  "radial-gradient(circle at 50% 68%, rgba(255, 107, 0, 0.5) 0%, rgba(255, 0, 110, 0.2) 65%, rgba(10, 0, 20, 0.7) 100%)",
              }}
            />
            <div
              className="pfi-dynamic-lighting"
              style={{
                opacity: isTwilightLighting,
                background:
                  "linear-gradient(180deg, rgba(74, 20, 140, 0.22) 0%, rgba(15, 5, 29, 0.65) 100%)",
              }}
            />

            {/* Volumetric God-Rays */}
            {time >= 7.6 && (
              <div
                className="pfi-god-rays"
                style={{
                  opacity: time >= 7.6 && time < 9.8 ? 0.9 : 0.6,
                }}
              />
            )}

            {/* Heat Wave */}
            {time >= 4.2 && time <= 6.4 && <div className="pfi-heat-wave" />}

            {/* Shockwave Ring */}
            {shockwaveOp > 0 && (
              <div
                className="pfi-shockwave-ring"
                style={{
                  width: `${160 * shockwaveScale}px`,
                  height: `${160 * shockwaveScale}px`,
                  opacity: shockwaveOp,
                }}
              />
            )}

            {/* Flash Burst */}
            {flashOpacity > 0 && (
              <div
                className="pfi-flash-burst"
                style={{
                  opacity: flashOpacity,
                }}
              />
            )}

            {/* Canvas Particles */}
            <canvas ref={canvasRef} className="pfi-particle-canvas" />

            {/* CONTINUOUS LOGO STAGE */}
            <div className="pfi-logo-stage">
              {/* GAMECRAFT Entity */}
              {showGameCraft && (
                <div
                  className="pfi-gamecraft-logo-entity"
                  style={{
                    transform: `translate3d(${gcX}px, ${gcY}px, 0) scale(${gcScale}) rotateX(${gcRotX}deg) rotateY(${gcRotY}deg) rotateZ(${gcRotZ}deg)`,
                    filter: `blur(${gcBlur}px)`,
                  }}
                >
                  <div
                    style={{
                      opacity: 1 - smoothstep(1.8, 2.5, time),
                      transform: `translateY(${Math.sin(time * 3) * -4}px)`,
                    }}
                  >
                    <PixelGamepadSvg />
                  </div>

                  <div
                    className="pfi-gamecraft-wordmark"
                    style={{
                      color:
                        gcHeatProg === 0
                          ? "#f3e8ff"
                          : gcHeatProg < 0.5
                          ? "#ffedd5"
                          : "#ffffff",
                      textShadow:
                        gcHeatProg === 0
                          ? `0 2px 0 #c084fc, 0 4px 0 #9333ea, 0 6px 0 #7e22ce, 0 8px 0 #581c87, 0 10px 0 #3b0764, 0 12px 0 #1e0338, 4px 14px 18px rgba(0, 0, 0, 0.85), 0 0 30px rgba(168, 85, 247, 0.75), 0 0 60px rgba(147, 51, 234, 0.5)`
                          : `0 2px 0 #fde047, 0 4px 0 #f97316, 0 6px 0 #ea580c, 0 8px 0 #c2410c, 0 10px 0 #7c2d12, 0 12px 0 #431407, 0 0 25px #ffedd5, 0 0 50px #fb923c, 0 0 80px #ea580c`,
                      filter:
                        gcHeatProg > 0
                          ? `brightness(${1.1 + gcHeatProg * 0.5}) contrast(${1.2 + gcHeatProg * 0.4})`
                          : "none",
                    }}
                  >
                    GAMECRAFT
                    {gcTrails > 0 && (
                      <div
                        className="pfi-speed-trails-overlay"
                        style={{ opacity: gcTrails * 0.8 }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* EXPLOSION VOXEL SHARDS */}
              {time >= 6.25 && time <= 7.6 && (
                <div className="pfi-voxel-explosion-container">
                  {explosionShards.map((shard) => {
                    const prog = (time - 6.25) / 1.35;
                    const curX =
                      shard.startX +
                      shard.targetX * Math.sin(prog * (Math.PI / 2));
                    const curY =
                      shard.startY +
                      shard.targetY * Math.sin(prog * (Math.PI / 2)) +
                      prog * prog * 40;
                    const curRot = shard.rotation + prog * shard.rotSpeed * 180;
                    const curOp = Math.max(0, 1 - prog * 1.2);

                    return (
                      <div
                        key={shard.id}
                        className="pfi-voxel-shard"
                        style={{
                          left: `calc(50% + ${curX}px)`,
                          top: `calc(50% + ${curY}px)`,
                          width: `${shard.size}px`,
                          height: `${shard.size}px`,
                          backgroundColor: shard.color,
                          opacity: curOp,
                          transform: `rotate(${curRot}deg)`,
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* PIXEL FORGE Identity */}
              {showPixelForge && (
                <div
                  className="pfi-pixelforge-logo-entity"
                  style={{
                    opacity: pfOpacity,
                    transform: `translate3d(0, ${pfY}px, 0) scale(${pfScale})`,
                  }}
                >
                  <CrossedHammersSvg />

                  <div className="pfi-word-pixel">PIXEL</div>
                  <div className="pfi-word-forge">FORGE</div>

                  <AnvilMotifSvg />

                  {time >= 9.8 && (
                    <motion.div
                      className="pfi-hackathon-subtitle"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      A GAME DEVELOPMENT HACKATHON
                    </motion.div>
                  )}

                  {time >= 9.8 && (
                    <motion.div
                      className="pfi-landing-actions"
                      initial={{ opacity: 0, scale: 0.9, y: 18 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.5 }}
                    >
                      <button
                        type="button"
                        className="pfi-enter-button"
                        onClick={handleEnterSite}
                      >
                        <span>Enter Site</span>
                        <span className="pfi-enter-arrow">→</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TOP CONTROLS */}
        <div className="pfi-controls">
          {time >= 9.8 && (
            <button
              type="button"
              className="pfi-util-btn"
              onClick={handleReplay}
              title="Replay cinematic sequence"
            >
              ↺ Replay
            </button>
          )}
        </div>

        {time < 9.8 && (
          <button
            type="button"
            className="pfi-skip-btn"
            onClick={handleSkip}
            aria-label="Skip cinematic introduction"
          >
            Skip Intro →
          </button>
        )}

        {/* TIMELINE INDICATOR BADGE */}
        <div className="pfi-scene-badge">
          <span>{getSceneLabel()}</span>
        </div>

        {/* SCENE 6 NAV */}
        {time >= 9.8 && (
          <motion.nav
            className="pfi-top-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <button
              type="button"
              className="pfi-nav-link"
              onClick={() => handleNavClick("about")}
            >
              About
            </button>
            <button
              type="button"
              className="pfi-nav-link"
              onClick={() => handleNavClick("schedule")}
            >
              Schedule
            </button>
            <button
              type="button"
              className="pfi-nav-link"
              onClick={() => {
                onComplete();
                window.location.href = "/registration";
              }}
            >
              Register
            </button>
          </motion.nav>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PixelForgeIntro;
