"use client";

import { useEffect, useRef } from "react";

/**
 * AuroraBackground — the animated aurora-borealis backdrop.
 *
 * Renders a fixed full-viewport stack of large, heavily-blurred radial
 * gradients ("blobs") that slowly drift and pulse via CSS keyframes. Three
 * parallax layers move at different speeds on scroll for depth.
 *
 * Accessibility: when the user prefers reduced motion the CSS keyframe
 * animations and parallax are both disabled (the effect degrades to a static
 * gradient) — the scroll listener is never attached.
 */
export default function AuroraBackground() {
  const farLayer = useRef<HTMLDivElement>(null);
  const midLayer = useRef<HTMLDivElement>(null);
  const nearLayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (farLayer.current)
        farLayer.current.style.transform = `translate3d(0, ${y * 0.04}px, 0)`;
      if (midLayer.current)
        midLayer.current.style.transform = `translate3d(0, ${y * -0.07}px, 0)`;
      if (nearLayer.current)
        nearLayer.current.style.transform = `translate3d(0, ${y * 0.11}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="aurora-bg" aria-hidden="true">
      {/* Deep base gradient: purples → blues → teals */}
      <div className="aurora-base" />

      {/* Parallax layer — far, slow */}
      <div className="aurora-parallax aurora-parallax--far" ref={farLayer}>
        <div className="aurora-blob aurora-blob--cyan" />
        <div className="aurora-blob aurora-blob--purple" />
      </div>

      {/* Parallax layer — mid, opposite direction */}
      <div className="aurora-parallax aurora-parallax--mid" ref={midLayer}>
        <div className="aurora-blob aurora-blob--green" />
        <div className="aurora-blob aurora-blob--blue" />
      </div>

      {/* Parallax layer — near, faster */}
      <div className="aurora-parallax aurora-parallax--near" ref={nearLayer}>
        <div className="aurora-blob aurora-blob--magenta" />
      </div>

      {/* Soft vignette + grain to anchor the glass cards */}
      <div className="aurora-grain" />
    </div>
  );
}
