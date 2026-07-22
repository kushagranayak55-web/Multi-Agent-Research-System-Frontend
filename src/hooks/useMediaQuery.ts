import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Not needed for correctness in this
 * pure client-rendered Vite app, but written defensively since the
 * agent network graph (a later phase) will very likely need
 * different node layouts on mobile vs. desktop, and getting this
 * hook wrong is a common source of hydration-style flicker bugs.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = () => setMatches(mediaQueryList.matches);

    listener();
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
