"use server";

import { failure, success, type ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth";
import { eventSchema, firstErrors, formToObject } from "@/lib/validation";
import { z } from "zod";
import { logDbError, publishChanges } from "./shared";

const idSchema = z.string().uuid();

export async function saveEvent(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const parsed = eventSchema.safeParse(formToObject(formData));
  if (!parsed.success) return failure("Some details need fixing.", firstErrors(parsed.error));
  const v = parsed.data;

  const row = {
    kind: v.kind,
    title: v.title,
    summary: v.summary,
    details: v.details,
    starts_on: v.startsOn,
    location: v.location,
    tags: v.tags,
    is_published: v.isPublished,
  };

  const rawId = formData.get("id");
  const id = typeof rawId === "string" && rawId !== "" ? idSchema.safeParse(rawId) : null;
  if (id && !id.success) return failure("That event could not be found.");

  const { error } = id ? await supabase.from("events").update(row).eq("id", id.data) : await supabase.from("events").insert(row);
  if (error) {
    logDbError("saving an event", error.message);
    return failure("Could not save. Please try again.");
  }
  publishChanges();
  return success(id ? "Event updated." : "Event added.");
}

export async function deleteEvent(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return;
  const { error } = await supabase.from("events").delete().eq("id", id.data);
  if (error) {
    logDbError("deleting an event", error.message);
    return;
  }
  publishChanges();
}
