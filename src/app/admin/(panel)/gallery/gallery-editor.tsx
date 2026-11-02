"use client";

import Image from "next/image";
import { addGalleryVideo, deleteGalleryItem, updateGalleryItem } from "@/app/admin/actions/gallery";
import { AdminForm, Checkbox, DeleteButton, Field, SubmitButton } from "@/components/admin/form-parts";
import { SUPABASE_URL } from "@/lib/env";
import { parseYouTube, publicMediaUrl } from "@/lib/media";
import type { GalleryItem } from "@/lib/types";

export function VideoForm() {
  return (
    <AdminForm action={addGalleryVideo} className="space-y-4" resetOnSuccess>
      <Field label="YouTube link" name="videoUrl" type="url" required placeholder="https://www.youtube.com/watch?v=..." />
      <Field label="Caption" name="caption" />
      <SubmitButton>Add video</SubmitButton>
    </AdminForm>
  );
}

export function GalleryItemEditor({ item }: { item: GalleryItem }) {
  const thumb = item.kind === "photo" ? publicMediaUrl(SUPABASE_URL, item.storagePath) : (parseYouTube(item.videoUrl ?? "")?.thumbnailUrl ?? null);
  const alt = item.caption || (item.kind === "photo" ? "Gallery photo" : "Gallery video");
  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-4">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-bg-soft">
        {thumb ? <Image src={thumb} alt={alt} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" /> : null}
        {!item.isPublished ? <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white">Hidden</span> : null}
      </div>
      <AdminForm action={updateGalleryItem} className="space-y-3">
        <input type="hidden" name="id" value={item.id} />
        <Field label="Caption" name="caption" defaultValue={item.caption} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Order" name="sortOrder" type="number" defaultValue={item.sortOrder} />
          <Checkbox label="Show on the website" name="isPublished" defaultChecked={item.isPublished} />
        </div>
        <SubmitButton>Save</SubmitButton>
      </AdminForm>
      <form action={deleteGalleryItem}>
        <input type="hidden" name="id" value={item.id} />
        <DeleteButton what={item.kind === "photo" ? "this photo" : "this video"} />
      </form>
    </div>
  );
}
