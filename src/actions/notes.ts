"use server";

import { revalidatePath } from "next/cache";
import { requireAuthor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
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
