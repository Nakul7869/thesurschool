"use client";

import { saveSettings } from "@/app/admin/actions/settings";
import { AdminForm, Field, SubmitButton } from "@/components/admin/form-parts";
import { TeacherPhotoField } from "@/components/admin/teacher-photo-field";
import { formatPhone } from "@/lib/contact";
import type { SiteSettings } from "@/lib/types";

const STAT_ROWS = 6;

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-line bg-surface p-6">
      <legend className="px-2 text-lg font-bold">{title}</legend>
      {children}
    </fieldset>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  return (
    <AdminForm action={saveSettings} className="space-y-6">
      <Card title="School">
        <Field label="School name" name="schoolName" defaultValue={settings.schoolName} required />
        <Field label="Short description" name="tagline" defaultValue={settings.tagline} hint="Shown in the footer and in Google results." />
        <Field label="Home page headline" name="heroHeading" defaultValue={settings.heroHeading} required />
        <Field label="Home page introduction" name="heroSubheading" defaultValue={settings.heroSubheading} rows={3} />
      </Card>

      <Card title="Teacher">
        <TeacherPhotoField initialPath={settings.teacherPhotoPath} />
        <Field label="Name" name="teacherName" defaultValue={settings.teacherName} required />
        <Field label="Title" name="teacherTitle" defaultValue={settings.teacherTitle} hint="For example: Pianist and music teacher" />
        <Field label="About" name="teacherBio" defaultValue={settings.teacherBio} rows={8} hint="Leave an empty line between paragraphs." />
      </Card>

      <Card title="Contact">
        <Field label="WhatsApp number" name="whatsappNumber" type="tel" defaultValue={formatPhone(settings.whatsappNumber)} required hint="Students tap this to chat and book. Include the country code if it is not an Indian number." />
        <Field label="Phone number for calls" name="phone" type="tel" defaultValue={formatPhone(settings.phone)} required />
        <Field label="Email" name="email" type="email" defaultValue={settings.email} required />
        <Field label="Instagram link" name="instagramUrl" type="url" defaultValue={settings.instagramUrl} placeholder="https://instagram.com/..." />
        <Field label="YouTube link" name="youtubeUrl" type="url" defaultValue={settings.youtubeUrl} placeholder="https://youtube.com/..." />
        <Field label="Facebook link" name="facebookUrl" type="url" defaultValue={settings.facebookUrl} placeholder="https://facebook.com/..." />
      </Card>

      <Card title="Classes">
        <Field label="How classes are held" name="classModesNote" defaultValue={settings.classModesNote} rows={2} />
        <Field label="Home visit area" name="serviceArea" defaultValue={settings.serviceArea} rows={2} hint="Towns or areas you travel to. Leave empty to hide it." />
        <Field label="About grading classes" name="gradingNote" defaultValue={settings.gradingNote} rows={3} hint="You can mention the exam board here, for example Trinity or ABRSM." />
      </Card>

      <Card title="Numbers shown on the home page">
        <p className="text-sm text-muted">Leave a row empty to hide it. Both boxes in a row are needed.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: STAT_ROWS }, (_, index) => (
            <div key={index} className="grid grid-cols-[6rem_1fr] gap-3">
              <Field label="Number" name={`stats.${index}.value`} defaultValue={settings.stats[index]?.value ?? ""} placeholder="15+" />
              <Field label="Label" name={`stats.${index}.label`} defaultValue={settings.stats[index]?.label ?? ""} placeholder="Years playing" />
            </div>
          ))}
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-bg-soft/95 px-4 py-3 backdrop-blur">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </AdminForm>
  );
}
