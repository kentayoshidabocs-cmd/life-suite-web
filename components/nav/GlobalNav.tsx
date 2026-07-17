"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Briefcase, Heart, Dumbbell } from "lucide-react";

const NAV_ITEMS = [
  { href: "/campus", label: "Campus", icon: GraduationCap },
  { href: "/work", label: "Work", icon: Briefcase },
  { href: "/love", label: "Love", icon: Heart },
  { href: "/fitness", label: "Fitness", icon: Dumbbell },
];

export function GlobalNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        flex md:flex-col md:w-20 md:h-full md:py-6 md:gap-2
        fixed bottom-0 left-0 right-0 md:static
        border-t md:border-t-0 md:border-r border-black/10 dark:border-white/10
        bg-white/90 dark:bg-black/80 backdrop-blur z-30
      "
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 md:flex-none flex flex-col items-center justify-center gap-1 py-2 md:py-4 text-xs
              ${active ? "text-blue-600 dark:text-blue-400" : "text-black/50 dark:text-white/50"}`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
