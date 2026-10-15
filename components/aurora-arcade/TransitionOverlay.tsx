"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================
 * TransitionOverlay — 8 creative transitions between the
 * title screen (DISCOVER ME) and the portfolio stage select.
 *
 * Each mode:
 *   1. Renders a full-screen fixed overlay (z-index 9999)
 *   2. Plays its animation
 *   3. Calls onSwap() at ~60% — parent swaps title→portfolio behind us
 *   4. Calls onComplete() at the end — parent removes the overlay
 * ============================================================ */

export type TransitionMode =
  | "crt"
  | "glitch"
  | "pixel"
  | "profile"
  | "coin"
  | "aurora"
  | "warp"
  | "terminal";

interface Props {
  mode: TransitionMode;
  onSwap: () => void;
  onComplete: () => void;
}

/* Durations (ms) and swap points (ms) for each mode */
const TIMING: Record<TransitionMode, { duration: number; swap: number }> = {
  crt:      { duration: 1800, swap: 1100 },
  glitch:   { duration: 1200, swap: 700 },
  pixel:    { duration: 1500, swap: 900 },
  profile:  { duration: 2200, swap: 1500 },
  coin:     { duration: 1800, swap: 1200 },
  aurora:   { duration: 1500, swap: 800 },
  warp:     { duration: 1600, swap: 1000 },
  terminal: { duration: 2400, swap: 1900 },
};

export default function TransitionOverlay({ mode, onSwap, onComplete }: Props) {
  const { duration, swap } = TIMING[mode];
  const swappedRef = useRef(false);

  useEffect(() => {
    const swapTimer = setTimeout(() => {
      swappedRef.current = true;
      onSwap();
    }, swap);
    const doneTimer = setTimeout(onComplete, duration);
    return () => {
      clearTimeout(swapTimer);
      clearTimeout(doneTimer);
    };
  }, [mode, swap, duration, onSwap, onComplete]);

  return (
    <div className={`ga-transition ga-tr-${mode}`}>
      {mode === "crt" && <CRTTransition />}
      {mode === "glitch" && <GlitchTransition />}
      {mode === "pixel" && <PixelTransition />}
      {mode === "profile" && <ProfileTransition />}
      {mode === "coin" && <CoinTransition />}
      {mode === "aurora" && <AuroraTransition />}
      {mode === "warp" && <WarpTransition />}
      {mode === "terminal" && <TerminalTransition />}
    </div>
  );
}

/* ── 1. CRT Power-On ── */
function CRTTransition() {
  return (
    <div className="ga-tr-crt-screen">
      <div className="ga-tr-crt-line" />
      <div className="ga-tr-crt-scanlines" />
      <div className="ga-tr-crt-flash" />
    </div>
  );
}

/* ── 2. Glitch Teleport ── */
function GlitchTransition() {
  return (
    <div className="ga-tr-glitch-wrap">
      <div className="ga-tr-glitch-bar ga-tr-glitch-r" />
      <div className="ga-tr-glitch-bar ga-tr-glitch-g" />
      <div className="ga-tr-glitch-bar ga-tr-glitch-b" />
      <div className="ga-tr-glitch-noise" />
      <div className="ga-tr-glitch-flash" />
    </div>
  );
}

/* ── 3. Pixel Dematerialize ── */
function PixelTransition() {
  const cols = 24;
  const rows = 14;
  const pixels = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const delay = (Math.abs(c - cols / 2) + Math.abs(r - rows / 2)) * 25;
      pixels.push(
        <div
          key={`${r}-${c}`}
          className="ga-tr-pixel-cell"
          style={{
            animationDelay: `${delay}ms`,
            backgroundPosition: `${(c / (cols - 1)) * 100}% ${(r / (rows - 1)) * 100}%`,
          }}
        />,
      );
    }
  }
  return <div className="ga-tr-pixel-grid">{pixels}</div>;
}

