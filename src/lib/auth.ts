import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function getIsAuthor(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return !!user && !error;
}

/** Throws unless called by an authenticated session. Every Server Action that mutates data must call this first — it is the real authorization boundary, not the UI that invoked the action. */
export async function requireAuthor(): Promise<void> {
  if (!(await getIsAuthor())) {
    throw new Error("Unauthorized");
  }
}
