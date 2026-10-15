"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { portfolio } from "@/content/portfolio";
import AuroraBackground from "@/components/aurora/AuroraBackground";
import AuroraArcadeChart from "./AuroraArcadeChart";
import { arcadeSound } from "./arcade-sounds";
import TransitionOverlay, { type TransitionMode } from "./TransitionOverlay";
import { useCrossPageTransition } from "@/components/transition/CrossPageTransition";
import "../aurora-arcade/transition.css";

/* ------------------------------------------------------------------ *
 * FeaturedVideo — autoplaying video for the NFI featured project.
 * Mirrors the logic from the original portfolio's projects.tsx:
 * respects prefers-reduced-motion (pauses + hides autoplay).
 * ------------------------------------------------------------------ */
function FeaturedVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayAllowed, setAutoplayAllowed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      if (preference.matches) videoRef.current?.pause();
      setAutoplayAllowed(!preference.matches);
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!autoplayAllowed || !video) return;
    void video.play().catch(() => {
      // Autoplay may be blocked by browser or device settings; native controls remain available.
    });
  }, [autoplayAllowed]);

  return (
    <video
      ref={videoRef}
      controls
      muted
      autoPlay={autoplayAllowed}
      preload="metadata"
      playsInline
      className="ga-featured-video"
      aria-label="Network Fault Intelligence platform demonstration"
    >
      <source src="/videos/network-fault-intelligence-demo.mp4" type="video/mp4" />
      Your browser does not support the video element.
    </video>
  );
}

/* ------------------------------------------------------------------ *
 * ContactDock — floating glass "comm link" bar, always visible.
 * Shows on every screen so visitors can reach out at any time.
 * On the title screen, contact buttons are also rendered inline
 * above PRESS START for immediate visibility.
 * ------------------------------------------------------------------ */
type ContactLink =
  | { kind: "link"; label: string; icon: string; href: string; color: string }
  | { kind: "cv"; label: "CV"; icon: "⬇"; color: string };

const CONTACT_LINKS: ContactLink[] = [
  { kind: "link", label: "EMAIL", icon: "✉", href: portfolio.profile.email, color: "#22d3ee" },
  { kind: "link", label: "LINKEDIN", icon: "in", href: portfolio.profile.socialLinks.find((l) => l.label === "LinkedIn")?.href ?? "#", color: "#38bdf8" },
  { kind: "link", label: "GITHUB", icon: "⌥", href: portfolio.profile.socialLinks.find((l) => l.label === "GitHub")?.href ?? "#", color: "#a78bfa" },
  { kind: "cv", label: "CV", icon: "⬇", color: "#22d3ee" },
];

function MuteButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      className="ga-mute-btn"
      onClick={onToggle}
      aria-label={muted ? "Unmute arcade sounds" : "Mute arcade sounds"}
      title={muted ? "Unmute" : "Mute"}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}

