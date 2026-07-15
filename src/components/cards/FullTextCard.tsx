import type { Item } from "@/lib/types";

export function FullTextCard({ item }: { item: Item }) {
  return (
    <div>
      {item.title && (
        <h3 className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-faint">
          {item.title}
        </h3>
      )}
      <p className="whitespace-pre-line font-serif-tc text-base leading-loose text-ink">
        {item.body}
      </p>
    </div>
  );
}
