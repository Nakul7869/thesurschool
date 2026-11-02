import Link from "next/link";
import { getAdminCourses, getAdminEvents, getAdminGallery, getAdminSettings } from "@/lib/admin-data";
import { hasSupabase } from "@/lib/env";

export default async function AdminHome() {
  const [settings, courses, gallery, events] = await Promise.all([getAdminSettings(), getAdminCourses(), getAdminGallery(), getAdminEvents()]);
  const levels = courses.reduce((total, course) => total + course.levels.length, 0);
  const todo = [
    !settings.teacherPhotoPath && { text: "Add a photo of the teacher", href: "/admin/settings" },
    !settings.instagramUrl && !settings.youtubeUrl && !settings.facebookUrl && { text: "Add social media links", href: "/admin/settings" },
    !settings.serviceArea && { text: "Say which areas you cover for home visits", href: "/admin/settings" },
    courses.some((course) => course.levels.some((level) => !level.fee || level.fee === "Ask on WhatsApp")) && { text: "Set the fees for each level", href: "/admin/courses" },
    gallery.length === 0 && { text: "Upload your first gallery photos", href: "/admin/gallery" },
  ].filter((item): item is { text: string; href: string } => Boolean(item));

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl font-black">Welcome, {settings.teacherName}</h1>
      {!hasSupabase ? <p className="rounded-lg bg-red-100 px-4 py-3 font-semibold text-red-900">Supabase is not connected.</p> : null}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Courses" value={courses.length} detail={`${levels} levels`} href="/admin/courses" />
        <Stat label="Gallery items" value={gallery.length} href="/admin/gallery" />
        <Stat label="Events and news" value={events.length} href="/admin/events" />
        <Stat label="Contact details" value="Edit" href="/admin/settings" />
      </ul>
      <section aria-labelledby="todo" className="rounded-2xl border border-line bg-surface p-6">
        <h2 id="todo" className="text-xl font-bold">
          Next steps
        </h2>
        {todo.length === 0 ? (
          <p className="mt-2 text-muted">Everything is filled in. Nice work.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {todo.map((item) => (
              <li key={item.text}>
                <Link href={item.href} className="font-semibold text-accent underline underline-offset-4">
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, detail, href }: { label: string; value: number | string; detail?: string; href: string }) {
  return (
    <li>
      <Link href={href} className="block rounded-2xl border border-line bg-surface p-5 transition hover:border-brand">
        <span className="text-sm font-bold text-muted">{label}</span>
        <span className="mt-1 block font-display text-4xl font-black text-accent">{value}</span>
        {detail ? <span className="text-sm text-muted">{detail}</span> : null}
      </Link>
    </li>
  );
}
