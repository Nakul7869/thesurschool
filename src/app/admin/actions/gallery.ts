"use server";

import { z } from "zod";
import { failure, success, type ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth";
import {
  firstErrors,
  formToObject,
  galleryCaptionSchema,
  galleryPhotosSchema,
  galleryVideoSchema,
} from "@/lib/validation";
import { logDbError, publishChanges, removeMedia } from "./shared";

const idSchema = z.string().uuid();
const GALLERY_FOLDER = "gallery/";

/** Called from the browser after the photos have been uploaded to storage. */
export async function addGalleryPhotos(paths: string[]): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const parsed = galleryPhotosSchema.safeParse({ paths });
  if (!parsed.success || !parsed.data.paths.every((path) => path.startsWith(GALLERY_FOLDER))) {
    return failure("Those photos could not be added.");
  }
  const rows = parsed.data.paths.map((path) => ({ kind: "photo", storage_path: path }));
  const { error } = await supabase.from("gallery_items").insert(rows);
  if (error) {
    logDbError("adding gallery photos", error.message);
    return failure("The photos were uploaded but could not be added to the gallery. Please try again.");
  }
  publishChanges();
  return success(rows.length === 1 ? "Photo added." : `${rows.length} photos added.`);
}

export async function addGalleryVideo(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const parsed = galleryVideoSchema.safeParse(formToObject(formData));
  if (!parsed.success) return failure("Some details need fixing.", firstErrors(parsed.error));

  const { error } = await supabase.from("gallery_items").insert({
    kind: "video",
    video_url: parsed.data.videoUrl,
    caption: parsed.data.caption,
  });
  if (error) {
    logDbError("adding a gallery video", error.message);
    return failure("Could not save. Please try again.");
  }
  publishChanges();
  return success("Video added.");
}

export async function updateGalleryItem(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const id = idSchema.safeParse(formData.get("id"));
  const parsed = galleryCaptionSchema.safeParse(formToObject(formData));
  if (!id.success) return failure("That item could not be found.");
  if (!parsed.success) return failure("Some details need fixing.", firstErrors(parsed.error));

  const { error } = await supabase
    .from("gallery_items")
    .update({ caption: parsed.data.caption, is_published: parsed.data.isPublished, sort_order: parsed.data.sortOrder })
    .eq("id", id.data);
  if (error) {
    logDbError("updating a gallery item", error.message);
    return failure("Could not save. Please try again.");
  }
  publishChanges();
  return success("Saved.");
}

export async function deleteGalleryItem(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return;

  const { data } = await supabase.from("gallery_items").select("storage_path").eq("id", id.data).maybeSingle();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id.data);
  if (error) return logDbError("deleting a gallery item", error.message);

  await removeMedia(supabase, [data?.storage_path as string | null | undefined]);
  publishChanges();
}
