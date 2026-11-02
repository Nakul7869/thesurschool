import "server-only";
import { updateTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SITE_TAG } from "@/lib/data";
import { MEDIA_BUCKET } from "@/lib/media";

/** Makes public pages show an admin edit straight away. */
export function publishChanges(): void {
  updateTag(SITE_TAG);
}

/** Deletes photo files. A failure only leaves an unused file behind, so it is logged and not shown to the admin. */
export async function removeMedia(supabase: SupabaseClient, paths: (string | null | undefined)[]): Promise<void> {
  const real = paths.filter((path): path is string => Boolean(path));
  if (real.length === 0) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(real);
  if (error) console.error("Could not remove old photo files", error.message);
}

export function logDbError(what: string, message: string): void {
  console.error(`Database error while ${what}:`, message);
}
