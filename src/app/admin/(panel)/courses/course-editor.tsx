"use client";

import { deleteCourse, deleteLevel, saveCourse, saveLevel } from "@/app/admin/actions/courses";
import { AdminForm, Checkbox, DeleteButton, Field, SubmitButton } from "@/components/admin/form-parts";
import type { Course, CourseLevel } from "@/lib/types";

export function CourseEditor({ course }: { course: Course }) {
  return (
    <section className="space-y-5 rounded-2xl border border-line bg-surface p-6" aria-label={course.name}>
      <AdminForm action={saveCourse} className="space-y-4">
        <input type="hidden" name="id" value={course.id} />
        <h2 className="font-display text-3xl font-black">{course.name}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" defaultValue={course.name} required />
          <Field label="Order on the page" name="sortOrder" type="number" defaultValue={course.sortOrder} hint="Smaller numbers come first." />
        </div>
        <Field label="Short line" name="tagline" defaultValue={course.tagline} />
        <Field label="Description" name="description" defaultValue={course.description} rows={3} />
        <Checkbox label="Show on the website" name="isPublished" defaultChecked={course.isPublished} />
        <SubmitButton>Save {course.name}</SubmitButton>
      </AdminForm>

      <h3 className="text-xl font-bold">Levels</h3>
      <ul className="space-y-4">
        {course.levels.map((level) => (
          <li key={level.id}>
            <LevelForm courseId={course.id} level={level} />
          </li>
        ))}
        <li>
          <LevelForm courseId={course.id} nextOrder={course.levels.length} />
        </li>
      </ul>

      <form action={deleteCourse} className="border-t border-line pt-4">
        <input type="hidden" name="id" value={course.id} />
        <DeleteButton what={`${course.name} and all its levels`}>Delete {course.name}</DeleteButton>
      </form>
    </section>
  );
}

function LevelForm({ courseId, level, nextOrder = 0 }: { courseId: string; level?: CourseLevel; nextOrder?: number }) {
  const isNew = !level;
  return (
    <details className="rounded-xl border border-line bg-bg p-4">
      <summary className="cursor-pointer text-base font-bold">{level ? `${level.levelName} (${level.fee || "no fee set"})` : "+ Add a level"}</summary>
      <AdminForm action={saveLevel} className="mt-4 space-y-4" resetOnSuccess={isNew}>
        <input type="hidden" name="courseId" value={courseId} />
        {level ? <input type="hidden" name="id" value={level.id} /> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Level name" name="levelName" defaultValue={level?.levelName} required placeholder="Basic" />
          <Field label="Order" name="sortOrder" type="number" defaultValue={level?.sortOrder ?? nextOrder} />
          <Field label="Fee" name="fee" defaultValue={level?.fee} placeholder="Ask on WhatsApp" />
          <Field label="Class length" name="duration" defaultValue={level?.duration} placeholder="45 minutes, twice a week" />
        </div>
        <Field label="What students learn" name="description" defaultValue={level?.description} rows={2} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Checkbox label="Grading classes available" name="offersGrading" defaultChecked={level?.offersGrading ?? true} />
          <Field label="Grading classes fee" name="gradingFee" defaultValue={level?.gradingFee} placeholder="Ask on WhatsApp" />
        </div>
        <Checkbox label="Show on the website" name="isPublished" defaultChecked={level?.isPublished ?? true} />
        <SubmitButton>{isNew ? "Add level" : "Save level"}</SubmitButton>
      </AdminForm>
      {level ? (
        <form action={deleteLevel} className="mt-3">
          <input type="hidden" name="id" value={level.id} />
          <DeleteButton what={`the ${level.levelName} level`} />
        </form>
      ) : null}
    </details>
  );
}

export function NewCourseForm() {
  return (
    <details className="rounded-2xl border border-dashed border-line p-6">
      <summary className="cursor-pointer text-lg font-bold">+ Add another instrument</summary>
      <AdminForm action={saveCourse} className="mt-4 space-y-4" resetOnSuccess>
        <Field label="Name" name="name" required placeholder="Violin" />
        <Field label="Short line" name="tagline" placeholder="Beginner to advanced" />
        <Field label="Description" name="description" rows={3} />
        <Field label="Order on the page" name="sortOrder" type="number" defaultValue={10} />
        <Checkbox label="Show on the website" name="isPublished" defaultChecked />
        <SubmitButton>Add instrument</SubmitButton>
      </AdminForm>
    </details>
  );
}
