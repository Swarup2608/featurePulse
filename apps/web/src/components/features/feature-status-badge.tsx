import type { FeatureStatus } from "@/types/feature.types";

interface FeatureStatusBadgeProps {
  status: FeatureStatus;
  size?: "sm" | "md";
}

const statusConfig: Record<FeatureStatus, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: "bg-zinc-100", text: "text-zinc-700", label: "Draft" },
  ACTIVE: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Active" },
  RELEASED: { bg: "bg-violet-100", text: "text-violet-700", label: "Released" },
  ARCHIVED: { bg: "bg-slate-100", text: "text-slate-700", label: "Archived" },
};

export function FeatureStatusBadge({ status, size = "sm" }: FeatureStatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`inline-flex rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      {config.label}
    </span>
  );
}
