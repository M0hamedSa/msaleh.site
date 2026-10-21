"use client";

import { useSyncExternalStore } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Cairo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

/** Local time in Giza, ticking every second. Renders a placeholder on the server. */
export function LiveClock({ seconds = true }: { seconds?: boolean }) {
  const time = useSyncExternalStore(
    subscribe,
    () => format.format(new Date()),
    () => "--:--:--",
  );
  return (
    <time className="tabular-nums" suppressHydrationWarning>
      {seconds ? time : time.slice(0, 5)}
    </time>
  );
}
