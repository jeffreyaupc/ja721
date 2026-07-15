"use client";

import { useState, useTransition } from "react";
import { uploadMedia } from "@/actions/items";

export function MediaUploader({
  itemId,
  field,
  currentUrl,
}: {
  itemId: string;
  field: "image_url" | "audio_url";
  currentUrl: string | null;
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
        await uploadMedia(itemId, field, formData);
      } catch {
        setError("上傳失敗，請再試一次。");
      }
    });
  }

  return (
    <label className="flex flex-col gap-1 text-sm">
      {field === "image_url" ? "圖片" : "音檔"}
      {currentUrl && (
        <span className="truncate font-mono text-[11px] text-ink-faint">
          {currentUrl}
        </span>
      )}
      <input
        type="file"
        accept={field === "image_url" ? "image/*" : "audio/*"}
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
