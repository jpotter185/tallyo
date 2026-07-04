// Shared helper for API routes that proxy the Spring backend. Injects the API
// key, translates timezone -> userTimeZone, and passes backend errors through
// untouched (status + body) so the client sees the real ApiError envelope.

interface ProxyOptions {
  /** Query params to forward; null/empty values are dropped. */
  params?: Record<string, string | null | undefined>;
}

export async function proxyBackend(
  path: string,
  options: ProxyOptions = {},
): Promise<Response> {
  const url = new URL(`${process.env.BACKEND_URL}${path}`);
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value) {
      url.searchParams.set(key === "timezone" ? "userTimeZone" : key, value);
    }
  }

  const response = await fetch(url, {
    headers: {
      "x-api-key": process.env.API_KEY || "",
    },
  });

  return response;
}

export async function passthroughError(response: Response): Promise<Response> {
  const rawBody = await response.text();
  return new Response(rawBody || "Backend request failed", {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "text/plain",
    },
  });
}

export async function jsonBody<T>(response: Response, fallback: T): Promise<T> {
  const rawBody = await response.text();
  return rawBody ? (JSON.parse(rawBody) as T) : fallback;
}
