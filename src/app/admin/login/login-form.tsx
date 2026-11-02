"use client";

import { signIn } from "@/app/admin/actions/auth";
import { AdminForm, Field, SubmitButton } from "@/components/admin/form-parts";

export function LoginForm() {
  return (
    <AdminForm action={signIn} className="space-y-4 rounded-2xl border border-line bg-surface p-6">
      <Field label="Email" name="email" type="email" required />
      <PasswordField />
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </AdminForm>
  );
}

function PasswordField() {
  return (
    <div>
      <label htmlFor="password" className="text-sm font-bold">
        Password <span className="text-accent">*</span>
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-base"
      />
    </div>
  );
}