function ContactDock() {
  return (
    <div className="ga-contact-dock" role="navigation" aria-label="Contact links">
      <span className="ga-contact-dock-label">COMM ●</span>
      {CONTACT_LINKS.map((link) =>
        link.kind === "cv" ? (
          <span key={link.label} className="ga-cv-tooltip-wrap">
            <div
              className="ga-contact-btn"
              style={{ "--contact-color": link.color } as React.CSSProperties}
              role="group"
              aria-label="CV available on request"
              aria-describedby="arcade-cv-availability"
              tabIndex={0}
            >
              <span className="ga-contact-btn-icon">{link.icon}</span>
              <span>{link.label}</span>
            </div>
            <span className="ga-cv-tooltip" id="arcade-cv-availability" role="tooltip">
              CV available on request — contact me to get it
            </span>
          </span>
        ) : (
          <a
            key={link.label}
            className="ga-contact-btn"
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            style={{ "--contact-color": link.color } as React.CSSProperties}
            onClick={() => arcadeSound.play("coin")}
          >
            <span className="ga-contact-btn-icon">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        )
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * TechIcon — inline SVG brand icons for project technology chips.
 * Each technology maps to a brand color + a simple geometric SVG.
 * ------------------------------------------------------------------ */
const TECH_META: Record<string, { color: string; shape: string }> = {
  "Kubernetes": { color: "#326CE5", shape: "hex" },
  "Kubernetes YAML": { color: "#326CE5", shape: "hex" },
  "Docker": { color: "#2496ED", shape: "container" },
  "Python": { color: "#FFD43B", shape: "code" },
  "Python 3.11": { color: "#FFD43B", shape: "code" },
  "Flask": { color: "#e8e8e8", shape: "flask" },
  "FastAPI": { color: "#05998B", shape: "bolt" },
  "NGINX": { color: "#009639", shape: "server" },
  "PostgreSQL": { color: "#4169E1", shape: "database" },
  "GitHub Actions": { color: "#2088FF", shape: "gear" },
  "Kustomize": { color: "#7B6FEB", shape: "layers" },
  "Trivy": { color: "#FF6B6B", shape: "shield" },
  "Kube-score": { color: "#4FC08D", shape: "chart" },
  "Gitleaks": { color: "#F7931E", shape: "lock" },
  "GitHub Container Registry (GHCR)": { color: "#6E40C9", shape: "package" },
  "YAML manifests": { color: "#CB171E", shape: "file" },
};

function TechIconSVG({ shape, color }: { shape: string; color: string }) {
  const paths: Record<string, React.ReactNode> = {
    hex: <path d="M10 1L2 5.5v8L10 18l8-4.5v-8L10 1zm0 3l5 3v6l-5 3-5-3V7l5-3z" fill={color} />,
    container: <><rect x="2" y="8" width="16" height="9" rx="1" fill="none" stroke={color} strokeWidth="1.5" /><rect x="4" y="5" width="3" height="3" rx="0.5" fill={color} /><rect x="8" y="5" width="3" height="3" rx="0.5" fill={color} /><rect x="12" y="5" width="3" height="3" rx="0.5" fill={color} /></>,
    code: <path d="M8 6L3 10l5 4M12 6l5 4-5 4" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    flask: <path d="M8 2v5l-4 9a2 2 0 002 3h8a2 2 0 002-3l-4-9V2M7 2h6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
    bolt: <path d="M11 1L4 12h5l-1 7 7-11h-5l1-7z" fill={color} />,
    server: <><rect x="2" y="4" width="16" height="5" rx="1" fill="none" stroke={color} strokeWidth="1.5" /><rect x="2" y="11" width="16" height="5" rx="1" fill="none" stroke={color} strokeWidth="1.5" /><circle cx="5" cy="6.5" r="0.8" fill={color} /><circle cx="5" cy="13.5" r="0.8" fill={color} /></>,
    database: <><ellipse cx="10" cy="4" rx="7" ry="2.5" fill="none" stroke={color} strokeWidth="1.5" /><path d="M3 4v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V4" fill="none" stroke={color} strokeWidth="1.5" /><path d="M3 10c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" fill="none" stroke={color} strokeWidth="1.5" /></>,
    gear: <><circle cx="10" cy="10" r="3" fill="none" stroke={color} strokeWidth="1.5" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M4.5 15.5l1.4-1.4M14.1 5.9l1.4-1.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" /></>,
    layers: <path d="M10 2L2 6l8 4 8-4-8-4zM2 12l8 4 8-4M2 9l8 4 8-4" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />,
    shield: <path d="M10 1L3 4v6c0 4 3 7 7 8 4-1 7-4 7-8V4l-7-3z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />,
    chart: <><rect x="3" y="12" width="3" height="6" rx="0.5" fill={color} /><rect x="8.5" y="8" width="3" height="10" rx="0.5" fill={color} /><rect x="14" y="4" width="3" height="14" rx="0.5" fill={color} /></>,
    lock: <><rect x="4" y="9" width="12" height="9" rx="1.5" fill="none" stroke={color} strokeWidth="1.5" /><path d="M7 9V6a3 3 0 016 0v3" fill="none" stroke={color} strokeWidth="1.5" /><circle cx="10" cy="13.5" r="1.2" fill={color} /></>,
    package: <><path d="M10 2L3 5.5v7L10 16l7-3.5v-7L10 2z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" /><path d="M3 5.5L10 9l7-3.5M10 9v7" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" /></>,
    file: <><path d="M5 2h7l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" /><path d="M12 2v4h4" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 11h6M7 14h6" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></>,
  };

  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {paths[shape] ?? paths.code}
    </svg>
  );
}

function TechChips({ technologies }: { technologies: string[] }) {
  return (
    <div className="ga-tech-chips">
      <span className="ga-tech-chips-label">TECH STACK</span>
      <div className="ga-tech-chips-grid">
        {technologies.map((tech) => {
          const meta = TECH_META[tech] ?? { color: "#818cf8", shape: "code" };
          return (
            <span
              key={tech}
              className="ga-tech-chip"
              style={{ "--tech-color": meta.color } as React.CSSProperties}
            >
              <span className="ga-tech-chip-icon">
                <TechIconSVG shape={meta.shape} color={meta.color} />
              </span>
              <span className="ga-tech-chip-name">{tech}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * CompanyLogo — real brand logo files from /public/logos.
 * Logos are horizontal, displayed centered in a glass container.
 * ------------------------------------------------------------------ */
const LOGO_MAP: Record<string, string> = {
  "HUAWEI": "/logos/Huawei.svg",
  "ERICSSON": "/logos/Ericsson.svg",
  "COCA-COLA": "/logos/CocaCola.svg",
  "COCA COLA": "/logos/CocaCola.svg",
  "ALGERIA TELECOM": "/logos/AlgeriaTelecom.svg",
};

function CompanyLogo({ logoKey }: { logoKey: string }) {
  const key = logoKey.toUpperCase().trim();
  const src = LOGO_MAP[key];

  if (!src) return null;

  return (
    <img
      src={src}
      alt={`${logoKey} logo`}
      className="ga-detail-logo-img"
      draggable={false}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Rank suffix helper — 1ST, 2ND, 3RD, 4TH … (from Cinema variant)
 * ------------------------------------------------------------------ */
function rankSuffix(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return "TH";
  switch (n % 10) {
    case 1: return "ST";
    case 2: return "ND";
    case 3: return "RD";
    default: return "TH";
  }
}

/* ------------------------------------------------------------------ *
 * RPG constants — character creation stats + skill tree layout
 * ------------------------------------------------------------------ */
const STATS = [
  { label: "ADAPTABILITY", value: 85 },
  { label: "PROBLEM-SOLVING", value: 90 },
  { label: "COLLABORATION", value: 88 },
  { label: "TECHNICAL DEPTH", value: 92 },
];

const BRANCH_XS = [130, 390, 650, 910, 1170];

const EDU_LEVELS = [
  { level: 7, range: "LV.7–9", max: true },
  { level: 4, range: "LV.4–6", max: false },
  { level: 1, range: "LV.1–3", max: false },
];

/* ------------------------------------------------------------------ *
 * HUD constants — terminal uplink lines + radar blips
 * ------------------------------------------------------------------ */
const TERMINAL_LINES = [
  "> ESTABLISHING UPLINK...",
  "> CONNECTION STABLE",
  "> EMAIL: ghozlanetata@gmail.com",
  "> LINKEDIN: linkedin.com/in/ghozlane-tata...",
  "> GITHUB: github.com/ghozlanetata",
  "> CV: Available on request",
  "> READY FOR TRANSMISSION_",
];

const RADAR_BLIPS = [
  { label: "EMAIL", angle: 30, color: "#22d3ee" },
  { label: "LINKEDIN", angle: 110, color: "#38bdf8" },
  { label: "GITHUB", angle: 200, color: "#a78bfa" },
  { label: "CV", angle: 290, color: "#22d3ee" },
];

/* ------------------------------------------------------------------ *
 * AuroraArcadeScreen — retro arcade cabinet behind frosted glass
 * under the aurora borealis.
 *
 * Merged features from RPG + Cinema + HUD variants:
 *   RPG   — Character creation typing (ABOUT detail) + Skill tree SVG
 *   CIN   — Achievement leaderboard (CERTS tab) + unlock toast + loading screen
 *   HUD   — Arcade cabinets (PROJECTS tab) + radar (CONTACT tab) + terminal (CONTACT detail) + minimap
 *
 * Flow:  Title screen → PRESS START → Game selection (organized into
 *        category sections, with a career-progression chart) →
 *        Game detail (high scores / character creation / terminal).
 *
 * Keyboard: ↑↓ navigate, ←→ switch category, Enter select, Esc back.
 * ------------------------------------------------------------------ */

interface Game {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  rows: { label: string; value: string }[];
  extra?: string[];
  repositoryUrl?: string;
  hasVideo?: boolean;
  technologies?: string[];
  credentialUrl?: string;
  logoKey?: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  games: Game[];
}

function buildCategories(): Category[] {
  const { profile, experience, projects, academicProjects, skills, certifications, education } = portfolio;
  const cats: Category[] = [];

  // ── About ──
  cats.push({
    id: "about",
    label: "ABOUT",
    icon: "🗺",
    games: [{
      id: "about",
      title: "About Quest",
      subtitle: "The origin story",
      icon: "🗺",
      color: "#c4b5fd",
      rows: [
        { label: "METADATA", value: profile.name },
        { label: "ROLE/SPEC", value: profile.title },
        { label: "CLUSTER REGION", value: profile.location },
      ],
      extra: profile.about,
    }],
  });

  // ── Skill Tree ──
  cats.push({
    id: "skills",
    label: "SKILL TREE",
    icon: "⚔",
    games: skills.map((g) => ({
      id: `skill-${g.category}`,
      title: g.category,
      subtitle: "Skill branch unlocked",
      icon: "⚔",
      color: "#22d3ee",
      rows: g.skills.map((s) => ({ label: "◆", value: s })),
    })),
  });

  // ── Career (Experience) ──
  cats.push({
    id: "career",
    label: "CAREER",
    icon: "💼",
    games: experience.map((exp, i) => {
      const isInternship = exp.role.toLowerCase().includes("internship");
      const subject =
        exp.company === "ERICSSON"
          ? "AI-driven fault detection and self-healing in mobile networks"
          : exp.company === "ALGERIA TELECOM"
            ? "Network Monitoring and system analysis"
            : "";
      return {
        id: `exp-${i}`,
        title: exp.company,
        subtitle: exp.role,
        icon: isInternship ? "🎓" : "🏢",
        logoKey: exp.company,
        color: isInternship ? "#a78bfa" : "#f472b6",
        rows: [
          { label: "PERIOD", value: exp.period },
          { label: "ORG", value: exp.organization },
          ...(isInternship && subject ? [{ label: "SUBJECT", value: subject }] : []),
          ...(exp.location ? [{ label: "LOC", value: exp.location }] : []),
        ],
        extra: exp.groups.flatMap((g) => g.bullets),
      };
    }),
  });

  // ── Projects (NFI featured first, then secondary projects) ──
  const projectGames: Game[] = [
    {
      id: "proj-nfi",
      title: "Network Fault Intelligence",
      subtitle: "Network KPI analysis, fault detection & classification",
      icon: "🌟",
      color: "#22d3ee",
      rows: [
        { label: "TYPE", value: "Network Intelligence / ML" },
        { label: "STATUS", value: "FEATURED PROJECT" },
        { label: "FOCUS", value: "KPI analysis · ML · Operator UI" },
      ],
      extra: [
        "An end-to-end Network Fault Intelligence platform that uses mobile network KPIs and machine learning to detect and classify network faults.",
        "It combines a trained ML pipeline, a FastAPI backend, and an operator-focused interface to turn network performance data into actionable fault insights, with a containerized architecture designed for deployment on Kubernetes.",
        "Platform components: Network KPI analysis · Machine learning · Application, backend & ML architecture",
      ],
      repositoryUrl: "https://github.com/ghozlanetata/network-fault-intelligence-platform",
      hasVideo: true,
    },
    ...projects.map((p, i) => ({
      id: `proj-${i}`,
      title: p.name,
      subtitle: p.subtitle,
      icon: "🎮",
      color: "#34d399",
      rows: [
        { label: "TYPE", value: p.category },
        ...(p.status ? [{ label: "STATUS", value: p.status }] : []),
      ],
      extra: [p.overview],
      technologies: p.technologies,
      repositoryUrl: p.repositoryUrl,
    })),
  ];

  cats.push({
    id: "projects",
    label: "PROJECTS",
    icon: "🎮",
    games: projectGames,
  });

  // ── Achievements (Certifications) ──
  cats.push({
    id: "certs",
    label: "ACHIEVEMENTS",
    icon: "🏆",
    games: certifications.map((c, i) => ({
      id: `cert-${i}`,
      title: c.name,
      subtitle: "Achievement unlocked",
      icon: "🏆",
      color: "#67e8f9",
      rows: [
        { label: "ISSUER", value: c.issuer },
        { label: "DATE", value: c.date },
      ],
      credentialUrl: c.credentialUrl,
    })),
  });

  // ── Education ──
  cats.push({
    id: "education",
    label: "EDUCATION",
    icon: "📚",
    games: education.map((e, i) => ({
      id: `edu-${i}`,
      title: e.qualification,
      subtitle: e.institution,
      icon: "📚",
      color: "#a78bfa",
      rows: [{ label: "PERIOD", value: e.period }],
      extra: e.detail ? [e.detail] : undefined,
    })),
  });

  // ── Academic Projects ──
  cats.push({
    id: "academic",
    label: "ACADEMIC",
    icon: "🎓",
    games: academicProjects.map((ap, i) => ({
      id: `acad-${i}`,
      title: ap.title,
      subtitle: ap.context,
      icon: "🎓",
      color: "#818cf8",
      rows: [
        { label: "PERIOD", value: ap.period },
        { label: "TYPE", value: "University Project" },
      ],
      extra: [ap.summary, ...ap.highlights],
      technologies: ap.technologies,
    })),
  });

  // ── Contact ──
  cats.push({
    id: "contact",
    label: "CONTACT",
    icon: "📡",
    games: [{
      id: "contact",
      title: "Contact Comm",
      subtitle: "Establish uplink",
      icon: "📡",
      color: "#60a5fa",
      rows: [
        { label: "EMAIL", value: profile.email.replace("mailto:", "") },
        ...profile.socialLinks.map((l) => ({ label: l.label, value: l.href })),
      ],
    }],
  });

  return cats;
}

/* ------------------------------------------------------------------ *
 * SkillTreeSVG — animated branching skill tree (from RPG variant)
 * ------------------------------------------------------------------ */
function SkillTreeSVG({
  games,
  onSelect,
}: {
  games: Game[];
  onSelect: (game: Game, idx: number) => void;
}) {
  const VB_W = 1300;
  const VB_H = 580;
  const rootX = 650;
  const rootY = 55;
  const rootR = 42;
  const branchY = 175;
  const branchW = 170;
  const branchH = 36;
  const leafStartY = 220;
  const leafSpacing = 26;

  const scrollRef = useRef<HTMLDivElement>(null);

  // Center the scroll horizontally on the root node after mount
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const svg = el.querySelector("svg");
    if (!svg) return;
    // Wait for layout to settle
    const raf = requestAnimationFrame(() => {
      const svgWidth = svg.getBoundingClientRect().width;
      const containerWidth = el.clientWidth;
      // Root is at 50% of the SVG width — center it in the container
      el.scrollLeft = Math.max(0, (svgWidth / 2) - (containerWidth / 2));
    });
    return () => cancelAnimationFrame(raf);
  }, [games]);

  return (
    <div className="ga-rpg-skill-tree-wrap">
      <div className="ga-rpg-skill-tree-scroll" ref={scrollRef}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="ga-rpg-skill-tree-svg" role="img" aria-label="Skill tree diagram">
          {/* Root → branch lines */}
          {games.map((_, i) => {
            const cx = BRANCH_XS[i] ?? rootX;
            return (
              <line
                key={`rbl-${i}`}
                className="ga-rpg-tree-line ga-rpg-tree-line-root"
                x1={rootX}
                y1={rootY + rootR}
                x2={cx}
                y2={branchY - branchH / 2}
                pathLength={1}
                style={{ animationDelay: `${0.3 + i * 0.15}s` } as React.CSSProperties}
              />
            );
          })}

          {/* Branch → leaf lines */}
          {games.map((game, i) => {
            const cx = BRANCH_XS[i] ?? rootX;
            return game.rows.map((_, j) => {
              const ly = leafStartY + j * leafSpacing;
              return (
                <line
                  key={`bll-${i}-${j}`}
                  className="ga-rpg-tree-line ga-rpg-tree-line-branch"
                  x1={cx}
                  y1={branchY + branchH / 2}
                  x2={cx}
                  y2={ly}
                  pathLength={1}
                  style={{ animationDelay: `${0.8 + i * 0.15 + j * 0.04}s` } as React.CSSProperties}
                />
              );
            });
          })}

          {/* Root node */}
          <g
            className="ga-rpg-tree-node ga-rpg-tree-node-root"
            style={{ animationDelay: "0.1s" } as React.CSSProperties}
          >
            <circle className="ga-rpg-tree-circle-root" cx={rootX} cy={rootY} r={rootR} />
            <text className="ga-rpg-tree-text-root" x={rootX} y={rootY} dy="0.35em">
              Ghozlane
            </text>
          </g>

          {/* Branch nodes */}
          {games.map((game, i) => {
            const cx = BRANCH_XS[i] ?? rootX;
            return (
              <g
                key={`branch-${i}`}
                className="ga-rpg-tree-node"
                style={{ animationDelay: `${0.65 + i * 0.15}s` } as React.CSSProperties}
                onClick={() => onSelect(game, i)}
              >
                <rect
                  className="ga-rpg-tree-circle-branch"
                  x={cx - branchW / 2}
                  y={branchY - branchH / 2}
                  width={branchW}
                  height={branchH}
                  rx={branchH / 2}
                />
                <text className="ga-rpg-tree-text-branch" x={cx} y={branchY} dy="0.35em">
                  {game.title}
                </text>
              </g>
            );
          })}

          {/* Leaf nodes */}
          {games.map((game, i) => {
            const cx = BRANCH_XS[i] ?? rootX;
            return game.rows.map((row, j) => {
              const ly = leafStartY + j * leafSpacing;
              return (
                <g
                  key={`leaf-${i}-${j}`}
                  className="ga-rpg-tree-node"
                  style={{ animationDelay: `${1.0 + i * 0.15 + j * 0.04}s` } as React.CSSProperties}
                  onClick={() => onSelect(game, i)}
                >
                  <circle className="ga-rpg-tree-circle-leaf" cx={cx} cy={ly} r={5} />
                  <text className="ga-rpg-tree-text-leaf" x={cx + 12} y={ly + 4}>
                    {row.value}
                  </text>
                </g>
              );
            });
          })}
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Main component
 * ------------------------------------------------------------------ */
export default function AuroraArcadeScreen({ transitionMode = "crt" }: { transitionMode?: TransitionMode }) {
  const { navigateWithTransition } = useCrossPageTransition();
  const categories = buildCategories();
  const totalGames = categories.reduce((sum, c) => sum + c.games.length, 0);

  // ── Core state ──
  const [started, setStarted] = useState(false);
  const [transitioning, setTransitioning] = useState<TransitionMode | null>(null);
  const [activeCat, setActiveCat] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<Game | null>(null);
  const [score, setScore] = useState(0);
  const [muted, setMuted] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const prevCatRef = useRef(activeCat);

  // ── RPG: character creation typing state ──
  const [typedFields, setTypedFields] = useState<string[]>([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const [introStep, setIntroStep] = useState(0);

  // ── Cinema: achievement toast + loading screen ──
  const [achToastName, setAchToastName] = useState<string | null>(null);
  const [achToastOut, setAchToastOut] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const achEnterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const achExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── HUD: minimap visited + terminal typing ──
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [terminalTyped, setTerminalTyped] = useState<string[]>([]);
  const [terminalComplete, setTerminalComplete] = useState(false);

  // Games in the currently active category
  const activeGames = categories[activeCat]?.games ?? [];

  const toggleMute = useCallback(() => {
    const newMuted = arcadeSound.toggleMute();
    setMuted(newMuted);
  }, []);

  /* ── Cinema: open detail with loading + achievement toast ── */
  const openDetail = useCallback((game: Game, idx: number) => {
    arcadeSound.play("select");
    setCursor(idx);
    setSelected(game);
    setScore((s) => s + 100);

    // Loading screen
    setDetailLoading(true);
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(() => setDetailLoading(false), 500);

    // Achievement toast for certifications
    if (game.id.startsWith("cert-")) {
      setAchToastName(game.title);
      setAchToastOut(false);
      if (achEnterTimeoutRef.current) clearTimeout(achEnterTimeoutRef.current);
      if (achExitTimeoutRef.current) clearTimeout(achExitTimeoutRef.current);
      achEnterTimeoutRef.current = setTimeout(() => setAchToastOut(true), 2000);
      achExitTimeoutRef.current = setTimeout(() => setAchToastName(null), 2300);
    }
  }, []);

  /* ── RPG: typing effect for character creation (ABOUT detail) ── */
  useEffect(() => {
    if (selected?.id !== "about") {
      setTypedFields([]);
      setStatsVisible(false);
      setIntroStep(0);
      return;
    }

    const fields = selected.rows.map((r) => r.value);
    setTypedFields(fields.map(() => ""));
    setStatsVisible(false);
    setIntroStep(0);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const typed: string[] = fields.map(() => "");

    // Type all fields simultaneously (each field starts at char 0 at the same time)
    const CHAR_DELAY = 30; // ms per character — moderate speed
    let maxDelay = 0;

    fields.forEach((field, fi) => {
      for (let ci = 0; ci < field.length; ci++) {
        const currentDelay = ci * CHAR_DELAY;
        const t = setTimeout(() => {
          typed[fi] = field.slice(0, ci + 1);
          setTypedFields([...typed]);
        }, currentDelay);
        timers.push(t);
      }
      const fieldFinish = field.length * CHAR_DELAY;
      if (fieldFinish > maxDelay) maxDelay = fieldFinish;
    });

    // After typing finishes, reveal intro paragraphs one by one
    const introLines = selected.extra ?? [];
    let introDelay = maxDelay + 400; // brief pause after typing completes
    introLines.forEach((_, i) => {
      const t = setTimeout(() => setIntroStep(i + 1), introDelay);
      timers.push(t);
      introDelay += 500; // stagger between paragraphs
    });

    // Stats appear after all intro paragraphs have faded in
    const statsTimer = setTimeout(() => setStatsVisible(true), introDelay + 200);
    timers.push(statsTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [selected]);

  /* ── HUD: terminal uplink typing (CONTACT detail) ── */
  useEffect(() => {
    if (selected?.id !== "contact") return;
    setTerminalTyped([]);
    setTerminalComplete(false);
    let lineIdx = 0;
    let charIdx = 0;
    let timer: ReturnType<typeof setTimeout>;
    const typeNext = () => {
      if (lineIdx >= TERMINAL_LINES.length) {
        setTerminalComplete(true);
        return;
      }
      const line = TERMINAL_LINES[lineIdx];
      if (charIdx < line.length) {
        charIdx++;
        setTerminalTyped((prev) => {
          const next = [...prev];
          next[lineIdx] = line.slice(0, charIdx);
          return next;
        });
        timer = setTimeout(typeNext, 28);
      } else {
        lineIdx++;
        charIdx = 0;
        timer = setTimeout(typeNext, 300);
      }
    };
    timer = setTimeout(typeNext, 200);
    return () => clearTimeout(timer);
  }, [selected]);

  /* ── HUD: track visited categories for minimap ── */
  useEffect(() => {
    setVisited((prev) => new Set(prev).add(activeCat));
  }, [activeCat]);

  /* ── Tab bar auto-scroll: center the active tab so upcoming sections are visible ── */
  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const tabs = bar.querySelectorAll<HTMLButtonElement>(".ga-tab");
    const activeTab = tabs[activeCat];
    if (!activeTab) return;
    // Center the active tab in the scrollable bar
    const barWidth = bar.clientWidth;
    const tabLeft = activeTab.offsetLeft;
    const tabWidth = activeTab.offsetWidth;
    const targetScroll = tabLeft - (barWidth - tabWidth) / 2;
    bar.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" });
  }, [activeCat]);

  // ── Cleanup all timeouts on unmount ──
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (achEnterTimeoutRef.current) clearTimeout(achEnterTimeoutRef.current);
      if (achExitTimeoutRef.current) clearTimeout(achExitTimeoutRef.current);
    };
  }, []);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!started) {
        // The native DISCOVER ME button handles Enter and Space activation.
        return;
      }

      if (selected) {
        if (e.key === "Escape" || e.key === "Backspace") {
          e.preventDefault();
          arcadeSound.play("back");
          setSelected(null);
        }
        return;
      }

      // Let native controls handle Enter so their click action is not duplicated.
      if (e.key === "Enter" && e.target instanceof HTMLButtonElement) return;

      // ← → switch category tabs
      if (e.key === "ArrowRight" && !e.shiftKey) {
        e.preventDefault();
        arcadeSound.play("navigate");
        setActiveCat((c) => Math.min(c + 1, categories.length - 1));
        setCursor(0);
        return;
      }
      if (e.key === "ArrowLeft" && !e.shiftKey) {
        e.preventDefault();
        arcadeSound.play("navigate");
        setActiveCat((c) => Math.max(c - 1, 0));
        setCursor(0);
        return;
      }

      // ↑ ↓ move within current category
      if (e.key === "ArrowDown") {
        e.preventDefault();
        arcadeSound.play("navigate");
        setCursor((c) => Math.min(c + 1, activeGames.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        arcadeSound.play("navigate");
        setCursor((c) => Math.max(c - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeGames[cursor]) {
          openDetail(activeGames[cursor], cursor);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        arcadeSound.play("back");
        setStarted(false);
      }
    },
    [started, selected, cursor, activeGames, categories.length, openDetail],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (!started || selected) return;
    tabBarRef.current
      ?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')
      ?.focus();
  }, [started, selected, activeCat]);

  // Scroll the selected game into view when cursor changes (keyboard nav only).
  useEffect(() => {
    if (!started || selected) return;
    // Skip scroll on tab change — just reset the list scroll position
    if (prevCatRef.current !== activeCat) {
      prevCatRef.current = activeCat;
      if (selectRef.current) selectRef.current.scrollTop = 0;
      return;
    }
    const el = selectRef.current?.querySelector<HTMLElement>(
      `[data-game-idx="${cursor}"]`,
    );
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [cursor, started, selected, activeCat]);

  const handleSelect = (game: Game, idx: number) => {
    openDetail(game, idx);
  };

  const handleCatChange = (idx: number) => {
    arcadeSound.play("navigate");
    setActiveCat(idx);
    setCursor(0);
  };

  // ── Title screen ──
  if (!started) {
    return (
      <>
      <div className="ga-app ga-title">
        <AuroraBackground />
        <div className="ga-title-content">
          <div className="ga-title-pixel">PORTFOLIO</div>
          <h1 className="ga-title-name">{portfolio.profile.name}</h1>
          <div className="ga-title-role">{portfolio.profile.title}</div>
          <div className="ga-title-loc">📍 {portfolio.profile.location}</div>
          <button
            className="ga-press-start"
            type="button"
            onClick={() => { arcadeSound.play("start"); setTransitioning(transitionMode); }}
          >
            ▶ DISCOVER ME
          </button>
          <div className="ga-title-hint">↑↓ Navigate · ←→ Switch Category · Enter Select · Esc Back</div>
          <div className="ga-credits">
            <span>© {new Date().getFullYear()} {portfolio.profile.name}</span>
            <span>·</span>
            <span>1 PLAYER</span>
            <span>·</span>
            <span>NO CONTINUES NEEDED</span>
          </div>
        </div>
        <ContactDock />
    </div>
    {transitioning && (
      <TransitionOverlay
        mode={transitioning}
        onSwap={() => setStarted(true)}
        onComplete={() => setTransitioning(null)}
      />
    )}
    </>
  );
}

  // ── Game detail screen ──
  if (selected) {
    const isAbout = selected.id === "about";
    const isEdu = selected.id.startsWith("edu-");
    const isExp = selected.id.startsWith("exp-");
    const isCertDetail = selected.id.startsWith("cert-");
    const isContact = selected.id === "contact";

    // RPG: compute cursor field for character creation
    const aboutFields = isAbout ? selected.rows.map((r) => r.value) : [];
    const activeFieldIdx = typedFields.findIndex(
      (t, i) => t.length < (aboutFields[i]?.length ?? 0),
    );
    const cursorFieldIdx =
      activeFieldIdx !== -1
        ? activeFieldIdx
        : Math.max(0, typedFields.length - 1);

    return (
      <>
      <div className="ga-app ga-detail" style={{ "--game-color": selected.color } as React.CSSProperties}>
        <AuroraBackground />

        {/* Cinema: Achievement Unlock Toast */}
        {achToastName && (
          <div
            className={`ga-cin-ach-toast ${achToastOut ? "ga-cin-toast-out" : ""}`}
            role="status"
            aria-live="polite"
          >
            <span className="ga-cin-ach-toast-icon">🏆</span>
            <span>ACHIEVEMENT UNLOCKED: {achToastName}</span>
          </div>
        )}

        <div className="ga-detail-header">
          <div className="ga-hud">
            <span>SCORE: {String(score).padStart(6, "0")}</span>
            <span className="ga-hud-sep">·</span>
            <span>HI: 999999</span>
            <span className="ga-hud-sep">·</span>
            <span style={{ color: selected.color }}>LV.{cursor + 1}</span>
          </div>
          <div className="ga-hud-right">
            <MuteButton muted={muted} onToggle={toggleMute} />
            <button
              className="ga-back-btn"
              onClick={() => { arcadeSound.play("back"); setSelected(null); }}
              aria-label="Back to game selection"
            >
              ← BACK TO MENU
            </button>
          </div>
        </div>
        <div className="ga-detail-body">
          {/* Cinema: Loading Screen Progress */}
          {detailLoading ? (
            <div className="ga-cin-loading">
              <div className="ga-cin-loading-text">ENTERING STAGE...</div>
              <div className="ga-cin-loading-bar">
                <div className="ga-cin-loading-fill" />
              </div>
            </div>
          ) : isContact ? (
            /* ─── HUD: Terminal Uplink for CONTACT detail ─── */
            <>
              <div className="ga-hud-terminal">
                {terminalTyped.map((typed, i) => {
                  const showCursor =
                    (!terminalComplete && i === terminalTyped.length - 1) ||
                    (terminalComplete && i === TERMINAL_LINES.length - 1);
                  return (
                    <div key={i} className="ga-hud-terminal-line">
                      {typed}
                      {showCursor && <span className="ga-hud-terminal-cursor">▊</span>}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div
              className={`ga-detail-card ga-cin-detail-fade-in ${isCertDetail ? "ga-cin-cert-detail-gold" : ""}`}
            >
              {isAbout ? (
                /* ─── RPG: Character Creation Screen ─── */
                <div className="ga-rpg-char-create">
                  <div className="ga-rpg-char-create-title">DEPLOYMENT CONFIG</div>
                  {selected.rows.map((row, fi) => (
                    <div className="ga-rpg-char-field" key={fi}>
                      <span className="ga-rpg-char-field-label">{row.label}</span>
                      <span className="ga-rpg-char-field-value">
                        {typedFields[fi] ?? ""}
                        {fi === cursorFieldIdx && (
                          <span className="ga-rpg-cursor-blink">▌</span>
                        )}
                      </span>
                    </div>
                  ))}
                  {selected.extra && selected.extra.length > 0 && (
                    <div className="ga-detail-extra ga-rpg-intro-wrap">
                      {selected.extra.map((line, i) => (
                        <p
                          key={i}
                          className={`ga-extra-line ga-rpg-intro-line${introStep > i ? " ga-rpg-intro-visible" : ""}`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                  <div
                    className={`ga-rpg-stat-section${statsVisible ? " ga-rpg-visible" : ""}`}
                  >
                    <div className="ga-rpg-stat-section-title">BASE STATS</div>
                    {STATS.map((stat, i) => (
                      <div className="ga-rpg-stat-row" key={stat.label}>
                        <div className="ga-rpg-stat-header">
                          <span className="ga-rpg-stat-label">{stat.label}</span>
                          <span className="ga-rpg-stat-value">{stat.value}%</span>
                        </div>
                        <div className="ga-rpg-stat-bar">
                          <div
                            className="ga-rpg-stat-fill"
                            style={{
                              width: statsVisible ? `${stat.value}%` : "0%",
                              transitionDelay: `${i * 0.2}s`,
                            } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isEdu ? (
                /* ─── RPG: Diploma Scroll Unfurl ─── */
                <div className="ga-rpg-scroll-unfurl">
                  <div className="ga-detail-icon" style={{ color: selected.color }}>
                    {selected.icon}
                  </div>
                  <h2 className="ga-detail-title ga-rpg-diploma-stamp" style={{ color: selected.color }}>
                    {selected.title}
                  </h2>
                  <p className="ga-detail-subtitle">{selected.subtitle}</p>
                  <div className="ga-high-scores">
                    <div className="ga-hs-head">═══ HIGH SCORES ═══</div>
                    {selected.rows.map((row, i) => (
                      <div key={i} className="ga-hs-row">
                        <span className="ga-hs-label">{row.label}</span>
                        <span className="ga-hs-value">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  {selected.extra && selected.extra.length > 0 && (
                    <div className="ga-detail-extra">
                      {selected.extra.map((line, i) => (
                        <p key={i} className="ga-extra-line ga-rpg-diploma-detail">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {selected.logoKey ? (
                    <div className="ga-detail-logo">
                      <CompanyLogo logoKey={selected.logoKey} />
                    </div>
                  ) : (
                    <div className="ga-detail-icon" style={{ color: selected.color }}>
                      {selected.icon}
                    </div>
                  )}
                  {!selected.logoKey && (
                    <h2 className="ga-detail-title" style={{ color: selected.color }}>
                      {selected.title}
                    </h2>
                  )}
                  <p className="ga-detail-subtitle">{selected.subtitle}</p>
                  <div className="ga-high-scores">
                    <div className="ga-hs-head">═══ HIGH SCORES ═══</div>
                    {selected.rows.map((row, i) => (
                      <div key={i} className="ga-hs-row">
                        <span className="ga-hs-label">{row.label}</span>
                        <span className="ga-hs-value">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  {selected.extra && selected.extra.length > 0 && (
                    <div className="ga-detail-extra">
                      {selected.extra.map((line, i) => (
                        <p key={i} className={`ga-extra-line${isExp ? " ga-extra-bullet" : ""}`}>{line}</p>
                      ))}
                    </div>
                  )}
                  {selected.hasVideo && (
                    <div className="ga-detail-video">
                      <FeaturedVideo />
                    </div>
                  )}
                  {selected.technologies && selected.technologies.length > 0 && (
                    <TechChips technologies={selected.technologies} />
                  )}
                  {selected.repositoryUrl && (
                    <a
                      className="ga-detail-repo"
                      href={selected.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => arcadeSound.play("coin")}
                    >
                      <span aria-hidden="true">⌥</span> View GitHub Repository <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {selected.credentialUrl && (
                    <a
                      className="ga-detail-verify"
                      href={selected.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => arcadeSound.play("coin")}
                    >
                      <svg className="ga-verify-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                      Verify Credential <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <ContactDock />
    </div>
    {transitioning && (
      <TransitionOverlay
        mode={transitioning}
        onSwap={() => setStarted(true)}
        onComplete={() => setTransitioning(null)}
      />
    )}
    </>
  );
}

  // ── Game selection screen (tabbed stage select) ──
  const activeCat_ = categories[activeCat];
  const isCareerTab = activeCat_.id === "career";
  const isAboutTab = activeCat_.id === "about";
  const isSkillsTab = activeCat_.id === "skills";
  const isCertsTab = activeCat_.id === "certs";
  const isEduTab = activeCat_.id === "education";
  const isProjectsTab = activeCat_.id === "projects";
  const isContactTab = activeCat_.id === "contact";
  const contactGame = isContactTab ? activeCat_.games[0] : null;

  return (
    <>
    <div className="ga-app ga-select">
      <AuroraBackground />
      {/* HUD with Classic View button */}
      <div className="ga-select-hud">
        <div className="ga-hud-left">
          <span>SCORE: {String(score).padStart(6, "0")}</span>
          <span className="ga-hud-sep">·</span>
          <span>GAMES: {totalGames}</span>
        </div>
        <div className="ga-hud-right">
          <MuteButton muted={muted} onToggle={toggleMute} />
          <a className="ga-classic-btn" onClick={(e) => { e.preventDefault(); navigateWithTransition("/classic-portfolio"); }} href="/classic-portfolio" aria-label="Switch to classic portfolio view">
            ◫ Classic View
          </a>
        </div>
      </div>
      <h2 className="ga-select-title">
        <span className="ga-select-arrow">▶</span> STAGE SELECT
      </h2>

      {/* Category tab bar */}
      <div className="ga-tab-bar" role="tablist" aria-label="Category selection" ref={tabBarRef}>
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            className="ga-tab"
            role="tab"
            tabIndex={activeCat === i ? 0 : -1}
            aria-selected={activeCat === i}
            data-active={activeCat === i}
            onClick={() => handleCatChange(i)}
          >
            <span className="ga-tab-icon">{cat.icon}</span>
            <span className="ga-tab-label">{cat.label}</span>
            <span className="ga-tab-count">{cat.games.length}</span>
          </button>
        ))}
      </div>

      {/* Active category games */}
      <div className="ga-select-scroll" ref={selectRef}>
        {/* Career chart — shown only on the CAREER tab, above the games */}
        {isCareerTab && (
          <div className="ga-chart-panel">
            <div className="ga-chart-panel-header">
              <span className="ga-chart-panel-icon">📈</span>
              <span className="ga-chart-panel-title">CAREER PROGRESSION</span>
              <span className="ga-chart-panel-sub">responsibility_growth over time</span>
            </div>
            <AuroraArcadeChart />
          </div>
        )}

        <section className="ga-category" aria-label={activeCat_.label}>
          <div className="ga-category-header">
            <span className="ga-category-icon">{activeCat_.icon}</span>
            <span className="ga-category-label">{activeCat_.label}</span>
            <span className="ga-category-count">{activeCat_.games.length}</span>
          </div>

          {isSkillsTab ? (
            /* ─── RPG: Skill Tree SVG ─── */
            <SkillTreeSVG games={activeCat_.games} onSelect={handleSelect} />
          ) : isCertsTab ? (
            /* ─── Cinema: High-Score Leaderboard for certifications ─── */
            <div className="ga-cin-leaderboard">
              <div className="ga-cin-lb-header">
                <span className="ga-cin-lb-header-title">═══ HIGH SCORES ═══</span>
                <span className="ga-cin-lb-header-sub">certifications leaderboard</span>
              </div>
              <div className="ga-cin-lb-list">
                {portfolio.certifications.map((cert, i) => {
                  const game = activeCat_.games[i];
                  if (!game) return null;
                  const isNew = cert.name.includes("CKA");
                  return (
                    <button
                      key={game.id}
                      className="ga-cin-lb-row ga-cin-cert-shimmer"
                      style={{ animationDelay: `${i * 0.1}s` }}
                      data-game-idx={i}
                      data-selected={cursor === i}
                      aria-selected={cursor === i}
                      role="option"
                      aria-label={`View ${cert.name} details`}
                      onClick={() => openDetail(game, i)}
                      onMouseEnter={() => { arcadeSound.play("hover"); setCursor(i); }}
                    >
                      <span className="ga-cin-lb-rank">
                        {i + 1}{rankSuffix(i + 1)}
                      </span>
                      <span className="ga-cin-lb-name">{cert.name}</span>
                      <span className="ga-cin-lb-dots">
                        ....................................................................
                      </span>
                      <span className="ga-cin-lb-issuer">{cert.issuer}</span>
                      <span className="ga-cin-lb-date">{cert.date}</span>
                      {isNew && <span className="ga-cin-lb-new">NEW!</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : isEduTab ? (
            /* ─── RPG: Level Progression Bars ─── */
            <div className="ga-category-games">
              {activeCat_.games.map((game, idx) => {
                const lvl = EDU_LEVELS[idx] ?? { level: 1, range: "LV.1–3", max: false };
                return (
                  <button
                    key={game.id}
                    className="ga-rpg-level-item"
                    data-selected={cursor === idx}
                    data-game-idx={idx}
                    role="option"
                    aria-selected={cursor === idx}
                    onClick={() => handleSelect(game, idx)}
                    onMouseEnter={() => { arcadeSound.play("hover"); setCursor(idx); }}
                    style={{ "--game-color": game.color } as React.CSSProperties}
                  >
                    <div className="ga-rpg-level-header">
                      <span className="ga-rpg-level-tag">LV.{lvl.level}</span>
                      <span className="ga-rpg-level-name">{game.title}</span>
                      {lvl.max && <span className="ga-rpg-max-level-badge">MAX LEVEL</span>}
                    </div>
                    <div className="ga-rpg-xp-bar">
                      <div
                        className="ga-rpg-xp-fill"
                        style={{ animationDelay: `${idx * 0.15}s` } as React.CSSProperties}
                      />
                    </div>
                    <div className="ga-rpg-level-meta">
                      <span>{lvl.range} · {game.subtitle}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : isContactTab && contactGame ? (
            /* ─── HUD: Radar Sweep for CONTACT tab ─── */
            <div className="ga-hud-radar">
              <div className="ga-hud-radar-ring" style={{ width: "30%", height: "30%" }} />
              <div className="ga-hud-radar-ring" style={{ width: "60%", height: "60%" }} />
              <div className="ga-hud-radar-ring" style={{ width: "90%", height: "90%" }} />
              <div className="ga-hud-radar-cross-h" />
              <div className="ga-hud-radar-cross-v" />
              <div className="ga-hud-radar-sweep" />
              <div className="ga-hud-radar-center" />
              {RADAR_BLIPS.map((blip) => {
                const rad = (blip.angle * Math.PI) / 180;
                const x = 50 + 30 * Math.sin(rad);
                const y = 50 - 30 * Math.cos(rad);
                return (
                  <button
                    key={blip.label}
                    className="ga-hud-radar-blip"
                    style={{ left: `${x}%`, top: `${y}%`, "--blip-color": blip.color } as React.CSSProperties}
                    onClick={() => handleSelect(contactGame, 0)}
                  >
                    <span
                      className="ga-hud-radar-blip-dot"
                      style={{ animationDelay: `${(blip.angle / 360) * 3}s` }}
                    />
                    <span className="ga-hud-radar-blip-label">{blip.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="ga-category-games">
              {activeCat_.games.map((game, idx) =>
                /* ─── HUD: Arcade Cabinet Marquee for PROJECTS tab ─── */
                isProjectsTab ? (
                  <button
                    key={game.id}
                    className="ga-hud-cabinet"
                    data-selected={cursor === idx}
                    data-game-idx={idx}
                    role="option"
                    aria-selected={cursor === idx}
                    onClick={() => handleSelect(game, idx)}
                    onMouseEnter={() => { arcadeSound.play("hover"); setCursor(idx); }}
                    style={{ "--game-color": game.color } as React.CSSProperties}
                  >
                    <div className="ga-hud-cabinet-marquee">
                      <span className="ga-hud-cabinet-marquee-text">{game.title}</span>
                    </div>
                    <div className="ga-hud-cabinet-body">
                      <span className="ga-hud-cabinet-icon">{game.icon}</span>
                      <span className="ga-hud-cabinet-sub">{game.subtitle}</span>
                    </div>
                  </button>
                ) : (
                  <button
                    key={game.id}
                    className="ga-game-item"
                    data-selected={cursor === idx}
                    data-game-idx={idx}
                    role="option"
                    aria-selected={cursor === idx}
                    onClick={() => handleSelect(game, idx)}
                    onMouseEnter={() => { arcadeSound.play("hover"); setCursor(idx); }}
                    style={{ "--game-color": game.color } as React.CSSProperties}
                  >
                    <span className="ga-game-cursor" aria-hidden="true">
                      {cursor === idx ? "▶" : " "}
                    </span>
                    <span className="ga-game-icon" style={{ color: game.color }}>
                      {game.icon}
                    </span>
                    <span className="ga-game-name">{game.title}</span>
                    <span className="ga-game-sub">{game.subtitle}</span>
                  </button>
                ),
              )}
            </div>
          )}
        </section>
      </div>

      {/* Featured project — NFI panel, only on the ABOUT tab */}
      {isAboutTab && (
      <div className="ga-featured-wrap">
        <div className="ga-featured-panel ga-featured-full">
          <div className="ga-featured-panel-header">
            <span className="ga-featured-badge">★ FEATURED PROJECT</span>
          </div>
          <div className="ga-featured-body">
            <div className="ga-featured-media">
              <FeaturedVideo />
            </div>
            <div className="ga-featured-copy">
              <h3 className="ga-featured-title">Network Fault Intelligence</h3>
              <p className="ga-featured-subtitle">Network KPI analysis, fault detection and classification</p>
              <p className="ga-featured-desc">
                An end-to-end Network Fault Intelligence platform that uses mobile network KPIs
                and machine learning to detect and classify network faults. It combines a trained
                ML pipeline, a FastAPI backend, and an operator-focused interface to turn network
                performance data into actionable fault insights, with a containerized architecture
                designed for deployment on Kubernetes.
              </p>
              <div className="ga-featured-stack">
                <span className="ga-featured-stack-label">PLATFORM COMPONENTS</span>
                <span className="ga-featured-stack-val">Network KPI analysis · Machine learning · App, backend &amp; ML architecture</span>
              </div>
              <a
                className="ga-featured-link"
                href="https://github.com/ghozlanetata/network-fault-intelligence-platform"
                target="_blank"
                rel="noreferrer"
                onClick={() => arcadeSound.play("coin")}
              >
                View GitHub repository <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      )}

      <div className="ga-select-footer">
        <span>↑↓ Navigate · ←→ Switch Stage · Enter Select · Esc Title</span>
        <span className="ga-hud-sep">·</span>
        <span>© {new Date().getFullYear()} {portfolio.profile.name}</span>
      </div>

      {/* HUD: Mini-Map Sector Indicator */}
      <div className="ga-hud-minimap">
        <div className="ga-hud-minimap-label">Portfolio Map</div>
        <div className="ga-hud-minimap-dots">
          {categories.map((_, i) => {
            const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
            const r = 30;
            const x = 50 + r * Math.cos(angle);
            const y = 50 + r * Math.sin(angle);
            return (
              <span
                key={i}
                className={`ga-hud-minimap-dot ${visited.has(i) ? "ga-hud-visited" : ""} ${activeCat === i ? "ga-hud-active" : ""}`}
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            );
          })}
        </div>
        <div className="ga-hud-minimap-here">▸ HERE</div>
      </div>

      <ContactDock />
    </div>
    {transitioning && (
      <TransitionOverlay
        mode={transitioning}
        onSwap={() => setStarted(true)}
        onComplete={() => setTransitioning(null)}
      />
    )}
    </>
  );
}
