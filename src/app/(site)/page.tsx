import Link from "next/link";
import { CourseCards } from "@/components/home/course-cards";
import { CtaBand } from "@/components/home/cta-band";
import { EventList } from "@/components/home/event-list";
import { GalleryGrid } from "@/components/home/gallery-grid";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { StatsStrip } from "@/components/home/stats-strip";
import { Section, SectionHeading } from "@/components/ui/section";
import { getCourses, getEvents, getGallery, getSiteSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { serializeJsonLd } from "@/lib/json-ld";

const PREVIEW_EVENTS = 3;
const PREVIEW_PHOTOS = 6;

export default async function HomePage() {
  const [settings, courses, events, gallery] = await Promise.all([getSiteSettings(), getCourses(), getEvents(), getGallery()]);
  const preview = [...events.upcoming, ...events.past].slice(0, PREVIEW_EVENTS);
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicSchool",
    name: settings.schoolName,
    description: settings.tagline,
    url: SITE_URL,
    email: settings.email,
    telephone: `+${settings.phone.replace(/\D/g, "")}`,
    founder: { "@type": "Person", name: settings.teacherName },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <Hero settings={settings} />
      <StatsStrip stats={settings.stats} />
      <Section>
        <SectionHeading eyebrow="Courses" title="Pick your instrument">
          {settings.gradingNote}
        </SectionHeading>
        <CourseCards courses={courses} />
        <p className="mt-8">
          <Link href="/courses" className="font-bold text-accent underline underline-offset-4">
            See all levels and fees
          </Link>
        </p>
      </Section>
      <HowItWorks />
      <Section>
        <SectionHeading eyebrow="Events and news" title="What's happening" />
        <EventList events={preview} emptyText="No events yet. Message us on WhatsApp to hear about upcoming recitals and workshops." />
        {preview.length > 0 ? (
          <p className="mt-8">
            <Link href="/events" className="font-bold text-accent underline underline-offset-4">
              All events and news
            </Link>
          </p>
        ) : null}
      </Section>
      {gallery.length > 0 ? (
        <Section>
          <SectionHeading eyebrow="Gallery" title="Moments from class" />
          <GalleryGrid items={gallery.slice(0, PREVIEW_PHOTOS)} emptyText="" />
          <p className="mt-8">
            <Link href="/gallery" className="font-bold text-accent underline underline-offset-4">
              Open the gallery
            </Link>
          </p>
        </Section>
      ) : null}
      <CtaBand settings={settings} />
    </>
  );
}
