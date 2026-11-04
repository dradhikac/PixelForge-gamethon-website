import React, { useEffect, useRef } from "react";
import "./PixelForgeIntro.css";

export interface PixelForgeIntroProps {
  onComplete?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const FONT = '"Press Start 2P", "Courier New", monospace';
const BG = "#10051e";
const TAGLINE = "FORGE YOUR IDEAS. BUILD WHAT\u2019S NEXT.";

// Phase lengths in ms. Tweak these to speed up / slow down the intro.
const T = {
  assemble: 750, // GAMECRAFT pixels fly in
  hold: 800, // GAMECRAFT sits, gold light sweeps across
  shatter: 650, // pixels burst apart
  form: 1500, // pixels swirl into PIXEL FORGE
  punch: 800, // forge impact: flash, shockwave, embers, tagline
  hold2: 450, // PIXEL FORGE rests
  exit: 900, // pixel-dissolve reveals the website
};

const A = T.assemble;
const B = A + T.hold;
const C = B + T.shatter;
const D = C + T.form;
const EXIT_START = D + T.punch + T.hold2;
const TOTAL = EXIT_START + T.exit;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const clamp = (v: number, lo = 0, hi = 1) => Math.min(Math.max(v, lo), hi);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const easeInCubic = (v: number) => Math.pow(clamp(v), 3);
const easeInOutCubic = (v: number) => {
  const t = clamp(v);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// 9-step palette white -> gold so colour can be blended without allocations.
const PALETTE: string[] = Array.from({ length: 9 }, (_, i) => {
  const t = i / 8;
  return `rgb(${Math.round(lerp(255, 255, t))},${Math.round(
    lerp(255, 202, t)
  )},${Math.round(lerp(255, 5, t))})`;
});

interface Pt {
  x: number;
  y: number;
}

interface Particle {
  sx: number; // GAMECRAFT position
  sy: number;
  tx: number; // PIXEL FORGE position
  ty: number;
  ox: number; // scattered start for the assemble phase
  oy: number;
  bx: number; // burst position
  by: number;
  d1: number; // assemble delay
  d2: number; // form delay
  r: number; // random 0..1
  sw: number; // swirl amplitude
  c0: number; // start colour (0 white, 1 gold)
  c1: number; // end colour
}

interface Spark {
  ox: number;
  oy: number;
  ang: number;
  sp: number;
  size: number;
  life: number;
  gold: boolean;
}

type Ctx2D = CanvasRenderingContext2D & {
  letterSpacing?: string;
  filter?: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const PixelForgeIntro: React.FC<PixelForgeIntroProps> = ({ onComplete }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d") as Ctx2D | null;
    if (!ctx) return;
    const c2d: Ctx2D = ctx;

    let disposed = false;
    let done = false;
    let ready = false;
    let started = false;
    let raf = 0;
    let t0 = 0;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      onCompleteRef.current?.();
    };

    // Reduced motion: don't animate at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(finish, 0);
      return () => {
        window.clearTimeout(id);
        document.body.style.overflow = prevOverflow;
      };
    }

    /* ---------------- scene state (rebuilt on resize) ---------------- */
    let W = 0;
    let H = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let F = 64; // font size
    let step = 4; // particle cell size (F / 16 = half a glyph pixel)
    let size = 4; // drawn particle size
    let particles: Particle[] = [];
    let sparks: Spark[] = [];
    let minSx = 0;
    let spanS = 1;
    let bg: HTMLCanvasElement | null = null;
    let glow: HTMLCanvasElement | null = null;
    let cs = 64; // dissolve cell size
    let cols = 0;
    let rows = 0;
    let thr = new Float32Array(0);

    const sample = (text: string): Pt[] => {
      const bandH = Math.ceil(F * 1.6);
      const off = document.createElement("canvas");
      off.width = W;
      off.height = bandH;
      const c = off.getContext("2d", { willReadFrequently: true });
      if (!c) return [];
      c.font = `${F}px ${FONT}`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = "#fff";
      c.fillText(text, W / 2, bandH / 2);
      const d = c.getImageData(0, 0, W, bandH).data;

      let minX = W;
      let maxX = -1;
      let minY = bandH;
      let maxY = -1;
      for (let y = 0; y < bandH; y++) {
        for (let x = 0; x < W; x++) {
          if (d[(y * W + x) * 4 + 3] > 128) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < minX) return [];

      const top = cy - bandH / 2;
      const pts: Pt[] = [];
      for (let y = minY + step / 2; y <= maxY + 1; y += step) {
        for (let x = minX + step / 2; x <= maxX + 1; x += step) {
          if (d[(Math.floor(y) * W + Math.floor(x)) * 4 + 3] > 128) {
            pts.push({ x: x - step / 2, y: y - step / 2 + top });
          }
        }
      }
      return pts;
    };

    const buildBackground = () => {
      const b = document.createElement("canvas");
      b.width = Math.round(W * dpr);
      b.height = Math.round(H * dpr);
      const g = b.getContext("2d");
      if (!g) return;
      g.scale(dpr, dpr);
      g.fillStyle = BG;
      g.fillRect(0, 0, W, H);

      const rg = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
      rg.addColorStop(0, "#2b0f52");
      rg.addColorStop(0.55, "#170733");
      rg.addColorStop(1, "#0b0315");
      g.fillStyle = rg;
      g.fillRect(0, 0, W, H);

      const gs = Math.max(32, Math.round(Math.max(W, H) / 30));
      g.strokeStyle = "rgba(168,85,247,0.07)";
      g.lineWidth = 1;
      g.beginPath();
      for (let x = 0.5; x < W; x += gs) {
        g.moveTo(x, 0);
        g.lineTo(x, H);
      }
      for (let y = 0.5; y < H; y += gs) {
        g.moveTo(0, y);
        g.lineTo(W, y);
      }
      g.stroke();

      // A few faint "dead pixel" blocks snapped to the grid.
      for (let i = 0; i < 46; i++) {
        const gx = Math.floor(Math.random() * (W / gs));
        const gy = Math.floor(Math.random() * (H / gs));
        g.fillStyle = `rgba(139,92,246,${0.04 + Math.random() * 0.07})`;
        g.fillRect(gx * gs + 1, gy * gs + 1, gs - 1, gs - 1);
      }
      bg = b;
    };

    const buildGlow = () => {
      glow = null;
      const probe = document.createElement("canvas").getContext("2d") as Ctx2D | null;
      if (!probe || typeof probe.filter !== "string") return; // e.g. old Safari
      const g = document.createElement("canvas");
      g.width = W;
      g.height = H;
      const c = g.getContext("2d") as Ctx2D | null;
      if (!c) return;
      c.font = `${F}px ${FONT}`;
      c.textBaseline = "middle";
      c.textAlign = "left";
      const wP = c.measureText("PIXEL ").width;
      const wF = c.measureText("FORGE").width;
      const left = W / 2 - (wP + wF) / 2;
      c.filter = `blur(${Math.max(8, F * 0.2)}px)`;
      for (let i = 0; i < 2; i++) {
        c.fillStyle = "rgba(168,85,247,0.9)";
        c.fillText("PIXEL", left, cy);
        c.fillStyle = "rgba(255,190,0,1)";
        c.fillText("FORGE", left + wP, cy);
      }
      glow = g;
    };

    const buildParticles = () => {
      const byXY = (a: Pt, b: Pt) => a.x - b.x || a.y - b.y;
      const S = sample("GAMECRAFT").sort(byXY);
      const Tg = sample("PIXEL FORGE").sort(byXY);
      if (!S.length || !Tg.length) {
        particles = [];
        return;
      }
      const n = Math.max(S.length, Tg.length);
      minSx = S[0].x;
      spanS = Math.max(1, S[S.length - 1].x - minSx);
      const minTx = Tg[0].x;
      const spanT = Math.max(1, Tg[Tg.length - 1].x - minTx);
      const splitX = minTx + F * 5.5; // between "PIXEL" and "FORGE"

      const out: Particle[] = [];
      for (let i = 0; i < n; i++) {
        const s = S[Math.floor((i * S.length) / n)];
        const t = Tg[Math.floor((i * Tg.length) / n)];
        const ang = Math.random() * Math.PI * 2;
        const dist = F * (0.5 + Math.random() * 1.6);
        out.push({
          sx: s.x,
          sy: s.y,
          tx: t.x,
          ty: t.y,
          ox: s.x + (Math.random() - 0.5) * F * 1.3,
          oy: s.y + (Math.random() - 0.5) * F * 2.4,
          bx: clamp(s.x + (s.x - cx) * 0.18 + Math.cos(ang) * dist, -20, W + 20),
          by: clamp(s.y + (s.y - cy) * 0.3 + Math.sin(ang) * dist * 0.8, -20, H + 20),
          d1: ((s.x - minSx) / spanS) * 0.45,
          d2: ((t.x - minTx) / spanT) * 0.35 + Math.random() * 0.05,
          r: Math.random(),
          sw: (Math.random() - 0.5) * F * 1.2,
          c0: i % 11 === 0 ? 1 : 0,
          c1: t.x >= splitX ? 1 : 0,
        });
      }
      particles = out;
    };

    const buildSparks = () => {
      const list: Spark[] = [];
      for (let i = 0; i < 44; i++) {
        list.push({
          ox: cx + (Math.random() - 0.5) * F * 7,
          oy: cy + (Math.random() - 0.3) * F * 0.5,
          ang: -Math.PI / 2 + (Math.random() - 0.5) * 2.6,
          sp: F * (1.5 + Math.random() * 5),
          size: Math.max(2, Math.round(step * (0.5 + Math.random() * 0.7))),
          life: 0.5 + Math.random() * 0.5,
          gold: Math.random() > 0.3,
        });
      }
      sparks = list;
    };

    const buildCells = () => {
      cs = Math.round(clamp(Math.max(W, H) / 22, 36, 90));
      cols = Math.ceil(W / cs);
      rows = Math.ceil(H / cs);
      thr = new Float32Array(cols * rows);
      const maxD = Math.hypot(cols / 2, rows / 2);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const d = Math.hypot(c + 0.5 - cols / 2, r + 0.5 - rows / 2) / maxD;
          thr[r * cols + c] = (d * 0.65 + Math.random() * 0.25) * 0.8;
        }
      }
    };

