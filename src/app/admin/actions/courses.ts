"use server";

import { z } from "zod";
import { failure, success, type ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { courseSchema, firstErrors, formToObject, levelSchema } from "@/lib/validation";
import { logDbError, publishChanges } from "./shared";

const idSchema = z.string().uuid();
const UNIQUE_VIOLATION = "23505";

function optionalId(formData: FormData) {
  const raw = formData.get("id");
  return typeof raw === "string" && raw !== "" ? idSchema.safeParse(raw) : null;
}

export async function saveCourse(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const parsed = courseSchema.safeParse(formToObject(formData));
  if (!parsed.success) return failure("Some details need fixing.", firstErrors(parsed.error));
  const v = parsed.data;
  const row = { name: v.name, tagline: v.tagline, description: v.description, sort_order: v.sortOrder, is_published: v.isPublished };

  const id = optionalId(formData);
  if (id && !id.success) return failure("That course could not be found.");

  let error;
  if (id) {
    ({ error } = await supabase.from("courses").update(row).eq("id", id.data));
  } else {
    const slug = slugify(v.name);
    if (!slug) return failure("Some details need fixing.", { name: "Use letters or numbers in the name" });
    ({ error } = await supabase.from("courses").insert({ ...row, slug }));
    if (error?.code === UNIQUE_VIOLATION) return failure("Some details need fixing.", { name: "There is already a course with this name" });
  }
  if (error) {
    logDbError("saving a course", error.message);
    return failure("Could not save. Please try again.");
  }
  publishChanges();
  return success(id ? "Course updated." : "Course added.");
}

export async function deleteCourse(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return;
  const { error } = await supabase.from("courses").delete().eq("id", id.data);
  if (error) return logDbError("deleting a course", error.message);
  publishChanges();
}

export async function saveLevel(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const parsed = levelSchema.safeParse(formToObject(formData));
  if (!parsed.success) return failure("Some details need fixing.", firstErrors(parsed.error));
  const v = parsed.data;
  const row = {
    course_id: v.courseId,
    level_name: v.levelName,
    description: v.description,
    duration: v.duration,
    fee: v.fee,
    offers_grading: v.offersGrading,
    grading_fee: v.gradingFee,
    sort_order: v.sortOrder,
    is_published: v.isPublished,
  };

  const id = optionalId(formData);
  if (id && !id.success) return failure("That level could not be found.");

  const { error } = id ? await supabase.from("course_levels").update(row).eq("id", id.data) : await supabase.from("course_levels").insert(row);
  if (error) {
    logDbError("saving a level", error.message);
    return failure("Could not save. Please try again.");
  }
  publishChanges();
  return success(id ? "Level updated." : "Level added.");
}

export async function deleteLevel(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return;
  const { error } = await supabase.from("course_levels").delete().eq("id", id.data);
  if (error) return logDbError("deleting a level", error.message);
  publishChanges();
}
