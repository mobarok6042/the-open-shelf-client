"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function NavigationLoading() {
  const pathname = usePathname();
  const [pendingNavigation, setPendingNavigation] = useState(null);

  useEffect(() => {
    function startNavigation(destination) {
      setPendingNavigation({
        from: pathname,
        destination,
      });
    }

    function handleClick(event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event.target.closest("a[href]");
      if (!link || link.target || link.hasAttribute("download")) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        (destination.pathname === window.location.pathname &&
          destination.search === window.location.search)
      ) {
        return;
      }

      startNavigation(destination.pathname);
    }

    function handleProgrammaticNavigation(event) {
      startNavigation(event.detail);
    }

    function handlePopState() {
      startNavigation(window.location.pathname);
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("open-shelf:navigate", handleProgrammaticNavigation);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("open-shelf:navigate", handleProgrammaticNavigation);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  useEffect(() => {
    if (!pendingNavigation) {
      return;
    }

    const timeout = window.setTimeout(
      () => setPendingNavigation(null),
      pendingNavigation.destination === pendingNavigation.from ? 900 : 15000,
    );
    return () => window.clearTimeout(timeout);
  }, [pendingNavigation]);

  const isNavigating = pendingNavigation?.from === pathname;

  if (!isNavigating) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/45 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex items-center gap-3 rounded-full border border-foreground/10 bg-background/85 px-5 py-3 text-sm font-medium text-foreground shadow-xl backdrop-blur-xl">
        <LoadingSpinner className="size-5 text-primary" />
        Loading page...
      </div>
    </div>
  );
}
