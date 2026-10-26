"use server";

import { z } from "zod";
import { sendFormEmail } from "@/lib/mail";

export type LeadFormState = { status: "idle" | "success" | "error"; message?: string };

// Cada formulário manda um "kind" e os campos com o rótulo em português
// (name="f:Rótulo"). O email chega com os rótulos como estão no site.
const SUBJECTS: Record<string, string> = {
  vip: "Nova inscrição na lista VIP",
  newsletter: "Nova inscrição na newsletter",
  pedido: "Novo pedido de viagem",
  sorteio: "Nova inscrição no sorteio",
};

const email = z.string().trim().email();

export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  // Campo escondido: quem preenche é robô.
  if (String(formData.get("company") ?? "").trim()) return { status: "success" };

  const kind = String(formData.get("kind") ?? "");
  const subject = SUBJECTS[kind];
  if (!subject) return { status: "error", message: "Formulário inválido." };

  const values = new Map<string, string[]>();
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("f:") || typeof value !== "string" || !value.trim()) continue;
    const label = key.slice(2).slice(0, 80);
    values.set(label, [...(values.get(label) ?? []), value.trim().slice(0, 4000)]);
  }

  const replyTo = values.get("Email")?.[0] ?? "";
  if (!email.safeParse(replyTo).success) return { status: "error", message: "Informe um email válido." };
  const name = values.get("Nome")?.[0] ?? "";
  if (!name) return { status: "error", message: "Informe o seu nome." };

  const lines = [...values.entries()].map(([label, list]) =>
    list.length > 1 || label.length > 40 ? `${label}:\n  ${list.join("\n  ")}` : `${label}: ${list[0]}`,
  );

  try {
    await sendFormEmail({ subject: `${subject}: ${name}`, replyTo, lines });
  } catch (error) {
    console.error(`Falha ao enviar o formulário ${kind}:`, error);
    return {
      status: "error",
      message:
        "Não foi possível enviar agora. Tente de novo em instantes ou escreva direto para contato@destinospolares.com.br.",
    };
  }
  return { status: "success" };
}
