"use client";

import { useRef, useState, useTransition, type ElementType } from "react";

export function EditableText({
  as: Tag = "span",
  value,
  onSave,
  className,
  multiline = false,
}: {
  as?: ElementType;
  value: string;
  onSave: (value: string) => Promise<void>;
  className?: string;
  multiline?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(value);
  const [, startTransition] = useTransition();

  function handleBlur() {
    const next = ref.current?.textContent?.trim() ?? "";
    if (next === current) return;
    const previous = current;
    setCurrent(next);
    startTransition(async () => {
      try {
        await onSave(next);
      } catch {
        setCurrent(previous);
        if (ref.current) ref.current.textContent = previous;
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
  }

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className ?? ""} cursor-text rounded outline-none focus:bg-paper-2/60 focus:ring-1 focus:ring-seal/40`}
    >
      {current}
    </Tag>
  );
}
