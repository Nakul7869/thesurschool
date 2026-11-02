"use server";

import { failure, success, type ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth";
import { toInternationalDigits } from "@/lib/contact";
import { firstErrors, formToObject, readStats, settingsSchema } from "@/lib/validation";
import { logDbError, publishChanges, removeMedia } from "./shared";

export async function saveSettings(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const parsed = settingsSchema.safeParse({ ...formToObject(formData), stats: readStats(formData) });
  if (!parsed.success) return failure("Some details need fixing.", firstErrors(parsed.error));
  const values = parsed.data;

  const { data: previous } = await supabase.from("site_settings").select("teacher_photo_path").eq("id", 1).maybeSingle();

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    school_name: values.schoolName,
    tagline: values.tagline,
    hero_heading: values.heroHeading,
    hero_subheading: values.heroSubheading,
    teacher_name: values.teacherName,
    teacher_title: values.teacherTitle,
    teacher_bio: values.teacherBio,
    teacher_photo_path: values.teacherPhotoPath || null,
    whatsapp_number: toInternationalDigits(values.whatsappNumber),
    phone: toInternationalDigits(values.phone),
    email: values.email,
    instagram_url: values.instagramUrl,
    youtube_url: values.youtubeUrl,
    facebook_url: values.facebookUrl,
    service_area: values.serviceArea,
    class_modes_note: values.classModesNote,
    grading_note: values.gradingNote,
    stats: values.stats,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    logDbError("saving settings", error.message);
    return failure("Could not save. Please try again.");
  }

  const oldPath = previous?.teacher_photo_path as string | null | undefined;
  if (oldPath && oldPath !== values.teacherPhotoPath) await removeMedia(supabase, [oldPath]);

  publishChanges();
  return success("Saved. The website is updated.");
}
