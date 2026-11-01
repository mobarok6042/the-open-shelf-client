"use client";

import { useSyncExternalStore } from "react";
import { Toaster } from "sonner";

import { themeChangeEvent } from "@/lib/theme";

function subscribeToTheme(callback) {
  window.addEventListener(themeChangeEvent, callback);
  return () => window.removeEventListener(themeChangeEvent, callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerThemeSnapshot() {
  return "light";
}

export default function AppToaster() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  return <Toaster theme={theme} position="top-right" richColors closeButton />;
}
