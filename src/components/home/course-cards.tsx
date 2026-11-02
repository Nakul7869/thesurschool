import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Course } from "@/lib/types";

export function CourseCards({ courses }: { courses: Course[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {courses.map((course) => (
        <li key={course.id}>
          <Link
            href={`/courses#${course.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-brand"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-4xl font-black text-ink">{course.name}</h3>
              <ArrowUpRight className="size-6 shrink-0 text-accent transition group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </div>
            {course.tagline ? <p className="mt-2 text-muted">{course.tagline}</p> : null}
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${course.name} levels`}>
              {course.levels.map((level) => (
                <li key={level.id} className="rounded-full border border-line px-3 py-1 text-sm font-semibold text-ink">
                  {level.levelName}
                </li>
              ))}
              {course.levels.some((level) => level.offersGrading) ? (
                <li className="rounded-full bg-brand px-3 py-1 text-sm font-semibold text-on-brand">Grading classes</li>
              ) : null}
            </ul>
          </Link>
        </li>
      ))}
    </ul>
  );
}
