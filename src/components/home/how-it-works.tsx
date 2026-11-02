import { Section, SectionHeading } from "@/components/ui/section";

const STEPS = [
  { title: "Message us", text: "Send a WhatsApp message or call. Tell us which instrument and level you are interested in." },
  { title: "Pick your course", text: "Choose piano, guitar or ukulele, at the level that suits you, with or without grading classes." },
  { title: "Start learning", text: "Join your classes online or at your home, and build your skills step by step." },
];

export function HowItWorks() {
  return (
    <Section>
      <SectionHeading eyebrow="Booking" title="How to book a session" />
      <ol className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-line bg-surface p-6">
            <span className="font-display text-5xl font-black text-accent">{index + 1}</span>
            <h3 className="mt-3 text-xl font-bold text-ink">{step.title}</h3>
            <p className="mt-2 text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
