"use client";

import type { ProjectItem } from "@/content/portfolio";
import { SectionHeading } from "@/components/ui/section-heading";
import { useEffect, useRef, useState } from "react";

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

  return <video ref={videoRef} controls muted autoPlay={autoplayAllowed} preload="metadata" playsInline aria-label="Network Fault Intelligence platform demonstration">
    <source src="/videos/network-fault-intelligence-demo.mp4" type="video/mp4" />
    Your browser does not support the video element.
  </video>;
}

export function Projects({ items }: { items: ProjectItem[] }) {
  const secondaryProjects = items;

  return <section className="content-section work-section" id="projects" aria-labelledby="projects-title">
    <div className="chapter-kicker"><span>03</span><span>Selected work / Engineering case studies</span></div>
    <SectionHeading id="projects-title" eyebrow="NETWORK INTELLIGENCE / INFRASTRUCTURE / AUTOMATION" title="Selected work" description="A network fault intelligence platform, followed by selected Kubernetes, CI/CD, and GitOps engineering projects." />
    <article className="featured-project" aria-labelledby="nfi-title">
      <div className="featured-project-media">
        <FeaturedVideo />
      </div>
      <div className="featured-project-copy">
        <p className="eyebrow">FEATURED PROJECT / NETWORK INTELLIGENCE</p>
        <h3 id="nfi-title">Network Fault Intelligence</h3>
        <p className="featured-project-subtitle">Network KPI analysis, fault detection and classification</p>
        <p className="featured-project-description">An end-to-end Network Fault Intelligence platform that uses mobile network KPIs and machine learning to detect and classify network faults. It combines a trained ML pipeline, a FastAPI backend, and an operator-focused interface to turn network performance data into actionable fault insights, with a containerized architecture designed for deployment on Kubernetes.</p>
        <div className="featured-project-stack">
          <p className="eyebrow">PLATFORM COMPONENTS</p>
          <p>Network KPI analysis · Machine learning · Application, backend &amp; ML architecture</p>
        </div>
        <a className="project-repository-link" href="https://github.com/ghozlanetata/network-fault-intelligence-platform" target="_blank" rel="noreferrer">View GitHub repository <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
      </div>
    </article>
    <div className="secondary-project-grid" aria-label="More engineering projects">
      {secondaryProjects.map((item, index) => <article className="secondary-project-card" key={item.name}>
        <div className="secondary-project-meta"><span>{String(index + 1).padStart(2, "0")}</span><span>{item.category}</span>{item.status ? <span>{item.status}</span> : null}</div>
        <h3>{item.name}</h3>
        <p className="secondary-project-subtitle">{item.subtitle}</p>
        <p className="secondary-project-overview">{item.overview}</p>
        <ul className="secondary-project-tech" aria-label={`${item.name} technologies`}>{item.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
        <details className="secondary-project-details">
          <summary>Technical focus and architecture</summary>
          <p className="eyebrow">PROJECT FOCUS</p>
          <ul className="project-focus" aria-label={`${item.name} focus`}>{item.focus.map((focus) => <li key={focus}>{focus}</li>)}</ul>
          <figure className="project-architecture">
            <figcaption><span>{item.diagramLabel}</span><span>{item.status?.toUpperCase() ?? "IMPLEMENTED OVERVIEW"}</span></figcaption>
            <div className={`project-diagram-lanes${item.compactDiagram ? " project-diagram-lanes-compact" : ""}`}>
              {item.diagramLanes.map((lane) => <section className="project-diagram-lane" key={lane.title}>
                <h4>{lane.title}</h4>
                <ol aria-label={`${lane.title} flow`}>{lane.steps.map((step, stepIndex) => <li key={`${step}-${stepIndex}`}><span>{step}</span>{stepIndex < lane.steps.length - 1 ? <span className="project-diagram-arrow" aria-hidden="true">→</span> : null}</li>)}</ol>
                {lane.details?.length ? <ul className="project-diagram-details" aria-label={`${lane.title} details`}>{lane.details.map((detail) => <li key={detail}>{detail}</li>)}</ul> : null}
              </section>)}
            </div>
          </figure>
          <p className="eyebrow">HIGHLIGHTS</p>
          <ul className="case-study-highlights">{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
        </details>
        {item.repositoryUrl ? <a href={item.repositoryUrl} target="_blank" rel="noreferrer" aria-label={`View ${item.name} GitHub repository`}>View GitHub repository <span aria-hidden="true">↗</span></a> : null}
      </article>)}
    </div>
  </section>;
}
