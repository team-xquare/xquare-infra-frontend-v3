const TIMEOUT_MS = 15000; // 15 seconds

export interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * @param url - The URL to fetch
 * @param options - Fetch options (can include custom timeout in ms)
 * @returns Promise with Response
 * @throws Error if timeout or network error occurs
 */
export const fetchWithTimeout = async (
  url: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const timeout = options.timeout ?? TIMEOUT_MS;
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    console.error("[fetchWithTimeout] timeout", {
      url,
      timeout,
      method: options.method || "GET",
    });
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Check if it's a timeout error (abort)
    if (error instanceof Error && error.name === "AbortError") {
      const errorMsg = `요청 타임아웃 (${timeout}ms): ${url}`;
      console.error("[fetchWithTimeout] aborted", {
        url,
        timeout,
        method: options.method || "GET",
      });
      throw new Error(errorMsg);
    }

    throw error;
  }
};
