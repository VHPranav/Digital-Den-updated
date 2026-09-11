"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the document tab is currently visible. Used to pause
 * always-on render loops (e.g. an R3F `<Canvas frameloop>`) while the
 * user has switched away to another tab or minimized the window.
 */
export function useTabVisible() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const onVisibilityChange = () => setIsVisible(!document.hidden);
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return isVisible;
}
