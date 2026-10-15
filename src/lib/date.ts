import { cacheLife } from "next/cache";

/**
 * `new Date()` is non-deterministic, which Cache Components (next.config.ts)
 * forbids while prerendering the static shell. Caching it keeps pages fully
 * static while still rolling over periodically.
 */
export async function getCachedNow(): Promise<Date> {
  "use cache";
  cacheLife("days");
  return new Date();
}
