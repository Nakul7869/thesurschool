"use client";

import { useId, useRef, useState } from "react";
import { prepareImage } from "@/lib/image-client";
import { photoProblem } from "@/lib/image-size";
import { MEDIA_BUCKET } from "@/lib/media";
import { createClient } from "@/lib/supabase/browser";

type ImageUploaderProps = {
  folder: "teacher" | "gallery";
  multiple?: boolean;
  label: string;
  onUploaded: (paths: string[]) => void | Promise<void>;
};

/** Picks photos, shrinks them, uploads them to the site-media bucket and reports the stored paths. */
export function ImageUploader({ folder, multiple = false, label, onUploaded }: ImageUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);

  async function handleFiles(files: File[]) {
    if (files.length === 0) return;
    setBusy(true);
    setProblems([]);
    const supabase = createClient();
    const uploaded: string[] = [];
    const failed: string[] = [];

    for (const file of files) {
      const problem = photoProblem(file);
      if (problem) {
        failed.push(problem);
        continue;
      }
      try {
        const blob = await prepareImage(file);
        const path = `${folder}/${crypto.randomUUID()}.webp`;
        const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
        if (error) throw new Error(error.message);
        uploaded.push(path);
      } catch (error) {
        failed.push(`${file.name} could not be uploaded${error instanceof Error ? `: ${error.message}` : "."}`);
      }
    }

    try {
      if (uploaded.length > 0) await onUploaded(uploaded);
    } catch {
      failed.push("The photos were uploaded but could not be saved. Please check your connection and try again.");
    } finally {
      setProblems(failed);
      if (inputRef.current) inputRef.current.value = "";
      setBusy(false);
    }
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 border-brand px-6 text-sm font-bold text-ink hover:bg-brand hover:text-on-brand ${busy ? "pointer-events-none opacity-60" : ""}`}
      >
        {busy ? "Uploading…" : label}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        disabled={busy}
        className="sr-only"
        onChange={(event) => void handleFiles(Array.from(event.target.files ?? []))}
      />
      {problems.length > 0 ? (
        <ul role="alert" className="mt-3 space-y-1 text-sm font-semibold text-red-700">
          {problems.map((problem, index) => (
            <li key={`${index}-${problem}`}>{problem}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
