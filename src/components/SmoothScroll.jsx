"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis;

    function syncScrollBehavior() {
      lenis?.destroy();
      lenis = undefined;

      if (!motionPreference.matches) {
        lenis = new Lenis({
          anchors: true,
          autoRaf: true,
          lerp: 0.08,
          smoothWheel: true,
          wheelMultiplier: 0.9,
        });
      }
    }

    syncScrollBehavior();
    motionPreference.addEventListener("change", syncScrollBehavior);

    return () => {
      motionPreference.removeEventListener("change", syncScrollBehavior);
      lenis?.destroy();
    };
  }, []);

  return null;
}
