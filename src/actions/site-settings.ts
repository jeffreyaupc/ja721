"use server";

import { revalidatePath } from "next/cache";
import { requireAuthor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export async function updateSiteSettingsField(
  field: keyof SiteSettings,
  value: string
) {
  await requireAuthor();
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq("id", true);
  if (error) throw error;

  revalidatePath("/");
}
