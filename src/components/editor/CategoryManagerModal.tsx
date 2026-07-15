"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { Category, DisplayStyle } from "@/lib/types";
import {
  createCategory,
  deleteCategory,
  moveCategory,
} from "@/actions/categories";

const STYLE_LABELS: Record<DisplayStyle, string> = {
  teaser_reveal: "小碎片（點擊展開全文）",
  full_text: "小句（卡片顯示全文）",
  image_caption: "畫（圖片＋說明）",
  audio_player: "歌（簡單播放器）",
  tag_list: "Portfolio（標籤列表）",
  note_page: "筆記（獨立頁面）",
};

export function CategoryManagerModal({
  categories,
  onClose,
}: {
  categories: Category[];
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const [newStyle, setNewStyle] = useState<DisplayStyle>("teaser_reveal");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function handleClose() {
    dialogRef.current?.close();
    onClose();
  }

  function handleCreate(formData: FormData) {
    startTransition(() => createCategory(formData));
  }

  function handleDelete(categoryId: string) {
    startTransition(async () => {
      const result = await deleteCategory(categoryId);
      setError(result.error ?? null);
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-full max-w-md rounded-sm border border-line bg-paper-3 p-6 text-ink backdrop:bg-ink/40"
    >
      <h2 className="mb-4 font-serif-tc text-lg font-semibold">管理分類</h2>

      <ul className="mb-4 flex flex-col gap-2">
        {categories.map((c, i) => (
          <li
            key={c.id}
            className="flex items-center justify-between gap-2 border-b border-line/60 pb-2 text-sm"
          >
            <div>
              <p>{c.label}</p>
              <p className="font-mono text-[10px] text-ink-faint">
                {STYLE_LABELS[c.display_style]}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={i === 0 || isPending}
                onClick={() => startTransition(() => moveCategory(c.id, "up"))}
                className="px-1 text-ink-faint disabled:opacity-30"
              >
                ↑
              </button>
              <button
                disabled={i === categories.length - 1 || isPending}
                onClick={() =>
                  startTransition(() => moveCategory(c.id, "down"))
                }
                className="px-1 text-ink-faint disabled:opacity-30"
              >
                ↓
              </button>
              <button
                disabled={isPending}
                onClick={() => handleDelete(c.id)}
                className="px-1 font-mono text-[11px] uppercase text-seal"
              >
                刪除
              </button>
            </div>
          </li>
        ))}
      </ul>

      {error && (
        <p className="mb-3 font-mono text-[11px] text-seal">{error}</p>
      )}

      <form
        action={handleCreate}
        className="flex flex-col gap-2 border-t border-line/60 pt-4"
      >
        <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">
          新增分類
        </p>
        <input
          name="label"
          placeholder="分類名稱"
          required
          className="rounded border border-line bg-paper px-2 py-1 text-sm"
        />
        <select
          name="display_style"
          value={newStyle}
          onChange={(e) => setNewStyle(e.target.value as DisplayStyle)}
          className="rounded border border-line bg-paper px-2 py-1 text-sm"
        >
          {Object.entries(STYLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="self-end rounded bg-seal px-3 py-1 font-mono text-xs uppercase text-paper-3"
        >
          新增
        </button>
      </form>

      <button
        onClick={handleClose}
        className="mt-4 font-mono text-xs uppercase text-ink-faint"
      >
        關閉
      </button>
    </dialog>
  );
}
