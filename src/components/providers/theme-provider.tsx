import * as React from "react";

type Theme = "dark";

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

/**
 * MARS ships dark-only, by design decision (see Design System brief),
 * not by omission. This provider still exists — rather than just
 * hardcoding `dark` classes everywhere — for two reasons:
 *
 *  1. Components read theme state from context instead of assuming
 *     a global, so nothing has to change if a light/"contrast" mode
 *     is ever introduced.
 *  2. `index.html` already sets `class="dark"` on <html> synchronously,
 *     so there is zero flash-of-unstyled-theme on first paint — this
 *     provider does not need to (and must not) toggle that class
 *     itself on mount.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo<ThemeContextValue>(() => ({ theme: "dark" }), []);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
