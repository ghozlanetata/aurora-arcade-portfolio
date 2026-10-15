"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/* ============================================================
 * CrossPageTransition — aurora curtain that sweeps across
 * when navigating between the Aurora Arcade creative view (/)
 * and the classic portfolio (/classic-portfolio).
 *
 * The overlay lives at the root layout level so it persists
 * across route changes.  Call navigateWithTransition(href)
 * instead of a plain <a href> to get the animated transition.
 *
 * Timeline (1500 ms total):
 *   0–800 ms   curtain sweeps in, backdrop becomes opaque
 *   ~800 ms    router.push(href) — page swaps behind curtain
 *   800–1500 ms  curtain sweeps out, backdrop fades, new page revealed
 * ============================================================ */

interface TransitionContextValue {
  navigateWithTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigateWithTransition: () => {},
});

export function useCrossPageTransition() {
  return useContext(TransitionContext);
}

const DURATION = 1500;
const SWAP_AT = 800;

export function CrossPageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateWithTransition = useCallback(
    (href: string) => {
      // Already transitioning — ignore
      if (active) return;

      setActive(true);

      // Swap the page behind the curtain
      swapTimer.current = setTimeout(() => {
        router.push(href, { scroll: true });
        // Belt-and-suspenders: Next.js scroll restoration can re-apply the
        // previous position on the same-path entry, so force top after render.
        setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior }), 100);
      }, SWAP_AT);

      // Remove the overlay after the full animation
      doneTimer.current = setTimeout(() => {
        setActive(false);
        // Final scroll reset — by now the new page is fully rendered and
        // any Next.js / browser scroll restoration has already fired.
        // Multiple resets catch late restoration from async image loads, etc.
        window.scrollTo(0, 0);
        requestAnimationFrame(() => window.scrollTo(0, 0));
        setTimeout(() => window.scrollTo(0, 0), 200);
        setTimeout(() => window.scrollTo(0, 0), 500);
      }, DURATION);
    },
    [active, router],
  );

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {children}
      {active && (
        <div className="cross-page-aurora" aria-hidden="true">
          <div className="cp-aurora-wrap">
            <div className="cp-aurora-backdrop" />
            <div className="cp-aurora-wave cp-aurora-wave-1" />
            <div className="cp-aurora-wave cp-aurora-wave-2" />
            <div className="cp-aurora-wave cp-aurora-wave-3" />
            <div className="cp-aurora-edge" />
          </div>
        </div>
      )}
    </TransitionContext.Provider>
  );
}
