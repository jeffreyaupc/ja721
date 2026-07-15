import { createClient } from "@/lib/supabase/server";
import type { Category, Item, SiteSettings } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getItems(): Promise<Item[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*, notes(*)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...row,
    notes: Array.isArray(row.notes) ? (row.notes[0] ?? null) : row.notes,
  }));
}

export async function getNoteBySlug(slug: string): Promise<Item | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*, notes!inner(*)")
    .eq("notes.slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    notes: Array.isArray(data.notes) ? (data.notes[0] ?? null) : data.notes,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .single();

  if (error) throw error;
  return data;
}
