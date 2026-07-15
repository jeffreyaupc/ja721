"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { Category, Item } from "@/lib/types";
import { createItem, updateItem } from "@/actions/items";
import { MediaUploader } from "./MediaUploader";

export function ItemEditorModal({
  mode,
  item,
  categories,
  defaultCategoryId,
  onClose,
}: {
  mode: "create" | "edit";
  item?: Item;
  categories: Category[];
  defaultCategoryId?: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [categoryId, setCategoryId] = useState(
    item?.category_id ?? defaultCategoryId ?? categories[0]?.id ?? ""
  );
  const [isPending, startTransition] = useTransition();
  const category = categories.find((c) => c.id === categoryId);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function handleClose() {
    dialogRef.current?.close();
    onClose();
  }

  function handleSubmit(formData: FormData) {
    formData.set("category_id", categoryId);
    startTransition(async () => {
      if (mode === "create") {
        await createItem(formData);
      } else if (item) {
        await updateItem(item.id, formData);
      }
      handleClose();
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-full max-w-lg rounded-sm border border-line bg-paper-3 p-6 text-ink backdrop:bg-ink/40"
    >
      <form action={handleSubmit} className="flex flex-col gap-3">
        <h2 className="font-serif-tc text-lg font-semibold">
          {mode === "create" ? "新增內容" : "編輯內容"}
        </h2>

        <label className="flex flex-col gap-1 text-sm">
          分類
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded border border-line bg-paper px-2 py-1"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          標題
          <input
            name="title"
            defaultValue={item?.title ?? ""}
            required
            className="rounded border border-line bg-paper px-2 py-1"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Teaser / 一句描述
          <input
            name="teaser"
            defaultValue={item?.teaser ?? ""}
            className="rounded border border-line bg-paper px-2 py-1"
          />
        </label>

        {(category?.display_style === "teaser_reveal" ||
          category?.display_style === "full_text") && (
          <label className="flex flex-col gap-1 text-sm">
            全文內容
            <textarea
              name="body"
              defaultValue={item?.body ?? ""}
              rows={5}
              className="rounded border border-line bg-paper px-2 py-1"
            />
          </label>
        )}

        {category?.display_style === "audio_player" && (
          <label className="flex flex-col gap-1 text-sm">
            Original / Cover
            <select
              name="song_kind"
              defaultValue={item?.song_kind ?? "original"}
              className="rounded border border-line bg-paper px-2 py-1"
            >
              <option value="original">Original</option>
              <option value="cover">Cover</option>
            </select>
          </label>
        )}

        {category?.display_style === "tag_list" && (
          <label className="flex flex-col gap-1 text-sm">
            標籤（逗號分隔）
            <input
              name="tags"
              defaultValue={item?.tags.join(", ") ?? ""}
              className="rounded border border-line bg-paper px-2 py-1"
            />
          </label>
        )}

        {mode === "edit" &&
          item &&
          (category?.display_style === "image_caption" ||
            category?.display_style === "audio_player") && (
            <MediaUploader
              itemId={item.id}
              field={
                category.display_style === "image_caption"
                  ? "image_url"
                  : "audio_url"
              }
              currentUrl={
                category.display_style === "image_caption"
                  ? item.image_url
                  : item.audio_url
              }
            />
          )}

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="font-mono text-xs uppercase text-ink-faint"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-seal px-3 py-1 font-mono text-xs uppercase text-paper-3"
          >
            {isPending ? "儲存中..." : "儲存"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
