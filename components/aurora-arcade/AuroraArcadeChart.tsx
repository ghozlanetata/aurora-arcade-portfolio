"use client";

import { useEffect, useRef, useState } from "react";

/* ── Chart configuration ────────────────────────────────────────── */

const VB_W = 820;
const VB_H = 400;
const PAD = { left: 60, right: 30, top: 30, bottom: 50 };
const PLOT_W = VB_W - PAD.left - PAD.right;
const PLOT_H = VB_H - PAD.top - PAD.bottom;
const YEAR_MIN = 2018;
const YEAR_MAX = 2027;
const YEAR_RANGE = YEAR_MAX - YEAR_MIN;

interface ChartPoint {
  year: number;
  scope: number;
  name: string;
  role: string;
  period: string;
}

const CHART_POINTS: ChartPoint[] = [
  { year: 2018,   scope: 10, name: "Baccalaureate",   role: "Mathematics",        period: "2015–2018" },
  { year: 2021,   scope: 25, name: "Bachelor's",      role: "Telecommunications", period: "2018–2021" },
  { year: 2022.4, scope: 35, name: "Algeria Telecom", role: "Network Intern",     period: "Jun–Aug 2022" },
  { year: 2023.2, scope: 50, name: "Ericsson",        role: "Intern + MSc",       period: "Feb–Jun 2023" },
  { year: 2023.9, scope: 60, name: "Coca-Cola",       role: "IT Support",         period: "Dec 2023–Apr 2024" },
  { year: 2024.3, scope: 85, name: "Huawei",          role: "Software Engineer",  period: "Apr 2024–Present" },
  { year: 2026.6, scope: 95, name: "CKA Certified",   role: "K8s Admin",          period: "Aug 2026" },
];

interface LabelCfg { dy: number; anchor: "start" | "middle" | "end" }
const LABEL_CFG: LabelCfg[] = [
  { dy: 20,  anchor: "start" },
  { dy: 20,  anchor: "start" },
  { dy: 20,  anchor: "start" },
  { dy: -18, anchor: "start" },
  { dy: 22,  anchor: "start" },
  { dy: -16, anchor: "start" },
  { dy: -16, anchor: "end"   },
];

/* ── Coordinate helpers ─────────────────────────────────────────── */

function toX(year: number): number {
  return PAD.left + ((year - YEAR_MIN) / YEAR_RANGE) * PLOT_W;
}
function toY(scope: number): number {
  return PAD.top + PLOT_H - (scope / 100) * PLOT_H;
}

/* ── Catmull-Rom → cubic Bézier smooth path ─────────────────────── */

interface Pt { x: number; y: number }

function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/* ── Component ──────────────────────────────────────────────────── */

export default function AuroraArcadeChart() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setAnimate(true);
      return;
    }
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setAnimate(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const pts: Pt[] = CHART_POINTS.map((p) => ({ x: toX(p.year), y: toY(p.scope) }));
  const lineD = smoothPath(pts);
  const bottomY = PAD.top + PLOT_H;
  const areaD = `${lineD} L ${pts[pts.length - 1].x.toFixed(1)} ${bottomY} L ${pts[0].x.toFixed(1)} ${bottomY} Z`;

  const yTicks = [0, 25, 50, 75, 100];
  const xTicks = [2018, 2020, 2022, 2024, 2026];

  return (
    <div ref={wrapRef} className="ga-chart-wrap">
      <svg
        className="ga-chart-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label="Illustrative career timeline from 2018 to 2026 with seven milestones; vertical positions are illustrative and do not represent measured values"
      >
        <defs>
          <linearGradient id="ga-chart-area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ga-chart-line-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines; vertical positions are illustrative, not measured. */}
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line className="ga-chart-grid-line" x1={PAD.left} y1={toY(tick)} x2={PAD.left + PLOT_W} y2={toY(tick)} />
          </g>
        ))}

        {/* X-axis labels */}
        {xTicks.map((tick) => (
          <text key={`x-${tick}`} className="ga-chart-axis-label" x={toX(tick)} y={bottomY + 20} textAnchor="middle">{tick}</text>
        ))}

        {/* Y-axis title */}
        <text className="ga-chart-axis-label" x={14} y={PAD.top + PLOT_H / 2} textAnchor="middle" transform={`rotate(-90 14 ${PAD.top + PLOT_H / 2})`}>illustrative</text>

        {/* Axis lines */}
        <line className="ga-chart-axis-line" x1={PAD.left} y1={bottomY} x2={PAD.left + PLOT_W} y2={bottomY} />
        <line className="ga-chart-axis-line" x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={bottomY} />

        {/* Area fill */}
        <path className={`ga-chart-area${animate ? " ga-animate" : ""}`} d={areaD} />

        {/* Line */}
        <path
          className="ga-chart-line"
          d={lineD}
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: animate ? 0 : 1 }}
        />

        {/* Data points with labels + hover tooltips */}
        {CHART_POINTS.map((pt, i) => {
          const cx = toX(pt.year);
          const cy = toY(pt.scope);
          const cfg = LABEL_CFG[i];
          const labelY = cy + cfg.dy;
          const tooltipAbove = cfg.dy < 0;
          const tipY = tooltipAbove ? cy - 58 : cy + 14;

          return (
            <g key={i} className="ga-chart-point-group" tabIndex={0}>
              <title>{`${pt.name} — ${pt.role} (${pt.period})`}</title>
              <circle className="ga-chart-point-outer" cx={cx} cy={cy} r={4.5} />
              <circle className="ga-chart-point-inner" cx={cx} cy={cy} r={2} />
              <text className="ga-chart-point-label-role" x={cx} y={labelY} textAnchor={cfg.anchor}>{pt.name}</text>
              <text className="ga-chart-point-label" x={cx} y={labelY + 11} textAnchor={cfg.anchor}>{pt.role}</text>

              {/* Hover tooltip */}
              <g className="ga-chart-tooltip">
                <rect className="ga-chart-tooltip-bg" x={cx - 66} y={tipY} width={132} height={44} rx={8} />
                <text x={cx} y={tipY + 15} textAnchor="middle" className="ga-chart-point-label-role">{pt.name}</text>
                <text x={cx} y={tipY + 28} textAnchor="middle" className="ga-chart-point-label">{pt.role}</text>
                <text x={cx} y={tipY + 39} textAnchor="middle" className="ga-chart-point-label">{pt.period}</text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="ga-chart-legend">
        <span className="ga-chart-legend-item">
          <span className="ga-chart-legend-dot" aria-hidden="true" />
          Illustrative progression · not measured
        </span>
        <span className="ga-chart-legend-item">7 milestones · 2018 → 2026</span>
      </div>
    </div>
  );
}
