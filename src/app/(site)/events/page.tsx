import type { Metadata } from "next";
import { EventList } from "@/components/home/event-list";
import { PageTitle, Section, SectionHeading } from "@/components/ui/section";
import { getEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events and news",
  description: "Upcoming recitals, workshops and news from The Sur School.",
};

export default async function EventsPage() {
  const { upcoming, past } = await getEvents();
  return (
    <>
      <PageTitle title="Events and news">Recitals, workshops and updates from the school.</PageTitle>
      <Section className="!pt-8">
        <SectionHeading title="Upcoming" />
        <EventList events={upcoming} emptyText="Nothing is scheduled right now. Message us on WhatsApp to hear first about new events." />
      </Section>
      {past.length > 0 ? (
        <Section className="!pt-0">
          <SectionHeading title="Earlier" />
          <EventList events={past} emptyText="" />
        </Section>
      ) : null}
    </>
  );
}
