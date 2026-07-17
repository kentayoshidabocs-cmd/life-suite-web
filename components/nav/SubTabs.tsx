"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SubTabs({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-black/10 dark:border-white/10 px-4 pt-3">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 ${
              active
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-black/50 dark:text-white/50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
