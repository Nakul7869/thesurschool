"use client";

import { deleteEvent, saveEvent } from "@/app/admin/actions/events";
import { AdminForm, Checkbox, DeleteButton, Field, SubmitButton } from "@/components/admin/form-parts";
import { formatEventDate } from "@/lib/format";
import type { SchoolEvent } from "@/lib/types";

export function EventEditor({ event }: { event?: SchoolEvent }) {
  const isNew = !event;
  const kindId = `kind-${event?.id ?? "new"}`;
  return (
    <details className={`rounded-2xl border p-5 ${isNew ? "border-dashed border-line" : "border-line bg-surface"}`}>
      <summary className="cursor-pointer text-lg font-bold">
        {event ? `${formatEventDate(event.startsOn)}: ${event.title}${event.isPublished ? "" : " (hidden)"}` : "+ Add an event or news item"}
      </summary>
      <AdminForm action={saveEvent} className="mt-4 space-y-4" resetOnSuccess={isNew}>
        {event ? <input type="hidden" name="id" value={event.id} /> : null}
        <div>
          <label htmlFor={kindId} className="text-sm font-bold">
            Type
          </label>
          <select id={kindId} name="kind" defaultValue={event?.kind ?? "event"} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-base">
            <option value="event">Event</option>
            <option value="news">News</option>
          </select>
        </div>
        <Field label="Title" name="title" defaultValue={event?.title} required />
        <Field label="Date" name="startsOn" type="date" defaultValue={event?.startsOn} required />
        <Field label="Short summary" name="summary" defaultValue={event?.summary} />
        <Field label="Details" name="details" defaultValue={event?.details} rows={4} />
        <Field label="Place" name="location" defaultValue={event?.location} placeholder="Online" />
        <Field label="Tags" name="tags" defaultValue={event?.tags.join(", ")} hint="Separate with commas, for example: recital, piano" />
        <Checkbox label="Show on the website" name="isPublished" defaultChecked={event?.isPublished ?? true} />
        <SubmitButton>{isNew ? "Add" : "Save"}</SubmitButton>
      </AdminForm>
      {event ? (
        <form action={deleteEvent} className="mt-3">
          <input type="hidden" name="id" value={event.id} />
          <DeleteButton what="this item" />
        </form>
      ) : null}
    </details>
  );
}
