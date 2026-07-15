"use server";

import { revalidatePath } from "next/cache";
import { requireAuthor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { randomSuffix } from "@/lib/slug";
import type { NoteTemplate } from "@/lib/types";

export async function updateNoteBody(itemId: string, formData: FormData) {
  await requireAuthor();
  const supabase = await createClient();

  const template = String(formData.get("template") ?? "standard") as NoteTemplate;
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) throw new Error("Slug is required");

  const { error } = await supabase
    .from("notes")
    .update({
      slug,
      template,
      markdown_body: (formData.get("markdown_body") as string) || null,
      custom_html: (formData.get("custom_html") as string) || null,
      custom_css: (formData.get("custom_css") as string) || null,
      updated_at: new Date().toISOString(),
    })
    .eq("item_id", itemId);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/notes/[slug]", "page");
}

/** Uploads an image for use inside a note's body and returns its public URL — does not write to any DB field itself, the caller inserts the URL into the note's markdown/HTML content. */
export async function uploadNoteImage(
  itemId: string,
  formData: FormData
): Promise<string> {
  await requireAuthor();
  const supabase = await createClient();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("No file provided");

  const ext = file.name.split(".").pop() || "bin";
  const path = `notes/${itemId}-${randomSuffix(6)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  return publicUrl;
}
