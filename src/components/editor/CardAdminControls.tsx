"use client";

import { useState, useTransition } from "react";
import type { Category, Item } from "@/lib/types";
import { updateItemCategory, deleteItem } from "@/actions/items";
import { ItemEditorModal } from "./ItemEditorModal";

export function CardAdminControls({
  item,
  categories,
}: {
  item: Item;
  categories: Category[];
}) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const categoryId = e.target.value;
    startTransition(() => updateItemCategory(item.id, categoryId));
  }

  function handleDelete() {
    if (!confirm(`確定要刪除「${item.title}」嗎？`)) return;
    startTransition(() => deleteItem(item.id));
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line/60 pt-3">
      <select
        value={item.category_id}
        onChange={handleCategoryChange}
        disabled={isPending}
        className="rounded border border-line bg-paper px-2 py-1 font-mono text-[11px] text-ink-soft"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <button
        onClick={() => setEditing(true)}
        className="font-mono text-[11px] uppercase tracking-wide text-moss"
      >
        編輯
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="font-mono text-[11px] uppercase tracking-wide text-seal"
      >
        刪除
      </button>
      {editing && (
        <ItemEditorModal
          mode="edit"
          item={item}
          categories={categories}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
