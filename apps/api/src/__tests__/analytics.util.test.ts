import {
  applyGroupCounts,
  buildActivitySeries,
  round,
  seedCountMap,
  startOfUtcWeek,
} from "../modules/analytics/analytics.util";

describe("analytics.util", () => {
  describe("round", () => {
    it("rounds to the requested precision", () => {
      expect(round(1 / 3, 4)).toBe(0.3333);
      expect(round(2 / 3, 2)).toBe(0.67);
      expect(round(5, 2)).toBe(5);
    });
  });

  describe("startOfUtcWeek", () => {
    it("returns Monday 00:00 UTC for a mid-week date", () => {
      // 2024-01-10 is a Wednesday
      const result = startOfUtcWeek(new Date("2024-01-10T15:30:00.000Z"));
      expect(result.toISOString()).toBe("2024-01-08T00:00:00.000Z");
    });

    it("treats Sunday as the last day of the week, not the first", () => {
      // 2024-01-14 is a Sunday -> week started Monday 2024-01-08
      const result = startOfUtcWeek(new Date("2024-01-14T23:59:59.000Z"));
      expect(result.toISOString()).toBe("2024-01-08T00:00:00.000Z");
    });

    it("is idempotent on a Monday", () => {
      const monday = new Date("2024-01-08T00:00:00.000Z");
      expect(startOfUtcWeek(monday).toISOString()).toBe(monday.toISOString());
    });
  });

  describe("seedCountMap / applyGroupCounts", () => {
    it("keeps every seeded key even when no rows match", () => {
      const map = seedCountMap(["DRAFT", "ACTIVE", "RELEASED", "ARCHIVED"]);
      applyGroupCounts(map, [{ _id: "ACTIVE", count: 3 }]);
      expect(map).toEqual({ DRAFT: 0, ACTIVE: 3, RELEASED: 0, ARCHIVED: 0 });
    });

    it("buckets unknown/null group ids under UNKNOWN", () => {
      const map = seedCountMap(["WEB"]);
      applyGroupCounts(map, [
        { _id: "WEB", count: 1 },
        { _id: null, count: 2 },
      ]);
      expect(map).toEqual({ WEB: 1, UNKNOWN: 2 });
    });
  });

  describe("buildActivitySeries", () => {
    const now = new Date("2024-01-31T12:00:00.000Z"); // Wednesday

    it("returns exactly `weeks` zero-filled buckets, oldest first", () => {
      const series = buildActivitySeries(now, 8, []);
      expect(series).toHaveLength(8);
      expect(series.every((point) => point.featuresCreated === 0)).toBe(true);
      const timestamps = series.map((p) => p.weekStart);
      expect([...timestamps].sort()).toEqual(timestamps);
      // last bucket is the week containing `now`
      expect(series[7].weekStart).toBe("2024-01-29T00:00:00.000Z");
    });

    it("merges aggregation rows into the matching week bucket", () => {
      const series = buildActivitySeries(now, 4, [
        { _id: "2024-01-29T00:00:00.000Z", featuresCreated: 5 },
        { _id: new Date("2024-01-15T00:00:00.000Z"), featuresCreated: 2 },
      ]);
      const byWeek = Object.fromEntries(series.map((p) => [p.weekStart, p.featuresCreated]));
      expect(byWeek["2024-01-29T00:00:00.000Z"]).toBe(5);
      expect(byWeek["2024-01-15T00:00:00.000Z"]).toBe(2);
      expect(byWeek["2024-01-22T00:00:00.000Z"]).toBe(0);
    });

    it("ignores rows outside the window", () => {
      const series = buildActivitySeries(now, 2, [
        { _id: "2023-12-01T00:00:00.000Z", featuresCreated: 99 },
      ]);
      expect(series.reduce((sum, p) => sum + p.featuresCreated, 0)).toBe(0);
    });
  });
});
