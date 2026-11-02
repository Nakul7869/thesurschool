"use client";

import { createContext, startTransition, useContext, useEffect, useId, useRef, type FormEvent, type ReactNode } from "react";
import { useActionState } from "react";
import { IDLE_STATE, type ActionState } from "@/lib/action-state";

type FormContextValue = { state: ActionState; pending: boolean };
const FormContext = createContext<FormContextValue>({ state: IDLE_STATE, pending: false });

type AdminFormProps = {
  action: (previous: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
};

/**
 * Form that shows saving, success and error messages. It submits by hand so that
 * a rejected form keeps what the admin typed instead of resetting to the saved values.
 */
export function AdminForm({ action, children, className, resetOnSuccess }: AdminFormProps) {
  const [state, formAction, pending] = useActionState(action, IDLE_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state.status === "success") formRef.current?.reset();
  }, [resetOnSuccess, state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <FormContext value={{ state, pending }}>
      <form ref={formRef} onSubmit={onSubmit} className={className} noValidate>
        {children}
        <StatusMessage />
      </form>
    </FormContext>
  );
}

function StatusMessage() {
  const { state } = useContext(FormContext);
  if (state.status === "idle") return null;
  const isError = state.status === "error";
  return (
    <p role={isError ? "alert" : "status"} className={`mt-3 rounded-lg px-4 py-3 text-sm font-semibold ${isError ? "bg-red-100 text-red-900" : "bg-green-100 text-green-900"}`}>
      {state.message}
    </p>
  );
}

export function SubmitButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { pending } = useContext(FormContext);
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-bold text-on-brand transition hover:opacity-90 disabled:opacity-60 ${className}`}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: "text" | "email" | "tel" | "url" | "date" | "number";
  hint?: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
};

const inputClass = "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-base text-ink placeholder:text-muted/70";

export function Field({ label, name, defaultValue = "", type = "text", hint, rows, required, placeholder, maxLength }: FieldProps) {
  const { state } = useContext(FormContext);
  const uid = useId();
  const error = state.errors[name];
  const describedBy = [hint ? `${uid}-hint` : "", error ? `${uid}-error` : ""].filter(Boolean).join(" ") || undefined;
  const shared = { id: uid, name, defaultValue, required, placeholder, maxLength, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy };
  return (
    <div>
      <label htmlFor={uid} className="text-sm font-bold text-ink">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      {rows ? <textarea rows={rows} className={inputClass} {...shared} /> : <input type={type} className={inputClass} {...shared} />}
      {hint ? (
        <p id={`${uid}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${uid}-error`} className="mt-1 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Checkbox({ label, name, defaultChecked = false }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-ink">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-5 accent-[var(--brand)]" />
      {label}
    </label>
  );
}

/** Delete button that asks "are you sure?" first. Put it inside a `<form action={deleteAction}>`. */
export function DeleteButton({ what, children = "Delete" }: { what: string; children?: ReactNode }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(`Delete ${what}? This cannot be undone.`)) event.preventDefault();
      }}
      className="inline-flex min-h-11 items-center rounded-full border border-red-300 px-5 text-sm font-bold text-red-700 hover:bg-red-50"
    >
      {children}
    </button>
  );
}
