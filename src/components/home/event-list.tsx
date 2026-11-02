import { formatEventDate } from "@/lib/format";
import type { SchoolEvent } from "@/lib/types";

/** Dated rows with tag pills, in the style of the reference site's "Recent Posts". */
export function EventList({ events, emptyText }: { events: SchoolEvent[]; emptyText: string }) {
  if (events.length === 0) return <p className="rounded-2xl border border-dashed border-line p-8 text-muted">{emptyText}</p>;
  return (
    <ul className="divide-y divide-line border-y border-line">
      {events.map((event) => (
        <li key={event.id} className="grid gap-2 py-5 md:grid-cols-[9rem_1fr_auto] md:items-start md:gap-6">
          <time dateTime={event.startsOn} className="text-sm font-semibold text-muted">
            {formatEventDate(event.startsOn)}
          </time>
          <div>
            <h3 className="text-xl font-bold text-ink">
              {event.title}
              {event.kind === "news" ? (
                <span className="ml-2 rounded-full bg-brand px-2 py-0.5 align-middle text-xs font-bold uppercase tracking-wider text-on-brand">News</span>
              ) : null}
            </h3>
            {event.summary ? <p className="mt-1 text-muted">{event.summary}</p> : null}
            {event.details ? <p className="mt-2 whitespace-pre-line text-ink/90">{event.details}</p> : null}
            {event.location ? <p className="mt-2 text-sm font-semibold text-accent">{event.location}</p> : null}
          </div>
          {event.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2 md:justify-end" aria-label="Tags">
              {event.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
