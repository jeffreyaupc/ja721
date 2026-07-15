"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";
import { ItemEditorModal } from "./ItemEditorModal";

export function AddItemButton({
  categories,
  defaultCategoryId,
}: {
  categories: Category[];
  defaultCategoryId?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-seal px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-seal transition-colors hover:bg-seal hover:text-paper-3"
      >
        + 新增
      </button>
      {open && (
        <ItemEditorModal
          mode="create"
          categories={categories}
          defaultCategoryId={defaultCategoryId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
