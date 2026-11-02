import { GalleryUploader } from "@/components/admin/gallery-uploader";
import { getAdminGallery } from "@/lib/admin-data";
import { GalleryItemEditor, VideoForm } from "./gallery-editor";

export default async function GalleryAdminPage() {
  const items = await getAdminGallery();
  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl font-black">Gallery</h1>
      <section className="space-y-3 rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-xl font-bold">Add photos</h2>
        <p className="text-muted">Choose one or more photos. They are made smaller automatically before uploading.</p>
        <GalleryUploader />
      </section>
      <section className="space-y-3 rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-xl font-bold">Add a YouTube video</h2>
        <VideoForm />
      </section>
      <section aria-label="Gallery items">
        {items.length === 0 ? <p className="text-muted">Nothing here yet.</p> : null}
        <ul className="grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <GalleryItemEditor item={item} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
