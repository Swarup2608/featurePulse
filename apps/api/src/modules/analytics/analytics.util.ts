import { ActivityPoint } from "./analytics.types";

export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const round = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

// Monday 00:00 UTC of the week containing `date`. Matches MongoDB's
// `$dateTrunc` with `unit: "week", startOfWeek: "monday"` so zero-fill buckets
// line up exactly with the aggregation output.
export const startOfUtcWeek = (date: Date): Date => {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utc.getUTCDay(); // 0 = Sunday
  utc.setUTCDate(utc.getUTCDate() + (day === 0 ? -6 : 1 - day));
  return utc;
};

export const seedCountMap = (keys: string[]): Record<string, number> => {
  const map: Record<string, number> = {};
  for (const key of keys) map[key] = 0;
  return map;
};

export const applyGroupCounts = (
  map: Record<string, number>,
  rows: Array<{ _id: string | null; count: number }>,
): Record<string, number> => {
  for (const row of rows) {
    const key = row._id ?? "UNKNOWN";
    map[key] = (map[key] ?? 0) + row.count;
  }
  return map;
};

// Zero-filled weekly series, oldest week first, covering `weeks` buckets ending
// with the week that contains `now`.
export const buildActivitySeries = (
  now: Date,
  weeks: number,
  rows: Array<{ _id: Date | string; featuresCreated: number }>,
): ActivityPoint[] => {
  const start = startOfUtcWeek(new Date(now.getTime() - (weeks - 1) * WEEK_MS));
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(new Date(row._id).toISOString(), row.featuresCreated);
  }
  return Array.from({ length: weeks }, (_, index) => {
    const weekStart = new Date(start.getTime() + index * WEEK_MS).toISOString();
    return { weekStart, featuresCreated: counts.get(weekStart) ?? 0 };
  });
};
