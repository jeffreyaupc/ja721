"use server";

import { revalidatePath } from "next/cache";
import { requireAuthor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify, randomSuffix } from "@/lib/slug";

function parseTags(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function itemFieldsFromFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    teaser: (formData.get("teaser") as string) || null,
    body: (formData.get("body") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    audio_url: (formData.get("audio_url") as string) || null,
    song_kind: (formData.get("song_kind") as string) || null,
    tags: parseTags(formData.get("tags")),
  };
}

export async function createItem(formData: FormData) {
  await requireAuthor();
  const supabase = await createClient();

  const categoryId = String(formData.get("category_id") ?? "");
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .single();
  if (categoryError) throw categoryError;

  const fields = itemFieldsFromFormData(formData);

  const { data: item, error } = await supabase
    .from("items")
    .insert({ category_id: categoryId, ...fields })
    .select("id")
    .single();
  if (error) throw error;

  if (category.display_style === "note_page") {
    await supabase.from("notes").insert({
      item_id: item.id,
      slug: `${slugify(fields.title)}-${randomSuffix(4)}`,
      template: "standard",
      markdown_body: "",
    });
  }

  revalidatePath("/");
}

export async function updateItem(itemId: string, formData: FormData) {
  await requireAuthor();
  const supabase = await createClient();
  const fields = itemFieldsFromFormData(formData);

  const { error } = await supabase
    .from("items")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/notes/[slug]", "page");
}

export async function updateItemField(
  itemId: string,
  field: "title" | "teaser",
  value: string
) {
  await requireAuthor();
  const supabase = await createClient();

  const { error } = await supabase
    .from("items")
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/notes/[slug]", "page");
}

export async function updateItemCategory(itemId: string, categoryId: string) {
  await requireAuthor();
  const supabase = await createClient();

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .single();
  if (categoryError) throw categoryError;

  const { error } = await supabase
    .from("items")
    .update({ category_id: categoryId, updated_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) throw error;

  if (category.display_style === "note_page") {
    const { data: existingNote } = await supabase
      .from("notes")
      .select("item_id")
      .eq("item_id", itemId)
      .maybeSingle();

    if (!existingNote) {
      const { data: item } = await supabase
        .from("items")
        .select("title")
        .eq("id", itemId)
        .single();
      await supabase.from("notes").insert({
        item_id: itemId,
        slug: `${slugify(item?.title ?? "note")}-${randomSuffix(4)}`,
        template: "standard",
        markdown_body: "",
      });
    }
  }

  revalidatePath("/");
}

export async function deleteItem(itemId: string) {
  await requireAuthor();
  const supabase = await createClient();

  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) throw error;

  revalidatePath("/");
}

export async function uploadMedia(
  itemId: string,
  field: "image_url" | "audio_url",
  formData: FormData
) {
  await requireAuthor();
  const supabase = await createClient();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("No file provided");

  const folder = field === "image_url" ? "images" : "audio";
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${itemId}-${randomSuffix(6)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  const { error } = await supabase
    .from("items")
    .update({ [field]: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) throw error;

  revalidatePath("/");
}