    const layout = () => {
      if (disposed || !ready) return;
      const rect = root.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      c2d.setTransform(dpr, 0, 0, dpr, 0, 0);

      cx = W / 2;
      cy = H * 0.46;
      const F0 = Math.min((W * 0.86) / 11, 104);
      step = Math.max(1.5, F0 / 16);
      F = step * 16;
      size = Math.ceil(step);

      buildBackground();
      buildParticles();
      buildGlow();
      buildSparks();
      buildCells();
    };

    /* ---------------------------- drawing ---------------------------- */

    const drawParticles = (e: number, gAlpha: number) => {
      let lastC = -1;
      let lastA = -1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let x = p.tx;
        let y = p.ty;
        let a = 1;
        let m = p.c1;

        if (e < A) {
          const u = e / A;
          const lp = easeOutCubic((u - p.d1) / (1 - p.d1));
          x = lerp(p.ox, p.sx, lp);
          y = lerp(p.oy, p.sy, lp);
          a = lp;
          m = p.c0;
        } else if (e < B) {
          x = p.sx;
          y = p.sy;
          m = p.c0;
          const u = (e - A) / T.hold;
          const sweepX = minSx - F + u * (spanS + 2 * F);
          if (Math.abs(p.sx - sweepX) < F * 0.45) m = 1;
          if (e > B - 160) {
            // anticipation tremble right before the burst
            x += Math.sin(i * 12.9898 + e * 0.08) * 1.6;
            y += Math.cos(i * 7.233 + e * 0.09) * 1.6;
            m = p.c0;
          }
        } else if (e < C) {
          const u = (e - B) / T.shatter;
          const d = p.r * 0.3;
          const lp = easeOutCubic((u - d) / (1 - d));
          x = lerp(p.sx, p.bx, lp);
          y = lerp(p.sy, p.by, lp);
          m = p.c0;
        } else if (e < D) {
          const u = (e - C) / T.form;
          const lp = easeInOutCubic((u - p.d2) / (1 - p.d2));
          const sw = Math.sin(lp * Math.PI) * p.sw;
          x = lerp(p.bx, p.tx, lp) + sw * 0.4;
          y = lerp(p.by, p.ty, lp) + sw;
          m = lerp(p.c0, p.c1, lp);
        }

        const alpha = a * gAlpha;
        if (alpha <= 0.01) continue;
        if (alpha !== lastA) {
          c2d.globalAlpha = alpha;
          lastA = alpha;
        }
        const ci = Math.round(m * 8);
        if (ci !== lastC) {
          c2d.fillStyle = PALETTE[ci];
          lastC = ci;
        }
        c2d.fillRect(Math.round(x), Math.round(y), size, size);
      }
      c2d.globalAlpha = 1;
    };

    const drawTagline = (e: number, g: number) => {
      const start = D + T.punch * 0.25;
      if (e < start) return;
      const u = smooth((e - start) / (T.punch * 0.6));
      const fs = Math.max(11, Math.min(F * 0.24, 26));
      const ty = cy + F * 1.1 + (1 - u) * 12;

      c2d.save();
      c2d.globalAlpha = u * g;
      c2d.font = `600 ${fs}px "Space Grotesk", -apple-system, sans-serif`;
      c2d.textAlign = "center";
      c2d.textBaseline = "middle";
      c2d.letterSpacing = `${Math.round(fs * 0.16)}px`;
      c2d.fillStyle = "#e9d5ff";
      c2d.fillText(TAGLINE, cx, ty);
      const rw = Math.min(W * 0.5, F * 5) * u;
      c2d.fillStyle = "rgba(255,202,5,0.85)";
      c2d.fillRect(Math.round(cx - rw / 2), Math.round(ty + fs * 1.4), Math.round(rw), 2);
      c2d.restore();
    };

    const drawImpact = (e: number) => {
      if (e < D) return;
      const u = (e - D) / T.punch;

      // soft flash
      if (u < 0.35) {
        const a = 0.45 * Math.pow(1 - u / 0.35, 2);
        const g = c2d.createRadialGradient(cx, cy, 0, cx, cy, F * 6);
        g.addColorStop(0, `rgba(255,230,140,${a})`);
        g.addColorStop(1, "rgba(255,230,140,0)");
        c2d.fillStyle = g;
        c2d.fillRect(0, 0, W, H);
      }

      // two square shockwave rings
      for (let k = 0; k < 2; k++) {
        const uu = clamp((u - k * 0.12) / 0.9);
        if (uu <= 0 || uu >= 1) continue;
        const half = easeOutCubic(uu) * Math.max(W, H) * 0.55;
        c2d.strokeStyle =
          k === 0
            ? `rgba(255,202,5,${0.7 * (1 - uu)})`
            : `rgba(196,150,255,${0.5 * (1 - uu)})`;
        c2d.lineWidth = Math.max(2, Math.round(step));
        c2d.strokeRect(
          Math.round(cx - half),
          Math.round(cy - half * 0.32),
          Math.round(half * 2),
          Math.round(half * 0.64)
        );
      }

      // embers
      const t = (e - D) / 1000;
      const gravity = F * 5;
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        if (t > s.life) continue;
        const x = s.ox + Math.cos(s.ang) * s.sp * t;
        const y = s.oy + Math.sin(s.ang) * s.sp * t + gravity * t * t;
        c2d.globalAlpha = 1 - t / s.life;
        c2d.fillStyle = s.gold ? "#ffca05" : "#ffffff";
        c2d.fillRect(Math.round(x), Math.round(y), s.size, s.size);
      }
      c2d.globalAlpha = 1;
    };

    const drawReveal = (e: number) => {
      if (!bg) return;
      const p = clamp((e - EXIT_START) / T.exit);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = 1 - smooth((p - thr[r * cols + c]) / 0.25);
          if (a <= 0.02) continue;
          const s = cs * a;
          const x = c * cs + (cs - s) / 2;
          const y = r * cs + (cs - s) / 2;
          c2d.drawImage(bg, x * dpr, y * dpr, s * dpr, s * dpr, x, y, s, s);
        }
      }
    };

    const render = (e: number) => {
      if (!bg) return;
      const inExit = e >= EXIT_START;
      const trails = e >= B && e < D;

      c2d.globalAlpha = 1;

      // ---- background ----
      if (inExit) {
        c2d.clearRect(0, 0, W, H);
        drawReveal(e);
      } else if (trails) {
        // Partial redraw leaves soft motion trails behind moving pixels.
        c2d.globalAlpha = 0.38;
        c2d.drawImage(bg, 0, 0, W, H);
        c2d.globalAlpha = 1;
      } else {
        c2d.drawImage(bg, 0, 0, W, H);
        const g = c2d.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.6);
        const pulse = 0.1 + 0.04 * Math.sin(e / 500);
        g.addColorStop(0, `rgba(124,58,237,${pulse})`);
        g.addColorStop(1, "rgba(124,58,237,0)");
        c2d.fillStyle = g;
        c2d.fillRect(0, 0, W, H);
      }

      // ---- title group (particles, glow, tagline) ----
      let scale = 1;
      let gAlpha = 1;
      if (inExit) {
        const p = clamp((e - EXIT_START) / T.exit);
        gAlpha = 1 - smooth(p / 0.45);
        scale = 1 + 0.1 * easeInCubic(p);
      } else if (e >= D) {
        const u = (e - D) / T.punch;
        scale = 1 + 0.05 * (1 - easeOutCubic(u * 1.4));
      }

      if (gAlpha > 0.005) {
        c2d.save();
        c2d.translate(cx, cy);
        c2d.scale(scale, scale);
        c2d.translate(-cx, -cy);

        if (glow && e >= D - 500) {
          const ga = smooth((e - (D - 500)) / 1000) * 0.85 * (1 + 0.08 * Math.sin(e / 260));
          c2d.globalCompositeOperation = "lighter";
          c2d.globalAlpha = ga * gAlpha;
          c2d.drawImage(glow, 0, 0, W, H);
          c2d.globalCompositeOperation = "source-over";
          c2d.globalAlpha = 1;
        }

        drawParticles(e, gAlpha);
        drawTagline(e, gAlpha);
        c2d.restore();
      }

      if (!inExit) drawImpact(e);
    };

    /* ----------------------------- loop ----------------------------- */

    const frame = (now: number) => {
      if (disposed) return;
      if (!started) {
        started = true;
        t0 = now;
        root.style.background = "transparent";
      }
      const e = now - t0;
      render(e);
      if (e >= TOTAL) {
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    skipRef.current = () => {
      if (!started) {
        finish();
        return;
      }
      const e = performance.now() - t0;
      if (e < EXIT_START) {
        t0 = performance.now() - EXIT_START; // jump straight to the dissolve
      } else {
        finish();
      }
    };

    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") skipRef.current();
    };
    window.addEventListener("keydown", onKey);

    const observer = new ResizeObserver(() => layout());
    observer.observe(root);

    // Wait for the pixel font so the sampled glyph shapes are correct.
    const fontsApi = document.fonts;
    const fontLoad: Promise<unknown> = fontsApi
      ? Promise.all([
          fontsApi.load('32px "Press Start 2P"', "GAMECRAFT PIXEL FORGE"),
          fontsApi.load('600 16px "Space Grotesk"'),
        ]).catch(() => undefined)
      : Promise.resolve();
    const timeout = new Promise((res) => window.setTimeout(res, 1500));

    Promise.race([fontLoad, timeout]).then(() => {
      if (disposed) return;
      ready = true;
      layout();
      raf = requestAnimationFrame(frame);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div className="pf-intro" ref={rootRef}>
      <canvas
        ref={canvasRef}
        className="pf-intro-canvas"
        role="img"
        aria-label="GAMECRAFT breaks into pixels and forms PIXEL FORGE"
      />
      <button
        type="button"
        className="pf-intro-skip-btn"
        onClick={() => skipRef.current()}
        aria-label="Skip intro animation"
      >
        Skip ✕
      </button>
    </div>
  );
};

export default PixelForgeIntro;