import { Bell, ChevronDown, Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50">
          <span>My Workspace</span>
          <ChevronDown size={16} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
        >
          <Search size={18} />
        </button>
        <button
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
        >
          <Bell size={18} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
          S
        </button>
      </div>
    </header>
  );
}
