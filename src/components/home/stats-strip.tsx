import type { Stat } from "@/lib/types";

export function StatsStrip({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <section aria-label="At a glance" className="border-y border-line bg-bg-soft">
      <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col px-2 py-8 md:px-6">
            <dt className="order-2 mt-1 text-sm font-semibold text-muted">{stat.label}</dt>
            <dd className="font-display text-5xl font-black text-accent md:text-6xl">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
