"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import type { WorkplaceItem } from "@/content/portfolio";
import { SectionHeading } from "@/components/ui/section-heading";

export function Workplaces({ items, activeCompany, onSelect }: { items: WorkplaceItem[]; activeCompany: string; onSelect: (company: string) => void }) {
  const activeIndex = Math.max(0, items.findIndex((item) => item.company === activeCompany));
  const swipeStart = useRef<number | null>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const active = items[activeIndex];

  useLayoutEffect(() => {
    const selector = selectorRef.current;
    const activeTab = selector?.querySelector<HTMLButtonElement>(`#workplace-tab-${activeIndex}`);
    if (!selector || !activeTab) return;

    const updatePill = () => {
      selector.style.setProperty("--workplace-pill-left", `${activeTab.offsetLeft}px`);
      selector.style.setProperty("--workplace-pill-width", `${activeTab.offsetWidth}px`);
    };
    updatePill();
    const resizeObserver = new ResizeObserver(updatePill);
    resizeObserver.observe(selector);
    resizeObserver.observe(activeTab);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  function select(index: number) {
    onSelect(items[(index + items.length) % items.length].company);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select(activeIndex + 1);
      document.getElementById(`workplace-tab-${(activeIndex + 1) % items.length}`)?.focus();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      select(activeIndex - 1);
      document.getElementById(`workplace-tab-${(activeIndex - 1 + items.length) % items.length}`)?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0);
      document.getElementById("workplace-tab-0")?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      select(items.length - 1);
      document.getElementById(`workplace-tab-${items.length - 1}`)?.focus();
    }
  }

  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    swipeStart.current = event.pointerType === "mouse" ? null : event.clientX;
  }

  function endSwipe(event: PointerEvent<HTMLDivElement>) {
    if (swipeStart.current === null) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) > 48) select(activeIndex + (distance < 0 ? 1 : -1));
  }

  return <section className="content-section workplaces-section" id="workplaces" aria-labelledby="workplaces-title">
    <div className="chapter-kicker"><span>04</span><span>Organizations / Workplaces</span></div>
    <SectionHeading id="workplaces-title" eyebrow="WHERE I’VE WORKED" title="Where I’ve worked" description="Different teams and environments, connected by networks, systems, and delivery." />

    <div className="workplace-selector" role="tablist" aria-label="Workplaces" onKeyDown={handleKeyDown} ref={selectorRef}>
      <span className="workplace-active-pill" aria-hidden="true" />
      {items.map((item, index) => <button
        aria-controls="workplace-panel"
        aria-selected={index === activeIndex}
        className={`workplace-tab${index === activeIndex ? " is-active" : ""}`}
        id={`workplace-tab-${index}`}
        key={item.company}
        onClick={() => select(index)}
        role="tab"
        tabIndex={index === activeIndex ? 0 : -1}
        type="button"
      >
        {item.selectorLabel}
      </button>)}
    </div>

    <div className="workplace-feature" onPointerDown={startSwipe} onPointerUp={endSwipe} onPointerCancel={() => { swipeStart.current = null; }}>
      <div className="workplace-visual" aria-hidden="true">
        <Image
          alt=""
          className="workplace-image workplace-transition"
          fill
          key={active.image}
          sizes="(max-width: 720px) 100vw, 56vw"
          src={active.image}
          unoptimized={active.company === "COCA-COLA"}
          style={{ objectPosition: active.imagePosition }}
        />
      </div>

      <div className="workplace-copy workplace-transition" id="workplace-panel" key={`copy-${active.company}`} role="tabpanel" aria-labelledby={`workplace-tab-${activeIndex}`} tabIndex={0}>
        <p className="eyebrow">0{activeIndex + 1} / {active.organization}</p>
        <h3>{active.role}</h3>
        <p className="workplace-dates">{active.dates}</p>
        <p className="workplace-description">{active.description}</p>
        <ul className="workplace-areas" aria-label="Role context">
          {active.areas.map((area) => <li key={area}>{area}</li>)}
        </ul>
        <div className="workplace-arrows">
          <span>SELECT A WORKPLACE</span>
          <div>
            <button aria-label="Previous workplace" onClick={() => select(activeIndex - 1)} type="button">←</button>
            <button aria-label="Next workplace" onClick={() => select(activeIndex + 1)} type="button">→</button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