/* ── 4. Profile Reveal ── */
function ProfileTransition() {
  return (
    <div className="ga-tr-profile-wrap">
      <div className="ga-tr-profile-ring ga-tr-profile-ring-1" />
      <div className="ga-tr-profile-ring ga-tr-profile-ring-2" />
      <div className="ga-tr-profile-ring ga-tr-profile-ring-3" />
      <img
        className="ga-tr-profile-img"
        src="/profile.jpg"
        alt="Profile"
        draggable={false}
      />
      <div className="ga-tr-profile-glow" />
    </div>
  );
}

/* ── 5. Insert Coin ── */
function CoinTransition() {
  return (
    <div className="ga-tr-coin-wrap">
      <div className="ga-tr-coin-text">INSERT COIN</div>
      <div className="ga-tr-coin-coin">¢</div>
      <div className="ga-tr-coin-boot">
        <span className="ga-tr-coin-line">SYSTEM ONLINE</span>
        <span className="ga-tr-coin-line">LOADING PORTFOLIO...</span>
        <span className="ga-tr-coin-line">READY</span>
      </div>
      <div className="ga-tr-coin-flash" />
    </div>
  );
}

/* ── 6. Aurora Curtain ── */
function AuroraTransition() {
  return (
    <div className="ga-tr-aurora-wrap">
      <div className="ga-tr-aurora-wave ga-tr-aurora-wave-1" />
      <div className="ga-tr-aurora-wave ga-tr-aurora-wave-2" />
      <div className="ga-tr-aurora-wave ga-tr-aurora-wave-3" />
      <div className="ga-tr-aurora-edge" />
    </div>
  );
}

/* ── 7. Hyperspace Warp ── */
function WarpTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const cx = W / 2;
    const cy = H / 2;

    interface Star { x: number; y: number; z: number; pz: number; }
    const stars: Star[] = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: (Math.random() - 0.5) * W,
        y: (Math.random() - 0.5) * H,
        z: Math.random() * W,
        pz: 0,
      });
    }

    let raf: number;
    let speed = 2;
    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      // Accelerate then flash
      speed = 2 + (elapsed / 1000) * 30;

      ctx.fillStyle = "rgba(8, 8, 26, 0.3)";
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;
        if (s.z < 1) {
          s.z = W;
          s.x = (Math.random() - 0.5) * W;
          s.y = (Math.random() - 0.5) * H;
          s.pz = s.z;
        }

        const sx = (s.x / s.z) * W + cx;
        const sy = (s.y / s.z) * H + cy;
        const psx = (s.x / s.pz) * W + cx;
        const psy = (s.y / s.pz) * H + cy;

        const r = Math.max(0.5, (1 - s.z / W) * 3);

        // Color shift based on position — aurora palette
        const hue = elapsed < 800 ? 180 + (s.x / W) * 60 : 260 + (s.y / H) * 40;
        ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${1 - s.z / W})`;
        ctx.lineWidth = r;
        ctx.beginPath();
        ctx.moveTo(psx, psy);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="ga-tr-warp-wrap">
      <canvas ref={canvasRef} className="ga-tr-warp-canvas" />
      <div className="ga-tr-warp-flash" />
    </div>
  );
}

/* ── 8. Boot Terminal ── */
function TerminalTransition() {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const bootLines = [
      "BOOTING PORTFOLIO OS v2.6...",
      "  CPU: ARM Cortex-A78 ✓",
      "  MEMORY: 32GB DDR5 ✓",
      "  GPU: Glassmorphism Engine ✓",
      "MOUNTING /career ...",
      "MOUNTING /skills ...",
      "MOUNTING /projects ...",
      "LOADING ACHIEVEMENTS ...",
      "CALIBRATING AURORA DISPLAY ...",
      "",
      "PORTFOLIO READY.",
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < bootLines.length) {
        setLines((prev) => [...prev, bootLines[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 160);

    // Progress bar
    const progInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progInterval);
          return 100;
        }
        return p + 3;
      });
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div className="ga-tr-terminal-wrap">
      <div className="ga-tr-terminal-screen">
        {lines.map((line, i) => (
          <div key={i} className="ga-tr-terminal-line">
            {line || "\u00a0"}
          </div>
        ))}
        <div className="ga-tr-terminal-progress">
          <div className="ga-tr-terminal-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="ga-tr-terminal-pct">{progress}%</div>
      </div>
    </div>
  );
}
