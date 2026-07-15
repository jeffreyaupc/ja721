"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";

export function TeaserRevealCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h3 className="mb-2 font-serif-tc text-lg font-semibold text-ink">
        {item.title}
      </h3>
      {item.teaser && <p className="text-sm text-ink-soft">{item.teaser}</p>}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="mt-3 whitespace-pre-line border-t border-line/60 pt-3 text-sm leading-relaxed text-ink-soft">
            {item.body}
          </p>
        </div>
      </div>
      {item.body && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-3 font-mono text-xs uppercase tracking-wide text-seal"
        >
          {open ? "收起" : "展開全文"}
        </button>
      )}
    </div>
  );
}
