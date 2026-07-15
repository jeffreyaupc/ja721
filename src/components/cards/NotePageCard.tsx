import Link from "next/link";
import type { Item } from "@/lib/types";

export function NotePageCard({ item }: { item: Item }) {
  if (!item.notes) return null;

  return (
    <Link href={`/notes/${item.notes.slug}`} className="block">
      <h3 className="mb-2 font-serif-tc text-lg font-semibold text-ink">
        {item.title}
      </h3>
      {item.teaser && <p className="text-sm text-ink-soft">{item.teaser}</p>}
      <span className="mt-3 inline-block font-mono text-xs uppercase tracking-wide text-moss">
        閱讀全文 →
      </span>
    </Link>
  );
}
