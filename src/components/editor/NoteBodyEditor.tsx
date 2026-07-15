"use client";

import { useState, useTransition } from "react";
import type { Item, Note, NoteTemplate } from "@/lib/types";
import { updateNoteBody } from "@/actions/notes";
import { updateItemField } from "@/actions/items";
import { EditableText } from "./EditableText";
import { StandardNoteArticle } from "@/components/notes/StandardNoteArticle";

export function NoteBodyEditor({ item, note }: { item: Item; note: Note }) {
  const [template, setTemplate] = useState<NoteTemplate>(note.template);
  const [markdown, setMarkdown] = useState(note.markdown_body ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(formData: FormData) {
    setSaved(false);
    startTransition(async () => {
      await updateNoteBody(item.id, formData);
      setSaved(true);
    });
  }

  return (
    <div className="note-editor-panel">
      <p className="mb-3 font-mono text-xs uppercase tracking-wide text-ink-faint">
        作者編輯
      </p>

      <div className="mb-4 text-sm">
        <p className="mb-1 font-mono text-[11px] text-ink-faint">
          標題（點擊修改）
        </p>
        <EditableText
          value={item.title}
          onSave={(v) => updateItemField(item.id, "title", v)}
          className="inline-block font-serif-tc text-base font-semibold"
        />
      </div>
      <div className="mb-4 text-sm">
        <p className="mb-1 font-mono text-[11px] text-ink-faint">
          Teaser（點擊修改）
        </p>
        <EditableText
          value={item.teaser ?? ""}
          onSave={(v) => updateItemField(item.id, "teaser", v)}
          className="inline-block"
        />
      </div>

      <form action={handleSubmit} className="flex flex-col gap-3">
        <input type="hidden" name="slug" defaultValue={note.slug} />

        <label className="flex flex-col gap-1 text-sm">
          模板
          <select
            name="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value as NoteTemplate)}
            className="rounded border border-line bg-paper px-2 py-1"
          >
            <option value="standard">Standard（Markdown）</option>
            <option value="custom">Custom（HTML/CSS）</option>
          </select>
        </label>

        {template === "standard" ? (
          <label className="flex flex-col gap-1 text-sm">
            Markdown 內容
            <textarea
              name="markdown_body"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={12}
              className="rounded border border-line bg-paper px-2 py-1 font-mono text-xs"
            />
          </label>
        ) : (
          <>
            <label className="flex flex-col gap-1 text-sm">
              自訂 HTML
              <textarea
                name="custom_html"
                defaultValue={note.custom_html ?? ""}
                rows={12}
                className="rounded border border-line bg-paper px-2 py-1 font-mono text-xs"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              自訂 CSS
              <textarea
                name="custom_css"
                defaultValue={note.custom_css ?? ""}
                rows={12}
                className="rounded border border-line bg-paper px-2 py-1 font-mono text-xs"
              />
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="self-start rounded bg-seal px-3 py-1 font-mono text-xs uppercase text-paper-3"
        >
          {isPending ? "儲存中..." : "儲存"}
        </button>
        {saved && !isPending && (
          <span className="font-mono text-[11px] text-moss">
            已儲存，重新整理即可看到最新內容。
          </span>
        )}
      </form>

      {template === "standard" && (
        <div className="mt-6 border-t border-line pt-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-faint">
            預覽
          </p>
          <StandardNoteArticle
            title={item.title}
            teaser={item.teaser}
            markdown={markdown}
          />
        </div>
      )}
    </div>
  );
}
