"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addGalleryPhotos } from "@/app/admin/actions/gallery";
import { ImageUploader } from "./image-uploader";

export function GalleryUploader() {
  const router = useRouter();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleUploaded(paths: string[]) {
    const result = await addGalleryPhotos(paths);
    setMessage({ ok: result.status === "success", text: result.message });
    router.refresh();
  }

  return (
    <div>
      <ImageUploader folder="gallery" multiple label="Choose photos to upload" onUploaded={handleUploaded} />
      {message ? (
        <p role="status" className={`mt-3 text-sm font-semibold ${message.ok ? "text-green-800" : "text-red-700"}`}>
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
