// Unified HTML Fetcher for Claims Administrator websites
// Designed for stability, legality, and extensibility

export interface FetchOptions {
  url: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export interface FetchResult {
  success: boolean;
  html: string | null;
  status: number;
  error: string | null;
  url: string;
  fetchedAt: Date;
}

// Default headers to mimic normal browser requests
const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
};

/**
 * Fetch HTML from a URL with retry logic
 */
export async function fetchHTML(options: FetchOptions): Promise<FetchResult> {
  const {
    url,
    timeout = 30000,
    retries = 3,
    headers = {},
  } = options;

  const mergedHeaders = { ...DEFAULT_HEADERS, ...headers };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: "GET",
        headers: mergedHeaders,
        signal: controller.signal,
        redirect: "follow",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      return {
        success: true,
        html,
        status: response.status,
        error: null,
        url,
        fetchedAt: new Date(),
      };
    } catch (error) {
      const isLastAttempt = attempt === retries;

      if (isLastAttempt) {
        return {
          success: false,
          html: null,
          status: 0,
          error: error instanceof Error ? error.message : "Unknown error",
          url,
          fetchedAt: new Date(),
        };
      }

      // Wait before retry (exponential backoff)
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }

  // Should never reach here, but TypeScript requires return
  return {
    success: false,
    html: null,
    status: 0,
    error: "Max retries exceeded",
    url,
    fetchedAt: new Date(),
  };
}

/**
 * Fetch sitemap XML and extract URLs
 */
export async function fetchSitemap(sitemapUrl: string): Promise<string[]> {
  const result = await fetchHTML({ url: sitemapUrl });

  if (!result.success || !result.html) {
    return [];
  }

  const urls: string[] = [];
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  let match;

  while ((match = urlRegex.exec(result.html)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Rate limiter to avoid overwhelming servers
 */
export class RateLimiter {
  private lastRequestTime: Map<string, number> = new Map();
  private minInterval: number;

  constructor(minIntervalMs: number = 2000) {
    this.minInterval = minIntervalMs;
  }

  async wait(domain: string): Promise<void> {
    const lastTime = this.lastRequestTime.get(domain) || 0;
    const now = Date.now();
    const timeSinceLastRequest = now - lastTime;

    if (timeSinceLastRequest < this.minInterval) {
      await sleep(this.minInterval - timeSinceLastRequest);
    }

    this.lastRequestTime.set(domain, Date.now());
  }
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter(2000); // 2 seconds between requests per domain
