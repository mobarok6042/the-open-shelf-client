"use client";

import { useSyncExternalStore } from "react";

function subscribeToDate(callback) {
  const timer = window.setInterval(callback, 60_000);
  return () => window.clearInterval(timer);
}

function getDateSnapshot() {
  return new Date().toISOString().slice(0, 10);
}

function getServerDateSnapshot() {
  return "";
}

export default function CurrentDate() {
  const date = useSyncExternalStore(
    subscribeToDate,
    getDateSnapshot,
    getServerDateSnapshot,
  );

  if (!date) {
    return null;
  }

  const dateValue = new Date(`${date}T00:00:00Z`);
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(dateValue);

  return (
    <time dateTime={date} className="mt-2 block text-sm text-muted-foreground">
      {formattedDate}
    </time>
  );
}
