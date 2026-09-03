import { Smartphone, Globe, Server, MoreHorizontal } from "lucide-react";
import type {
  EventSourceType,
  EventSourceEnvironment,
} from "@/types/event-source.types";

export function EventSourceTypeIcon({ type }: { type: EventSourceType }) {
  const iconProps = { size: 18 };

  switch (type) {
    case "WEB":
      return <Globe {...iconProps} />;
    case "MOBILE":
      return <Smartphone {...iconProps} />;
    case "BACKEND":
      return <Server {...iconProps} />;
    case "OTHER":
      return <MoreHorizontal {...iconProps} />;
    default:
      return <MoreHorizontal {...iconProps} />;
  }
}

export function getEnvironmentColor(
  environment: EventSourceEnvironment,
): string {
  switch (environment) {
    case "PRODUCTION":
      return "bg-red-100 text-red-700";
    case "STAGING":
      return "bg-amber-100 text-amber-700";
    case "DEVELOPMENT":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}
