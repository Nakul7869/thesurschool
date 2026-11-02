import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { StatsStrip } from "@/components/home/stats-strip";
import { LogoMark } from "@/components/brand/logo";
import { MediaImage } from "@/components/ui/media-image";
import { PageTitle, Section } from "@/components/ui/section";
import { getSiteSettings } from "@/lib/data";
import { paragraphs } from "@/lib/format";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the teacher behind The Sur School.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageTitle title={settings.teacherName}>{settings.teacherTitle}</PageTitle>
      <Section className="!pt-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="tilt-frame mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              {settings.teacherPhotoPath ? (
                <MediaImage
                  path={settings.teacherPhotoPath}
                  alt={`${settings.teacherName}, teacher at ${settings.schoolName}`}
                  sizes="(min-width: 1024px) 35vw, 90vw"
                  priority
                />
              ) : (
                <div className="grid h-full place-items-center text-accent">
                  <LogoMark className="w-1/2 opacity-90" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-5 text-lg text-ink/90">
            {paragraphs(settings.teacherBio).map((text) => (
              <p key={text}>{text}</p>
            ))}
            {settings.classModesNote ? <p className="font-semibold text-ink">{settings.classModesNote}</p> : null}
            {settings.serviceArea ? (
              <p>
                <span className="font-bold text-ink">Home visits: </span>
                {settings.serviceArea}
              </p>
            ) : null}
          </div>
        </div>
      </Section>
      <StatsStrip stats={settings.stats} />
      <div className="pt-16">
        <CtaBand settings={settings} />
      </div>
    </>
  );
}
