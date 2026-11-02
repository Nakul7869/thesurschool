import { getAdminEvents } from "@/lib/admin-data";
import { EventEditor } from "./event-editor";

export default async function EventsAdminPage() {
  const events = await getAdminEvents();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-black">Events and news</h1>
      <EventEditor />
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id}>
            <EventEditor event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
}
