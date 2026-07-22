import { env } from "@/config/env";
import { ApiError } from "@/services/types/research.types";

interface RequestOptions extends RequestInit {
  /** Overrides the default env.apiTimeoutMs for this call. */
  timeoutMs?: number;
  /** Number of automatic retries on network failure or 5xx. Default 0. */
  retries?: number;
  /** External abort signal (e.g. a user-triggered "Cancel" action), combined with the internal timeout signal. */
  signal?: AbortSignal;
}

async function parseErrorBody(response: Response): Promise<string> {
  try {
    const data = await response.clone().json();
    if (typeof data?.detail === "string") return data.detail;
    return JSON.stringify(data);
  } catch {
    try {
      return await response.text();
    } catch {
      return response.statusText;
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Thin fetch wrapper — deliberately not axios. The API surface we
 * need (timeout, JSON parsing, one error shape, opt-in retry) is
 * small enough that native fetch keeps the dependency graph (and
 * the Vercel bundle) lighter without losing anything.
 *
 * All request paths in the app should go through `apiClient`, never
 * call `fetch` directly, so error handling stays consistent.
 */
export async function apiClient<TResponse>(
  path: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const { timeoutMs = env.apiTimeoutMs, retries = 0, signal: externalSignal, ...init } = options;

  const url = `${env.apiBaseUrl}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs);

  const onExternalAbort = () => controller.abort("cancelled");
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort("cancelled");
    else externalSignal.addEventListener("abort", onExternalAbort);
  }

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...init.headers,
      },
    });

    if (!response.ok) {
      const message = await parseErrorBody(response);

      // Retry once on server-side failure before giving up, since
      // Render free-tier instances can cold-start into a transient 502/503.
      if (retries > 0 && response.status >= 500) {
        await wait(800);
        return apiClient<TResponse>(path, { ...options, retries: retries - 1 });
      }

      throw new ApiError(
        message || `Request failed with status ${response.status}`,
        response.status
      );
    }

    if (response.status === 204) return undefined as TResponse;

    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof DOMException && error.name === "AbortError") {
      if (controller.signal.reason === "cancelled") {
        throw new ApiError("Research run cancelled.", null, error);
      }
      throw new ApiError(
        "The request took too long to respond. The research pipeline may still be running on the server.",
        null,
        error
      );
    }

    if (retries > 0) {
      await wait(800);
      return apiClient<TResponse>(path, { ...options, retries: retries - 1 });
    }

    throw new ApiError(
      "Could not reach the MARS backend. Check your connection and try again.",
      null,
      error
    );
  } finally {
    clearTimeout(timeout);
    if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);
  }
}
