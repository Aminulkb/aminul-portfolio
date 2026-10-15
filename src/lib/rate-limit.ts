// Simple in-memory fixed-window rate limiter for the contact endpoint.
//
// Good enough for a single Node.js server process (e.g. `next start` on a VPS).
// LIMITATION: this resets on server restart and does NOT share state across
// multiple instances/regions. If you deploy to a multi-instance or serverless
// platform where that matters, replace this with a shared store such as
// Upstash Redis — see README.md for notes on this trade-off.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

function cleanupStaleBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS) buckets.delete(key);
  }
}

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  if (buckets.size > 5000) cleanupStaleBuckets(now);

  const bucket = buckets.get(identifier);
  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(identifier, { count: 1, windowStart: now });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - bucket.windowStart) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
