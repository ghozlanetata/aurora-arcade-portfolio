"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const chapters = [
  ["ABOUT", "about"],
  ["SKILLS", "skills"],
  ["WORK", "projects"],
  ["WORKPLACES", "workplaces"],
  ["ROLES", "experience"],
  ["CERTIFICATIONS", "certifications"],
  ["ACADEMIC", "academic-projects"],
  ["CONTACT", "contact"],
] as const;

export function ChapterNav() {
  const [activeId, setActiveId] = useState<string>(chapters[0][1]);
  const navRef = useRef<HTMLElement>(null);
  const activeIdRef = useRef(activeId);

  function activate(id: string) {
    activeIdRef.current = id;
    setActiveId(id);
  }

  useEffect(() => {
    const sections = [document.getElementById("top"), ...chapters.map(([, id]) => document.getElementById(id))]
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(() => {
      const activationLine = window.innerHeight * .43;
      const activeSection = sections.find((section) => section.id === activeIdRef.current);
      if (activeSection) {
        const rect = activeSection.getBoundingClientRect();
        if (rect.top <= activationLine && rect.bottom > activationLine) return;
      }

      const closest = sections
        .map((section) => {
          const rect = section.getBoundingClientRect();
          const distance = activationLine < rect.top ? rect.top - activationLine : activationLine > rect.bottom ? activationLine - rect.bottom : 0;
          return { section, distance };
        })
        .sort((a, b) => a.distance - b.distance)[0];
      if (closest) {
        activate(closest.section.id === "top" ? chapters[0][1] : closest.section.id);
      }
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const list = nav.querySelector("ol");
    const activeLink = nav.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`);
    if (!list || !activeLink) return;

    const update = () => {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      const inset = 8;
      if (linkRect.left < navRect.left + inset) {
        nav.scrollTo({ left: nav.scrollLeft - (navRect.left + inset - linkRect.left), behavior: "smooth" });
      } else if (linkRect.right > navRect.right - inset) {
        nav.scrollTo({ left: nav.scrollLeft + (linkRect.right - navRect.right + inset), behavior: "smooth" });
      }
      const listRect = list.getBoundingClientRect();
      nav.style.setProperty("--active-left", `${linkRect.left - listRect.left}px`);
      nav.style.setProperty("--active-width", `${linkRect.width}px`);
    };
    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(nav);
    resizeObserver.observe(list);
    window.addEventListener("resize", update);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [activeId]);

  return <nav className="chapter-nav" aria-label="Portfolio sections" ref={navRef}>
    <ol>
      <li className="chapter-active-pill" aria-hidden="true" />
      {chapters.map(([label, id]) =>
        <li key={id}>
          <a href={"#" + id} aria-current={activeId === id ? "location" : undefined} onClick={() => activate(id)}>
            {label}
          </a>
        </li>
      )}
    </ol>
  </nav>;
}
