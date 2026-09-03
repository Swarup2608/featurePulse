import Link from "next/link";
import {
  Activity,
  BarChart3,
  Boxes,
  FolderKanban,
  Radio,
  Settings,
} from "lucide-react";

const navigationItems = [
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Features", href: "/features", icon: Boxes },
  { label: "Events", href: "/events", icon: Activity },
  { label: "Event Sources", href: "/event-sources", icon: Radio },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white">
          FP
        </div>
        <span className="text-lg font-semibold tracking-tight">
          FeaturePulse
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-200 p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
        >
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
