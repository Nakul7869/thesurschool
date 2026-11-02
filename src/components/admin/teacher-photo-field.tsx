"use client";

import Image from "next/image";
import { useState } from "react";
import { SUPABASE_URL } from "@/lib/env";
import { publicMediaUrl } from "@/lib/media";
import { ImageUploader } from "./image-uploader";

/** Shows the teacher's photo, lets the admin upload a new one, and sends the stored path with the form. */
export function TeacherPhotoField({ initialPath }: { initialPath: string | null }) {
  const [path, setPath] = useState(initialPath ?? "");
  const url = publicMediaUrl(SUPABASE_URL, path);

  return (
    <div>
      <p className="text-sm font-bold text-ink">Teacher photo</p>
      <div className="mt-2 flex flex-wrap items-center gap-5">
        <div className="relative size-28 overflow-hidden rounded-xl bg-bg-soft">
          {url ? <Image src={url} alt="Current teacher photo" fill sizes="112px" className="object-cover" /> : null}
        </div>
        <div className="space-y-2">
          <ImageUploader folder="teacher" label={path ? "Replace photo" : "Upload photo"} onUploaded={(paths) => setPath(paths[0])} />
          {path ? (
            <button type="button" onClick={() => setPath("")} className="text-sm font-bold text-red-700 underline">
              Remove photo
            </button>
          ) : null}
          <p className="text-sm text-muted">Remember to press Save changes after choosing a photo.</p>
        </div>
      </div>
      <input type="hidden" name="teacherPhotoPath" value={path} />
    </div>
  );
}
