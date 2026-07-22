/**
 * Single source of truth for environment configuration.
 *
 * Nothing else in the app should call `import.meta.env` directly —
 * routing every read through here means:
 *   1. a missing/misconfigured var fails loudly, once, at startup
 *      (instead of silently producing "undefined/api/..." URLs), and
 *   2. adding a new var later is a one-line change in one file.
 */

function readEnvVar(key: keyof ImportMetaEnv, fallback?: string): string {
  const value = import.meta.env[key];

  if (!value || value.trim() === "") {
    if (fallback !== undefined) return fallback;

    // Fails fast in dev/build instead of shipping a broken deploy
    // that silently calls the wrong (or no) API host.
    throw new Error(
      `[MARS config] Missing required environment variable: ${key}. ` +
        `Did you create a .env.local (dev) or set it in your Vercel project settings (prod)?`
    );
  }

  return value;
}

export const env = {
  /** Base URL of the FastAPI backend, e.g. https://mars-api.onrender.com */
  apiBaseUrl: readEnvVar("VITE_API_BASE_URL", "http://localhost:8000"),

  /** Client-side request timeout, in milliseconds. */
  apiTimeoutMs: Number(
    import.meta.env.VITE_API_TIMEOUT_MS ?? "120000" // research pipelines are slow; default generously
  ),

  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
