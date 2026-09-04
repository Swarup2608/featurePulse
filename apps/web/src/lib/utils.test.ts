import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins truthy class names with a space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values without leaving gaps", () => {
    expect(cn("a", undefined, "b", null, "c", false)).toBe("a b c");
  });

  it("returns an empty string when nothing survives", () => {
    expect(cn(undefined, null, false)).toBe("");
  });
});
