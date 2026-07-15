"use client";

import { useState, useTransition } from "react";
import { uploadNoteImage } from "@/actions/notes";

export function NoteImageUploader({
  itemId,
  onUploaded,
}: {
  itemId: string;
  onUploaded: (url: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    setError(null);
    startTransition(async () => {
      try {
        const url = await uploadNoteImage(itemId, formData);
        onUploaded(url);
      } catch {
        setError("上傳失敗，請再試一次。");
      } finally {
        e.target.value = "";
      }
    });
  }

  return (
    <label className="flex flex-col gap-1 text-sm">
      插入圖片（上傳後自動貼入下方內容，游標所在位置）
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={isPending}
      />
      {isPending && (
        <span className="font-mono text-[11px] text-ink-faint">上傳中...</span>
      )}
      {error && <span className="font-mono text-[11px] text-seal">{error}</span>}
    </label>
  );
}
