import type { Metadata } from "next";
import { GalleryGrid } from "@/components/home/gallery-grid";
import { PageTitle, Section } from "@/components/ui/section";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and videos from classes and recitals at The Sur School.",
};

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <>
      <PageTitle title="Gallery">Photos and videos from classes and recitals.</PageTitle>
      <Section className="!pt-8">
        <GalleryGrid items={items} emptyText="Photos and videos will appear here soon." />
      </Section>
    </>
  );
}
