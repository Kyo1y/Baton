import "server-only";

type AwsDbOptions = {
    headers?: Record<string, string>;
    timeoutMs?: number;
    cache?: RequestCache;
}

class AwsDbError extends Error {
  status: number;
  url: string;
  bodyText?: string;

  constructor(message: string, status: number, url: string, bodyText?: string) {
    super(message);
    this.name = "AwsDbError";
    this.status = status;
    this.url = url;
    this.bodyText = bodyText;
  }
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const AWS_API_URL = requireEnv("AWS_API_URL");
const AWS_API_KEY = requireEnv("AWS_API_KEY");

function buildUrl(path: string, query?: Record<string, string | number | boolean | null | undefined>) {
  const base = AWS_API_URL.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(base + p);

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === null || v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function awsFetch<T>(
  method: string,
  path: string,
  opts: AwsDbOptions & { query?: Record<string, any>; body?: any } = {}
): Promise<T> {
  const url = buildUrl(path, opts.query);

  const timeoutMs = opts.timeoutMs ?? 10_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      cache: opts.cache ?? "no-store",
      headers: {
        "content-type": "application/json",
        "x-api-key": AWS_API_KEY,
        ...opts.headers,
      },
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: controller.signal,
    });

    // Read text first so we can surface useful errors
    const text = await res.text();
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      throw new AwsDbError(`AWS API error ${res.status} for ${method} ${path}`, res.status, url, text);
    }

    // Handle empty body responses
    if (!text) return undefined as T;

    // Parse JSON when appropriate
    if (contentType.includes("application/json")) {
      return JSON.parse(text) as T;
    }

    // Otherwise return text as any
    return text as unknown as T;
  } finally {
    clearTimeout(timer);
  }
}

// Public helpers
export function awsGet<T>(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
  opts?: AwsDbOptions
) {
  return awsFetch<T>("GET", path, { ...opts, query });
}

export function awsPost<T>(path: string, body: unknown, opts?: AwsDbOptions) {
  return awsFetch<T>("POST", path, { ...opts, body });
}

export function awsPut<T>(path: string, body: unknown, opts?: AwsDbOptions) {
  return awsFetch<T>("PUT", path, { ...opts, body });
}

export function awsDelete<T>(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
  opts?: AwsDbOptions
) {
  return awsFetch<T>("DELETE", path, { ...opts, query });
}

export { AwsDbError };