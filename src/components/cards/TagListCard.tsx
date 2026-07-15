import type { Item } from "@/lib/types";

export function TagListCard({ item }: { item: Item }) {
  return (
    <div>
      <h3 className="mb-1 font-serif-tc text-base font-semibold text-ink">
        {item.title}
      </h3>
      {item.teaser && (
        <p className="mb-3 text-sm text-ink-soft">{item.teaser}</p>
      )}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
