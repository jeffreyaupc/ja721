"use client";

import type { Category } from "@/lib/types";

export function FilterNav({
  categories,
  activeCategoryId,
  onChange,
}: {
  categories: Category[];
  activeCategoryId: string | "all";
  onChange: (categoryId: string | "all") => void;
}) {
  return (
    <nav className="mx-auto flex w-full max-w-5xl flex-wrap gap-2 px-6 pb-8 sm:px-10">
      <button
        onClick={() => onChange("all")}
        className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
          activeCategoryId === "all"
            ? "border-seal bg-seal text-paper-3"
            : "border-line text-ink-soft hover:border-seal/50 hover:text-seal"
        }`}
      >
        全部
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
            activeCategoryId === category.id
              ? "border-seal bg-seal text-paper-3"
              : "border-line text-ink-soft hover:border-seal/50 hover:text-seal"
          }`}
        >
          {category.label}
        </button>
      ))}
    </nav>
  );
}
