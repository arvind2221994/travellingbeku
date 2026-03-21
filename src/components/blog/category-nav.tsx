"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tag, LayoutGrid } from "lucide-react";

interface CategoryNavProps {
  categories: string[];
  active?: string;
}

export function CategoryNav({ categories, active }: CategoryNavProps) {
  const searchParams = useSearchParams();

  const makeHref = (cat?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    return `/blogs${params.size ? `?${params}` : ""}`;
  };

  return (
    <nav className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600 px-3 mb-3">
        Categories
      </p>

      <Link
        href={makeHref()}
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
          !active
            ? "bg-orange-500/10 text-orange-400 font-medium"
            : "text-neutral-400 hover:text-white hover:bg-white/5"
        )}
      >
        <LayoutGrid size={14} />
        All posts
      </Link>

      {categories.map((cat) => (
        <Link
          key={cat}
          href={makeHref(cat)}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm capitalize transition-colors",
            active === cat
              ? "bg-orange-500/10 text-orange-400 font-medium"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Tag size={14} />
          {cat}
        </Link>
      ))}
    </nav>
  );
}
