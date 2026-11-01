"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { themeChangeEvent } from "@/lib/theme";

function subscribeToTheme(callback) {
  window.addEventListener(themeChangeEvent, callback);
  return () => window.removeEventListener(themeChangeEvent, callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
    window.dispatchEvent(new Event(themeChangeEvent));
  }, []);

  function toggleTheme() {
    const nextIsDark = !isDark;

    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="fixed bottom-5 right-5 z-50 inline-flex size-12 items-center justify-center rounded-full border border-foreground/15 bg-background/45 text-foreground shadow-lg shadow-foreground/10 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-background/70 active:scale-90 sm:bottom-7 sm:right-7"
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
