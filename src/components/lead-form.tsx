"use client";

import { useActionState } from "react";
import { submitLead, type LeadFormState } from "@/app/_forms/actions";

export type Field =
  | { type: "text" | "email" | "tel" | "number"; label: string; required?: boolean; placeholder?: string; half?: boolean }
  | { type: "textarea"; label: string; required?: boolean; placeholder?: string }
  | { type: "select"; label: string; options: string[] }
  | { type: "checkboxes"; label: string; options: string[] }
  | { type: "checkbox"; label: string; hint?: string };

const INPUT =
  "mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-foreground focus:border-accent focus:outline-none";

export function LeadForm({
  kind,
  fields,
  submitLabel,
  successMessage,
  dark = false,
}: {
  kind: "vip" | "newsletter" | "pedido" | "sorteio";
  fields: Field[];
  submitLabel: string;
  successMessage: string;
  dark?: boolean;
}) {
  const [state, action, pending] = useActionState<LeadFormState, FormData>(submitLead, { status: "idle" });
  const text = dark ? "text-white" : "text-foreground";

  if (state.status === "success") {
    return (
      <div className={`rounded-xl border p-6 text-center ${dark ? "border-white/30" : "border-border bg-surface-muted"}`}>
        <p className={`font-semibold ${dark ? "text-white" : "text-primary"}`}>{successMessage}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="kind" value={kind} />
      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.status === "error" && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
          {state.message}
        </p>
      )}
      {fields.map((field) => {
        const name = `f:${field.label}`;
        if (field.type === "checkboxes") {
          return (
            <fieldset key={field.label} className="sm:col-span-2">
              <legend className={`text-sm font-medium ${text}`}>{field.label}</legend>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                {field.options.map((opt) => (
                  <label key={opt} className={`flex items-center gap-2 text-sm ${text}`}>
                    <input type="checkbox" name={name} value={opt} className="h-4 w-4 accent-[#079ec3]" />
                    {opt}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        }
        if (field.type === "checkbox") {
          return (
            <label key={field.label} className={`flex gap-2 text-sm sm:col-span-2 ${text}`}>
              <input type="checkbox" name={name} value="Sim" className="mt-0.5 h-4 w-4 shrink-0 accent-[#079ec3]" />
              <span>
                <span className="font-medium">{field.label}</span>
                {field.hint && <span className={dark ? "block text-white/70" : "block text-muted-foreground"}>{field.hint}</span>}
              </span>
            </label>
          );
        }
        if (field.type === "select") {
          return (
            <label key={field.label} className={`block text-sm font-medium ${text}`}>
              {field.label}
              <select name={name} className={INPUT} defaultValue="">
                <option value="">Escolha</option>
                {field.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </label>
          );
        }
        if (field.type === "textarea") {
          return (
            <label key={field.label} className={`block text-sm font-medium sm:col-span-2 ${text}`}>
              {field.label}
              <textarea name={name} rows={5} required={field.required} placeholder={field.placeholder} className={INPUT} />
            </label>
          );
        }
        return (
          <label key={field.label} className={`block text-sm font-medium ${field.half === false ? "sm:col-span-2" : ""} ${text}`}>
            {field.label}
            <input type={field.type} name={name} required={field.required} placeholder={field.placeholder} className={INPUT} />
          </label>
        );
      })}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
        >
          {pending ? "Enviando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
