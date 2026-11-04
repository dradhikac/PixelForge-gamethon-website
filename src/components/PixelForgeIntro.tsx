import React, { useEffect, useRef } from "react";
import "./PixelForgeIntro.css";

export interface PixelForgeIntroProps {
  onComplete?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

interface Particle {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  size: number;
  delay: number;
  color: string;
}

const PARTICLE_GAP = 7;
const MAX_PARTICLES = 2600;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const smoothStep = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const easeInOut = (value: number) => {
  const t = clamp(value, 0, 1);
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

function getTextPoints(
  text: string,
  width: number,
  height: number,
  fontSize: number
) {
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;

  const context = offscreen.getContext("2d");
  if (!context) return [];

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `900 ${fontSize}px "Press Start 2P", "Courier New", monospace`;

  context.fillText(text, width / 2, height / 2);

  const pixels = context.getImageData(0, 0, width, height).data;
  const points: { x: number; y: number }[] = [];

  for (let y = 0; y < height; y += PARTICLE_GAP) {
    for (let x = 0; x < width; x += PARTICLE_GAP) {
      const alpha = pixels[(y * width + x) * 4 + 3];

      if (alpha > 100) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

function buildParticles(
  source: { x: number; y: number }[],
  target: { x: number; y: number }[]
): Particle[] {
  const count = Math.min(
    MAX_PARTICLES,
    Math.max(source.length, target.length)
  );

  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const sourceIndex = Math.floor(
      (i / count) * source.length
    );

    const targetIndex = Math.floor(
      (i / count) * target.length
    );

    const start = source[sourceIndex % source.length];
    const end = target[targetIndex % target.length];

    if (!start || !end) continue;

    particles.push({
      sx: start.x,
      sy: start.y,
      tx: end.x,
      ty: end.y,
      size: 4.2,
      delay: ((i * 37) % 100) / 100 * 0.12,
      color: i % 9 === 0 ? "#ffca05" : "#ffffff",
    });
  }

  return particles;
}

const PixelForgeIntro: React.FC<PixelForgeIntroProps> = ({
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
    });
    if (!ctx) return;
    const context: CanvasRenderingContext2D = ctx;

    let animationFrame = 0;
    let completed = false;
    let disposed = false;

    const startTime = performance.now();

    const INTRO_HOLD = 1000;
    const TRANSFORM_DURATION = 2300;
    const FINAL_HOLD = 1000;
    const EXIT_DURATION = 500;

    const TOTAL_DURATION =
      INTRO_HOLD +
      TRANSFORM_DURATION +
      FINAL_HOLD +
      EXIT_DURATION;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let reducedMotion = false;

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    reducedMotion = mediaQuery.matches;

    const resize = () => {
      if (disposed) return;

      const rect = canvas.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const logicalWidth = 1200;
      const logicalHeight = 400;

      const scale = Math.min(
        width / logicalWidth,
        height / logicalHeight
      );

      const offWidth = logicalWidth;
      const offHeight = logicalHeight;

      const sourceFontSize = 66 * scale;
      const targetFontSize = 68 * scale;

      const source = getTextPoints(
        "GAMECRAFT",
        offWidth,
        offHeight,
        Math.max(24, sourceFontSize)
      );

      const target = getTextPoints(
        "PIXEL FORGE",
        offWidth,
        offHeight,
        Math.max(24, targetFontSize)
      );

      const offsetX = (width - logicalWidth * scale) / 2;
      const offsetY = (height - logicalHeight * scale) / 2;

      particles = buildParticles(source, target).map((p) => ({
        ...p,
        sx: offsetX + p.sx * scale,
        sy: offsetY + p.sy * scale,
        tx: offsetX + p.tx * scale,
        ty: offsetY + p.ty * scale,
        size: Math.max(2.2, 4.2 * scale),
      }));
    };

    const draw = (now: number) => {
      if (disposed) return;

      const elapsed = now - startTime;

      context.fillStyle = "#10051e";
      context.fillRect(0, 0, width, height);

      if (reducedMotion) {
        drawTitle("PIXEL FORGE");
        finish();
        return;
      }

      if (elapsed < INTRO_HOLD) {
        drawTitle("GAMECRAFT");

      } else if (elapsed < INTRO_HOLD + TRANSFORM_DURATION) {
        const rawProgress =
          (elapsed - INTRO_HOLD) / TRANSFORM_DURATION;

        const progress = easeInOut(rawProgress);

        // Keep the same particles moving from the
        // GAMECRAFT letter positions to PIXEL FORGE.

        particles.forEach((particle, index) => {
          const localProgress = smoothStep(
            clamp(
              (rawProgress - particle.delay) /
                (1 - particle.delay),
              0,
              1
            )
          );

          // Gentle outward movement during the middle
          // of the transition, then a smooth return.

          const wave = Math.sin(localProgress * Math.PI);
          const direction = index % 2 === 0 ? 1 : -1;

          const driftX = direction * wave * 13;
          const driftY =
            Math.sin(index * 0.75) * wave * 10;

          const x =
            particle.sx +
            (particle.tx - particle.sx) * localProgress +
            driftX;

          const y =
            particle.sy +
            (particle.ty - particle.sy) * localProgress +
            driftY;

          const particleOpacity =
            rawProgress < 0.12
              ? 0.5 + rawProgress * 4
              : 1;

          context.globalAlpha = particleOpacity;
          context.fillStyle = particle.color;

          context.fillRect(
            Math.round(x),
            Math.round(y),
            particle.size,
            particle.size
          );
        });

        context.globalAlpha = 1;

        // A subtle gold highlight accompanies the motion.
        const sweepX = width * progress;

        const gradient = context.createLinearGradient(
          sweepX - 35,
          0,
          sweepX + 35,
          0
        );

        gradient.addColorStop(0, "rgba(255,202,5,0)");
        gradient.addColorStop(0.5, "rgba(255,202,5,0.16)");
        gradient.addColorStop(1, "rgba(255,202,5,0)");

        context.fillStyle = gradient;
        context.fillRect(sweepX - 35, 0, 70, height);

      } else if (
        elapsed <
        INTRO_HOLD + TRANSFORM_DURATION + FINAL_HOLD
      ) {
        drawTitle("PIXEL FORGE");

      } else {
        const exitProgress = clamp(
          (
            elapsed -
            INTRO_HOLD -
            TRANSFORM_DURATION -
            FINAL_HOLD
          ) / EXIT_DURATION,
          0,
          1
        );

        context.globalAlpha = 1 - smoothStep(exitProgress);
        drawTitle("PIXEL FORGE");
        context.globalAlpha = 1;

        canvas.style.opacity = String(
          1 - smoothStep(exitProgress)
        );
      }

      if (elapsed >= TOTAL_DURATION) {
        finish();
        return;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    function drawTitle(text: string) {
      if (!context) return;
      context.save();

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font =
        `900 ${Math.min(width * 0.075, 76)}px ` +
        `"Press Start 2P", "Courier New", monospace`;

      context.fillStyle = "#ffffff";

      if (text === "GAMECRAFT") {
        context.fillText(text, width / 2, height / 2);
      } else {
        const parts = [
          { text: "PIXEL", color: "#ffffff" },
          { text: "FORGE", color: "#ffca05" },
        ];

        const spacing = Math.min(width * 0.075, 76) * 0.13;
        const widths = parts.map(
          (part) => context.measureText(part.text).width
        );

        const totalWidth =
          widths[0] + widths[1] + spacing;

        let x = width / 2 - totalWidth / 2;

        parts.forEach((part, index) => {
          context.textAlign = "left";
          context.fillStyle = part.color;
          context.fillText(
            part.text,
            x,
            height / 2
          );
          x += widths[index] + spacing;
        });
      }

      context.restore();
    }

    function finish() {
      if (completed) return;

      completed = true;
      cancelAnimationFrame(animationFrame);

      if (!disposed) {
        onComplete?.();
      }
    }

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    animationFrame = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [onComplete]);

  return (
    <div className="pf-intro">
      <canvas
        ref={canvasRef}
        className="pf-intro-canvas"
        aria-label="GAMECRAFT transforms into PIXEL FORGE"
        role="img"
      />
      <button
        type="button"
        className="pf-intro-skip-btn"
        onClick={() => onComplete?.()}
        aria-label="Skip intro animation"
      >
        Skip ✕
      </button>
    </div>
  );
};

export default PixelForgeIntro;
