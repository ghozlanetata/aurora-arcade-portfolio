"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";
const THEME_STORAGE_KEY = "portfolio-theme";

function subscribeToTheme(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    document.documentElement.dataset.theme = event.newValue === "light" ? "light" : "dark";
    onChange();
  };
  window.addEventListener("portfolio-theme-change", onChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener("portfolio-theme-change", onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  useLayoutEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        document.documentElement.dataset.theme = saved;
        window.dispatchEvent(new Event("portfolio-theme-change"));
      }
    } catch {
      // Keep the default dark theme when storage is unavailable.
    }
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-changing");
    root.dataset.theme = nextTheme;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The current tab still changes theme when storage is unavailable.
    }

    window.dispatchEvent(new Event("portfolio-theme-change"));
    window.setTimeout(() => root.classList.remove("theme-changing"), 380);
  }

  return <button
    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    className="theme-toggle"
    onClick={toggleTheme}
    title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    type="button"
  >
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" focusable="false">
      {theme === "dark"
        ? <><circle cx="12" cy="12" r="3.8" /><path d="M12 2.5v2M12 19.5v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2.5 12h2m15 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>
        : <path d="M20.2 15.2A8.6 8.6 0 0 1 8.8 3.8 8.7 8.7 0 1 0 20.2 15.2Z" />}
    </svg>
    <span className="sr-only">{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</span>
  </button>;
}
