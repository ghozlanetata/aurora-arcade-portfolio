"use client";

import { useCrossPageTransition } from "@/components/transition/CrossPageTransition";

export function CreativeViewButton() {
  const { navigateWithTransition } = useCrossPageTransition();

  return (
    <button
      className="creative-view-btn"
      aria-label="Switch to creative arcade portfolio view"
      onClick={() => navigateWithTransition("/")}
    >
      <span className="creative-view-icon" aria-hidden="true">🕹</span>
      <span className="creative-view-label">Creative View</span>
    </button>
  );
}
