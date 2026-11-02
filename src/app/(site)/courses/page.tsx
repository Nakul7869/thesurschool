import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/brand-icons";
import { ButtonLink } from "@/components/ui/button-link";
import { PageTitle, Section } from "@/components/ui/section";
import { getCourses, getSiteSettings } from "@/lib/data";
import { courseWhatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Courses and fees",
  description: "Piano, guitar and ukulele lessons at every level, with grading classes. Online or at your home.",
};

export default async function CoursesPage() {
  const [settings, courses] = await Promise.all([getSiteSettings(), getCourses()]);
  return (
    <>
      <PageTitle title="Courses and fees">
        {settings.classModesNote} {settings.gradingNote}
      </PageTitle>
      {courses.map((course) => (
        <Section key={course.id} className="!pb-4 !pt-10">
          <div id={course.slug} className="scroll-mt-28">
            <h2 className="font-display text-5xl font-black text-ink md:text-6xl">{course.name}</h2>
            {course.tagline ? <p className="mt-2 text-lg text-muted">{course.tagline}</p> : null}
            {course.description ? <p className="mt-3 max-w-2xl text-ink/90">{course.description}</p> : null}
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {course.levels.map((level) => {
                const book = courseWhatsappLink(settings, { instrument: course.name, level: level.levelName });
                const grading = courseWhatsappLink(settings, { instrument: course.name, level: level.levelName, grading: true });
                return (
                  <li key={level.id} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
                    <h3 className="text-2xl font-bold text-ink">{level.levelName}</h3>
                    {level.description ? <p className="mt-2 text-muted">{level.description}</p> : null}
                    <dl className="mt-4 space-y-2 text-sm">
                      {level.duration ? <Row term="Class length" value={level.duration} /> : null}
                      <Row term="Fee" value={level.fee || "Ask on WhatsApp"} />
                      {level.offersGrading ? <Row term="Grading classes" value={level.gradingFee || "Available"} /> : null}
                    </dl>
                    <div className="mt-6 flex flex-col gap-2">
                      {book ? (
                        <ButtonLink href={book} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="min-h-11 text-sm">
                          <WhatsAppIcon className="size-4" />
                          Book {level.levelName}
                        </ButtonLink>
                      ) : null}
                      {level.offersGrading && grading ? (
                        <ButtonLink href={grading} target="_blank" rel="noopener noreferrer" variant="outline" className="min-h-11 text-sm">
                          <GraduationCap className="size-4" aria-hidden="true" />
                          Ask about grading
                        </ButtonLink>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Section>
      ))}
      <div className="pb-14" />
    </>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-line pt-2">
      <dt className="text-muted">{term}</dt>
      <dd className="text-right font-bold text-ink">{value}</dd>
    </div>
  );
}
