import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureStatusBadge } from "./feature-status-badge";

describe("FeatureStatusBadge", () => {
  it.each([
    ["DRAFT", "Draft"],
    ["ACTIVE", "Active"],
    ["RELEASED", "Released"],
    ["ARCHIVED", "Archived"],
  ] as const)("renders the %s status as %s", (status, label) => {
    render(<FeatureStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("uses the small size classes by default", () => {
    render(<FeatureStatusBadge status="ACTIVE" />);
    expect(screen.getByText("Active")).toHaveClass("text-xs");
  });

  it("switches to the medium size classes when requested", () => {
    render(<FeatureStatusBadge status="ACTIVE" size="md" />);
    expect(screen.getByText("Active")).toHaveClass("text-sm");
  });
});
