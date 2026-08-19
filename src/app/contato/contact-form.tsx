"use client";

import { useActionState } from "react";
import { submitInquiry } from "./actions";
import { initialContactFormState } from "./contact-form-state";

type ExpeditionOption = { id: string; name: string };

export function ContactForm({
  expeditions,
  defaultExpeditionId,
}: {
  expeditions: ExpeditionOption[];
  defaultExpeditionId?: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialContactFormState
  );

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-lg font-semibold text-primary">Solicitação enviada</p>
        <p className="mt-2 text-foreground/90">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
          />
          {state.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground">
            Telefone (opcional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {expeditions.length > 0 && (
        <div>
          <label htmlFor="expeditionId" className="block text-sm font-medium text-foreground">
            Expedição de interesse (opcional)
          </label>
          <select
            id="expeditionId"
            name="expeditionId"
            defaultValue={defaultExpeditionId ?? ""}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Não sei ainda / quero orientação</option>
            {expeditions.map((expedition) => (
              <option key={expedition.id} value={expedition.id}>
                {expedition.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Conte um pouco sobre datas de interesse, número de viajantes e outras dúvidas."
          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
        />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Enviando…" : "Enviar solicitação"}
      </button>
    </form>
  );
}
