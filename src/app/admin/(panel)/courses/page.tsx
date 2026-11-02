import { getAdminCourses } from "@/lib/admin-data";
import { CourseEditor, NewCourseForm } from "./course-editor";

export default async function CoursesAdminPage() {
  const courses = await getAdminCourses();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-black">Courses and fees</h1>
      <p className="max-w-2xl text-muted">
        Each instrument has levels. Fees are free text, so you can write &ldquo;₹1,500 per month&rdquo; or &ldquo;Ask on WhatsApp&rdquo;.
      </p>
      {courses.map((course) => (
        <CourseEditor key={course.id} course={course} />
      ))}
      <NewCourseForm />
    </div>
  );
}
