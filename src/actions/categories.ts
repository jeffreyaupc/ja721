"use server";

import { revalidatePath } from "next/cache";
import { requireAuthor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify, randomSuffix } from "@/lib/slug";
import type { DisplayStyle } from "@/lib/types";

export async function createCategory(formData: FormData) {
  await requireAuthor();
  const supabase = await createClient();

  const label = String(formData.get("label") ?? "").trim();
  const displayStyle = String(formData.get("display_style") ?? "") as DisplayStyle;
  if (!label || !displayStyle) throw new Error("Label and display style are required");

  const { count } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase.from("categories").insert({
    slug: `${slugify(label)}-${randomSuffix(4)}`,
    label,
    display_style: displayStyle,
    sort_order: count ?? 0,
  });
  if (error) throw error;

  revalidatePath("/");
}

export async function renameCategory(categoryId: string, label: string) {
  await requireAuthor();
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({ label })
    .eq("id", categoryId);
  if (error) throw error;

  revalidatePath("/");
}

export async function moveCategory(categoryId: string, direction: "up" | "down") {
  await requireAuthor();
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;

  const index = categories.findIndex((c) => c.id === categoryId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= categories.length) return;

  const current = categories[index];
  const swapWith = categories[swapIndex];

  await supabase.from("categories").update({ sort_order: swapWith.sort_order }).eq("id", current.id);
  await supabase.from("categories").update({ sort_order: current.sort_order }).eq("id", swapWith.id);

  revalidatePath("/");
}

export async function deleteCategory(categoryId: string): Promise<{ error?: string }> {
  await requireAuthor();
  const supabase = await createClient();

  const { count } = await supabase
    .from("items")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (count && count > 0) {
    return { error: "請先移除或改分類此分類下的內容，才能刪除分類。" };
  }

  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) throw error;

  revalidatePath("/");
  return {};
}
